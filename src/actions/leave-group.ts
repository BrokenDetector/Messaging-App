"use server";

import { getGroupByName, getUserGroups } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { chats, groups } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import * as z from "zod";

export const leaveGroup = async (data: string) => {
	const validatedField = z.string().safeParse(data);

	if (!validatedField.success) {
		return { error: "Invalid field" };
	}
	const groupName = validatedField.data;

	const session = await getServerSession(authOptions);
	if (!session?.user) {
		return { error: "Unauthorized" };
	}
	const currentUserId = session.user.id;

	const group = (await getGroupByName(groupName)) as Group;
	if (!group) {
		return { error: "There is no group with this name" };
	}

	const isMembers = await getUserGroups(currentUserId);
	if (!isMembers.find((g) => g.groupName === group.groupName)) {
		return { error: "You are not a member of this group" };
	}

	await db
		.update(groups)
		.set({ members: group.members.filter((memberId) => memberId !== currentUserId) })
		.where(eq(groups.groupName, groupName));

	await pusherServer.trigger(`${currentUserId}_groups`, "leave_group", group.groupName);

	if (group.members.length === 1) {
		await db.delete(groups).where(eq(groups.groupName, groupName));
		await db.delete(chats).where(eq(chats.id, groupName));
	}

	return { success: "success" };
};
