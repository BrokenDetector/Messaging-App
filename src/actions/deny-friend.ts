"use server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { friendRequests } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import * as z from "zod";

export const denyFriend = async (senderId: string) => {
	const validatedField = z.string().safeParse(senderId);

	if (!validatedField.success) {
		return { error: "Invalid field" };
	}
	const idToDeny = validatedField.data;
	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return { error: "Unauthorized" };
	}

	await db
		.delete(friendRequests)
		.where(and(eq(friendRequests.senderId, idToDeny),eq(friendRequests.receiverId, session.user.id)));
	return { success: "success" };
};
