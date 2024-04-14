"use server";

import { getUserById } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { sendMessageSchema } from "@/lib/validations/schemas";
import { getServerSession } from "next-auth";

export const sendGlobalMessage = async (input: string, id: string) => {
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

	// create chat if doesnt exist
	await db.insert(chats).values({ id: chatId }).onConflictDoNothing();

	const currentUser = await getUserById(session.user.id);
	const newMessage = await db.insert(messages).values({ chatId, text, senderId: session.user.id }).returning();

	// Update messages on client
	await pusherServer.trigger(`chat_${chatId}`, "incoming_message", { ...newMessage[0], sender: currentUser });

	return { success: "success" };
};
