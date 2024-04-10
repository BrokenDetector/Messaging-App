"use server";

import { getUserByEmail } from "@/helpers/get-db";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { RegisterSchema } from "@/lib/validations/schemas";
import bcrypt from "bcryptjs";
import * as z from "zod";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
	const validatedFields = RegisterSchema.safeParse(values);

	if (!validatedFields.success) {
		return { error: "Invalid fields" };
	}

	const { email, password, name } = validatedFields.data;

	const hashedPassword = await bcrypt.hash(password, 10);

	const existingUser = await getUserByEmail(email);

	if (existingUser) {
		return { error: "Email already in use!" };
	}

	await db
		.insert(users)
		.values({ email, name, password: hashedPassword } as any);

	return { success: "User created" };
};
