"use server";

import { getGroupByName, getUserByEmail, getUserGroupInvites, getUserGroups } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { groupInvites } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { groupInviteSchema } from "@/lib/validations/schemas";
import { getServerSession } from "next-auth";
import * as z from "zod";

export const inviteToGroup = async (values: z.infer<typeof groupInviteSchema>) => {
	const validatedField = groupInviteSchema.safeParse(values);

	if (!validatedField.success) {
		return { error: "Invalid field" };
	}

	const { email, groupName } = validatedField.data;

	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return { error: "Unauthorized" };
	}

	const userToInvite = await getUserByEmail(email);
	if (!userToInvite) {
		return { error: "This user does not exist" };
	}

	const group = await getGroupByName(groupName);
	if (!group) {
		return { error: "There is no group with this name" };
	}

	if (!group.members?.includes(session.user.id)) {
		return { error: "You are not a member of this group" };
	}

	const alreadyInvited = await getUserGroupInvites(userToInvite.id);
	if (alreadyInvited?.find((invite) => invite.receiverId === userToInvite.id)) {
		return { error: "User already invited" };
	}

	const alreadyMembers = await getUserGroups(userToInvite.id);
	if (alreadyMembers.includes(group)) {
		return { error: "User already a member" };
	}

	await db.insert(groupInvites).values({
		groupName,
		receiverId: userToInvite.id,
	});

	await pusherServer.trigger(`${userToInvite.id}_incoming_group_requests`, "incoming_group_requests", groupName);

	return { success: "Invite sent" };
};
