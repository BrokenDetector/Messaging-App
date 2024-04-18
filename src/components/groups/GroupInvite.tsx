"use client";

import { inviteToGroup } from "@/actions/invite-to-group";
import { groupInviteSchema } from "@/lib/validations/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const GroupInvite = () => {
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isPending, startPending] = useTransition();

	const form = useForm<z.infer<typeof groupInviteSchema>>({
		resolver: zodResolver(groupInviteSchema),
		defaultValues: {
			email: "",
			groupName: "",
		},
	});

	const onSubmit = (values: z.infer<typeof groupInviteSchema>) => {
		setError("");
		setSuccess(false);

		startPending(() => {
			inviteToGroup(values).then((data) => {
				if (data.error) return setError(data.error);
				setSuccess(true);
			});
		});
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="flex flex-col gap-y-4 max-w-sm"
			>
				<div className="space-y-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-base">invite</FormLabel>
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

					<FormField
						control={form.control}
						name="groupName"
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-base">to</FormLabel>
								<FormControl>
									<Input
										{...field}
										placeholder="Group name"
										disabled={isPending}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormError message={error} />
				{success && <FormSuccess message="User invited" />}
				<Button
					disabled={isPending}
					type="submit"
				>
					Invite
				</Button>
			</form>
		</Form>
	);
};

export default GroupInvite;
