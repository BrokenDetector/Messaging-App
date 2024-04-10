"use client";

import { addFriend } from "@/actions/add-friend";
import { addFriendSchema } from "@/lib/validations/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FormError from "./FormError";
import FormSuccess from "./FormSuccess";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";

const AddFriend = () => {
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isPending, startPending] = useTransition();

	const form = useForm<z.infer<typeof addFriendSchema>>({
		resolver: zodResolver(addFriendSchema),
		defaultValues: {
			email: "",
		},
	});

	const onSubmit = (values: z.infer<typeof addFriendSchema>) => {
		setError("");
		setSuccess(false);

		startPending(() => {
			addFriend(values).then((data) => {
				if (data.error) {
					setError(data.error);
				} else {
					setSuccess(true);
				}
			});
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-y-4 max-w-sm"
			>
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Add friend by email</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="your.friend@example.com"
									type="email"
									disabled={isPending}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormError message={error} />
				{success && <FormSuccess message="Friend request sent" />}
				<Button
					disabled={isPending}
					type="submit"
				>
					Add
				</Button>
			</form>
		</Form>
	);
};

export default AddFriend;
