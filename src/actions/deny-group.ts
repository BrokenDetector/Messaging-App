"use server";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { groupInvites } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { and, eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import * as z from "zod";

export const denyGroupInvite = async (name: string) => {
	const validatedField = z.string().safeParse(name);

	if (!validatedField.success) {
		return { error: "Invalid field" };
	}
	const groupName = validatedField.data;

	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return { error: "Unauthorized" };
	}

	await db
		.delete(groupInvites)
		.where(and(eq(groupInvites.groupName, groupName), eq(groupInvites.receiverId, session.user.id)));

	await pusherServer.trigger(`${session.user.id}_groups`, "new_group", {});

	return { success: "success" };
};
