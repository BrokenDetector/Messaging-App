import { db } from "@/lib/db";
import { chats, friendRequests, friends, users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
		if (chatId === "global") {
			const chat = await db.query.chats.findFirst({
				where: eq(chats.id, chatId),
				with: { messages: { with: { sender: true } } },
			});
			return chat?.messages;
		} else {
			const chat = await db.query.chats.findFirst({
				where: eq(chats.id, chatId),
				with: { messages: true },
			});
			return chat?.messages;
		}
	} catch {
		return [];
	}
};
