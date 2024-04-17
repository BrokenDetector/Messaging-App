"use server";

import { getGroupByName } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { groups } from "@/lib/db/schema";
import { pusherServer } from "@/lib/pusher";
import { createGroupSchema } from "@/lib/validations/schemas";
import { getServerSession } from "next-auth";
import * as z from "zod";

export const createGroup = async (values: z.infer<typeof createGroupSchema>) => {
	const validatedField = createGroupSchema.safeParse(values);

	if (!validatedField.success) {
		return { error: "Invalid field" };
	}

	const name = validatedField.data.name.replace(/ /g, "-");

	const session = await getServerSession(authOptions);

	if (!session?.user) {
		return { error: "Unauthorized" };
	}

	const alreadyExist = await getGroupByName(name);
	if (alreadyExist) {
		return { error: "Group with this name already exists" };
	}

	const newGroup = await db
		.insert(groups)
		.values({
			groupName: name,
			members: [session.user.id],
		})
		.returning();

	await pusherServer.trigger(`${session.user.id}_groups`, "new_group", newGroup[0]);

	return { success: "Group created" };
};
