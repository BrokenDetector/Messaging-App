"use server";

import {
	getUserByEmail,
	getUserFriendRequests,
	getUserFriends,
} from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { friendRequests } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { addFriendSchema } from "@/lib/validations/schemas";
import { getServerSession } from "next-auth";
import * as z from "zod";

export const addFriend = async (values: z.infer<typeof addFriendSchema>) => {
	const validatedField = addFriendSchema.safeParse(values);

	if (!validatedField.success) {
		return { error: "Invalid field" };
	}

	const { email } = validatedField.data;

	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return { error: "Unauthorized" };
	}

	const currentUserId = session.user.id;

	const userToAdd = await getUserByEmail(email);

	if (!userToAdd) {
		return { error: "User does not exist" };
	}

	if (email === session?.user.email) {
		return { error: "You cannot add yourself as a friend" };
	}

	// is already friends
	const friends = await getUserFriends(currentUserId);

	if (friends?.find((friend) => friend?.id === userToAdd.id)) {
		return { error: "Already in friends with this user" };
	}

	// is already have friend request
	const friendsRequests = await getUserFriendRequests(userToAdd.id);
	if (friendsRequests.find((request) => request.senderId === currentUserId)) {
		return { error: "Already have friend request to that user" };
	}

	await pusherServer.trigger(
		`${userToAdd.id}_incoming_friend_requests`,
		"incoming_friend_requests",
		{ senderId: currentUserId, senderEmail: session.user.email }
	);

	// Send request
	await db.insert(friendRequests).values({
		senderId: currentUserId,
		receiverId: userToAdd.id,
		senderEmail: session.user.email!,
	});

	return { success: "Request sent" };
};
