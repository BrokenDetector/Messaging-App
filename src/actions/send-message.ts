"use server";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { sendMessageSchema } from "@/lib/validations/schemas";
import { getServerSession } from "next-auth";

export const sendMessage = async (input: string, id: string) => {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return { error: "Unauthorized" };
	}

	const validatedFields = sendMessageSchema.safeParse({
		text: input,
		chatId: id,
	});

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}

	const { text, chatId } = validatedFields.data;
	const [userId1, userId2] = chatId.split("--");
	const friendId = session.user.id === userId1 ? userId2 : userId1;

	await db.insert(chats).values({ id: chatId }).onConflictDoNothing();
	const newMessage = await db
		.insert(messages)
		.values({ chatId, text, senderId: session.user.id })
		.returning();

	await Promise.all([
		// notify all connected chat room clients
		pusherServer.trigger(
			`chat_${chatId}`,
			"incoming_message",
			newMessage[0]
		),

		pusherServer.trigger(`${friendId}_chats`, "new_message", {
			...newMessage[0],
			senderImg: session.user.image,
			senderName: session.user.name,
		}),
	]);
	return { success: "success" };
};
