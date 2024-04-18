"use server";

import { getGroupByName, getUserGroupInvites, getUserGroups } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { groupInvites, groups } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { eq } from "drizzle-orm";
import { getServerSession } from "next-auth";
import * as z from "zod";

export const acceptGroupInvite = async (data: string) => {
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

	const invite = await getUserGroupInvites(currentUserId);
	const alreadyInvited = invite.find((invite) => invite.receiverId === currentUserId);
	if (!alreadyInvited) {
		return { error: "User not invited" };
	}

	const alreadyMembers = await getUserGroups(currentUserId);
	if (alreadyMembers.includes(group)) {
		return { error: "User already a member of this group" };
	}

	await db
		.update(groups)
		.set({ members: [...group.members, currentUserId] })
		.where(eq(groups.groupName, groupName));

	await db.delete(groupInvites).where(eq(groupInvites.id, alreadyInvited.id));

	await pusherServer.trigger(`${currentUserId}_groups`, "new_group", group);

	return { success: "Invite accepted" };
};
