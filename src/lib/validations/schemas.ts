import * as z from "zod";

export const LoginSchema = z.object({
	email: z.string().email({ message: "Email is required" }),
	password: z.string().min(1, { message: "Password is required" }),
});

export const RegisterSchema = z
	.object({
		email: z.string().email({ message: "Email is required" }),
		name: z.string().min(1, { message: "Name is required" }),
		password: z
			.string()
			.min(6, { message: "Minimum 6 characters required" }),
		confirmPassword: z.string().min(1, { message: "Password must match." }),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ["confirmPassword"],
	});

export const addFriendSchema = z.object({
	email: z.string().email(),
});

export const sendMessageSchema = z.object({
	text: z.string().min(1, { message: "Text is required" }),
	chatId: z.string().min(1, { message: "Chat Id is required" }),
});
