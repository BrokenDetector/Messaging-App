import { db } from "@/lib/db";
import { chats, friendRequests, friends, groupInvites, groups, users } from "@/lib/db/schema";
import { arrayContains, eq } from "drizzle-orm";

export const getUserByEmail = async (email: string) => {
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const getUserById = async (id: string) => {
	try {
		const user = await db.query.users.findFirst({
			where: eq(users.id, id),
		});
		return user;
	} catch (error) {
		console.log(error);
		return null;
	}
};

export const getUserFriends = async (id: string) => {
	try {
		const friendsIdList = await db.query.friends.findFirst({
			where: eq(friends.userId, id),
		});

		if (friendsIdList && friendsIdList.friendIds) {
			const friendsList = await Promise.all(
				friendsIdList.friendIds.map(async (friendId) => {
					const friend = await getUserById(friendId);
					return friend;
				})
			);

			return friendsList;
		} else {
			return [];
		}
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getUserFriendRequests = async (id: string) => {
	try {
		const friendRequestsList = await db.query.friendRequests.findMany({
			where: eq(friendRequests.receiverId, id),
		});
		return friendRequestsList;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getChatMessages = async (chatId: string) => {
	try {
		const chat = await db.query.chats.findFirst({
			where: eq(chats.id, chatId),
			with: {
				messages: {
					with: { sender: true },
					orderBy: (messages, { asc }) => [asc(messages.order)],
				},
			},
		});
		return chat?.messages;
	} catch {
		return [];
	}
};

export const getUserGroupInvites = async (id: string) => {
	try {
		const invites = await db.query.groupInvites.findMany({
			where: eq(groupInvites.receiverId, id),
		});
		return invites;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getUserGroups = async (id: string) => {
	try {
		const groupsList = await db.query.groups.findMany({
			where: arrayContains(groups.members, [id]),
		});
		return groupsList;
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const getGroupByName = async (name: string) => {
	try {
		const group = await db.query.groups.findFirst({
			where: eq(groups.groupName, name),
		});
		return group;
	} catch (error) {
		console.log(error);
		return null;
	}
};
