"use client";

import { sendMessage } from "@/actions/send-message";
import { FC, useRef, useState, useTransition } from "react";
import toast from "react-hot-toast";
import TextareaAutosize from "react-textarea-autosize";
import { Button } from "../ui/button";

interface ChatInputProps {
	chatPartner: User;
	chatId: string;
}

const ChatInput: FC<ChatInputProps> = ({ chatPartner, chatId }) => {
	const [input, setInput] = useState("");
	const [isPending, startPending] = useTransition();
	const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

	const submit = async () => {
		if (!input) return;

		startPending(async () => {
			try {
				await sendMessage(input, chatId);
			} catch (error) {
				toast.error("Something went wrong. Please try again");
			} finally {
				setInput("");
				textAreaRef.current?.focus();
			}
		});
	};

	return (
		<div className="border-t border-border px-4 pt-4 mb-2 sm:mb-0">
			<div className="relative flex-1 overflow-hidden rounded-lg shadow-sm ring-1 ring-muted focus-within:ring-2 focus-within:ring-primary bg-secondary">
				<TextareaAutosize
					ref={textAreaRef}
					onKeyDown={(e) => {
						if (e.key === "Enter" && !e.shiftKey) {
							e.preventDefault();
							submit();
						}
					}}
					rows={1}
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={`Message ${chatPartner.name}`}
					className="block w-full resize-none border-0 bg-transparent placeholder:text-muted-foreground focus:ring-0 sm:py-1.5 sm:text-sm sm:leading-6"
				/>

				<div
					onClick={() => textAreaRef.current?.focus()}
					className="py-2"
					aria-hidden="true"
				>
					<div className="h-9" />
				</div>

				<div className="absolute right-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
					<div>
						<Button
							onClick={submit}
							type="submit"
							disabled={isPending}
						>
							Send
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ChatInput;
