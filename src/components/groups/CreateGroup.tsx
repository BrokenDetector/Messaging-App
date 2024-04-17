"use client";

import { createGroup } from "@/actions/create-group";
import { createGroupSchema } from "@/lib/validations/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import { Button } from "../ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";

const CreateGroup = () => {
	const [error, setError] = useState("");
	const [success, setSuccess] = useState(false);
	const [isPending, startPending] = useTransition();

	const form = useForm<z.infer<typeof createGroupSchema>>({
		resolver: zodResolver(createGroupSchema),
		defaultValues: {
			name: "",
		},
	});

	const onSubmit = (values: z.infer<typeof createGroupSchema>) => {
		setError("");
		setSuccess(false);

		startPending(() => {
			createGroup(values).then((data) => {
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
				<FormField
					control={form.control}
					name="name"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Choose name for your group</FormLabel>
							<FormControl>
								<Input
									{...field}
									placeholder="Group name..."
									disabled={isPending}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormError message={error} />
				{success && <FormSuccess message="Group was created" />}
				<Button
					disabled={isPending}
					type="submit"
				>
					Create
				</Button>
			</form>
		</Form>
	);
};

export default CreateGroup;
