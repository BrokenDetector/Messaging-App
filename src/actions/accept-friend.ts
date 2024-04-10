"use server";

import {
	getUserById,
	getUserFriendRequests,
	getUserFriends,
} from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { friendRequests, friends } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import * as z from "zod";

export const acceptFriend = async (data: string) => {
	const validatedField = z.string().safeParse(data);

	if (!validatedField.success) {
		return { error: "Invalid field" };
	}
	const idToAdd = validatedField.data;
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return { error: "Unauthorized" };
	}

	const currentUserId = session.user.id;

	const [UsersFriends, userToAddFriends, userToAdd, currentUser] =
		await Promise.all([
			getUserFriends(currentUserId),
			getUserFriends(idToAdd),
			getUserById(idToAdd),
			getUserById(currentUserId),
		]);

	const isAlreadyFriends = UsersFriends?.find(
		(friend) => friend?.id === idToAdd
	);

	if (isAlreadyFriends) {
		return { error: "Already friends" };
	}

	const hasFriendRequest = await getUserFriendRequests(currentUserId);

	if (!hasFriendRequest?.find((request) => request.senderId === idToAdd)) {
		return { error: "No friend request" };
	}

	const friendsIds = UsersFriends.map((friend) => {
		return friend?.id;
	}) as string[];

	// Add current user to friends list of userToAddFriends, so not only one user will get new friend :D
	const friendsIds2 = userToAddFriends?.map((friend) => {
		return friend?.id;
	}) as string[];

	// Friend list already exist, update with new friend id
	const newFriendList = [...friendsIds, idToAdd];
	const newFriendList2 = [...friendsIds2, currentUserId!];

	await Promise.all([
		pusherServer.trigger(`${idToAdd}_friends`, "new_friend", currentUser),

		pusherServer.trigger(
			`${currentUserId}_friends`,
			"new_friend",
			userToAdd
		),

		db
			.insert(friends)
			.values({ userId: currentUserId, friendIds: [idToAdd] })
			.onConflictDoUpdate({
				target: friends.userId,
				set: { friendIds: newFriendList },
				where: eq(friends.userId, currentUserId),
			}),

		db
			.insert(friends)
			.values({ userId: idToAdd, friendIds: [currentUserId] })
			.onConflictDoUpdate({
				target: friends.userId,
				set: { friendIds: newFriendList2 },
				where: eq(friends.userId, idToAdd),
			}),

		// Remove friend request from database
		db
			.delete(friendRequests)
			.where(
				and(
					eq(friendRequests.senderId, idToAdd),
					eq(friendRequests.receiverId, currentUserId)
				)
			),
	]);

	return { success: "Friend added" };
};
