"use client";

import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface MessagesProps {
	initialMessages: Message[];
	sessionId: string;
	sessionImg: string;
	chatPartner: User;
	chatId: string;
}

const Messages: FC<MessagesProps> = ({ initialMessages, sessionId, sessionImg, chatPartner, chatId }) => {
	const [messages, setMessages] = useState<Message[]>(initialMessages);

	useEffect(() => {
		pusherClient.subscribe(`chat_${chatId}`);

		const messageHandler = (message: Message) => {
			setMessages((prev) => [message, ...prev]);
		};

		pusherClient.bind("incoming_message", messageHandler);

		return () => {
			pusherClient.unsubscribe(`chat_${chatId}`);

			pusherClient.unbind("incoming_message", messageHandler);
		};
	}, [chatId]);

	return (
		<div className="flex flex-1 h-full flex-col-reverse gap-3 p-3 overflow-y-auto">
			{messages.map((message, index) => {
				const isCurrentUser = message.senderId === sessionId;
				const hasNextMessageFromSameUser = messages[index - 1]?.senderId === messages[index].senderId;
				const shouldntRenderName = messages[index + 1]?.senderId === messages[index].senderId; // if messages from this user more that one, render name only on first message

				return (
					<div
						key={nanoid()}
						className={cn("flex items-end", {
							"justify-end": isCurrentUser,
							"mb-2.5": !hasNextMessageFromSameUser,
						})}
					>
						<div
							className={cn("flex flex-col text-base max-w-sm mx-2", {
								"order-1 items-end": isCurrentUser,
								"order-2 items-start": !isCurrentUser,
							})}
						>
							<span
								className={cn("px-3 py-2 rounded-lg flex flex-col", {
									"bg-primary text-primary-foreground": isCurrentUser,
									"bg-muted": !isCurrentUser,
									"rounded-br-none": !hasNextMessageFromSameUser && isCurrentUser,
									"rounded-bl-none": !hasNextMessageFromSameUser && !isCurrentUser,
								})}
							>
								<p
									className={cn("font-semibold", {
										hidden: shouldntRenderName || isCurrentUser,
									})}
								>
									{chatPartner.name}
								</p>
								<span className="inline-block ml-2">
									{message.text}
									<span className="ml-3  text-xs text-muted-foreground">
										{format(message.timestamp!, "HH:mm")}
									</span>
								</span>
							</span>
						</div>

						<div
							className={cn("relative size-7", {
								"order-2": isCurrentUser,
								"order-1": !isCurrentUser,
								invisible: hasNextMessageFromSameUser,
							})}
						>
							<Image
								fill
								className="rounded-full"
								alt="Profile picture"
								src={isCurrentUser ? sessionImg : chatPartner.image}
								sizes="28"
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default Messages;
