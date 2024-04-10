"use client";

import { DEFAULT_LOGIN_REDIRECT } from "@/lib/utils";
import { LoginSchema } from "@/lib/validations/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import CardWrapper from "./CardWrapper";

const LoginForm = () => {
	const [error, setError] = useState<string | undefined>("");
	const [success, setSuccess] = useState<string | undefined>("");
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const searchParams = useSearchParams();
	const urlError =
		searchParams?.get("error") === "OAuthAccountNotLinked" ? "Email already in use with different provider!" : "";

	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
		setError("");
		setSuccess("");

		const validatedFields = LoginSchema.safeParse(values);

		if (!validatedFields.success) {
			return setError("Invalid fields");
		}

		const { email, password } = validatedFields.data;

		try {
			setIsLoading(true);

			const res = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});

			setIsLoading(false);

			if (!res?.error) {
				router.push(DEFAULT_LOGIN_REDIRECT);
			} else {
				setError("invalid email or password");
			}
		} catch (error) {
			setError("Something went wrong");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<CardWrapper
			headerLabel="Welcome back!"
			backButtonHref="/auth/register"
			backButtonLabel="Don't have an account?"
			showSocial
		>
			<Form {...form}>
				<form
					className="space-y-6"
					onSubmit={form.handleSubmit(onSubmit)}
				>
					<div className="space-y-4">
						<FormField
							control={form.control}
							name="email"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Email</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="your.email@example.com"
											type="email"
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="password"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Password</FormLabel>
									<FormControl>
										<Input
											{...field}
											placeholder="******"
											type="password"
											disabled={isLoading}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<FormError message={error || urlError} />
					<FormSuccess message={success} />
					<Button
						type="submit"
						className="w-full"
						disabled={isLoading}
					>
						Login
					</Button>
				</form>
			</Form>
		</CardWrapper>
	);
};

export default LoginForm;
