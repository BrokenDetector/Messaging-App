"use server";

import { getGroupByName, getUserById } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chats, messages } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { sendMessageSchema } from "@/lib/validations/schemas";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";

export const sendGlobalMessage = async (input: string, id: string, isgroup: boolean) => {
	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return { error: "Unauthorized" };
	}

	const validatedFields = sendMessageSchema.safeParse({
		text: input,
		chatId: id,
		isGroup: isgroup,
	});

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}

	const { text, chatId, isGroup } = validatedFields.data;

	if (isGroup && chatId !== "global") {
		// this message is group message
		const group = await getGroupByName(chatId);
		if (!group?.members?.includes(session.user.id)) {
			return { error: "You are not a member of this group" };
		}
	}

	// create chat if doesnt exist
	await db.insert(chats).values({ id: chatId }).onConflictDoNothing();

	const currentUser = await getUserById(session.user.id);
	const newMessage = await db.insert(messages).values({ chatId, text, senderId: session.user.id }).returning();

	// Update messages on client
	await pusherServer.trigger(`chat_${chatId}`, "incoming_message", { ...newMessage[0], sender: currentUser });

	revalidatePath("/dashboard/chat/global");

	return { success: "success" };
};
