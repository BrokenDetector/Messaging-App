"use client";

import { pusherClient } from "@/lib/pusher";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { nanoid } from "nanoid";
import Image from "next/image";
import { FC, useEffect, useState } from "react";

interface ExtendedMessage extends Message {
	sender: User;
}

interface GlobalMessagesProps {
	initialMessages: ExtendedMessage[];
	sessionId: string;
	sessionImg: string;
	chatId: string;
}

const GlobalMessages: FC<GlobalMessagesProps> = ({ initialMessages, sessionId, sessionImg, chatId }) => {
	const [messages, setMessages] = useState<ExtendedMessage[]>(initialMessages);

	useEffect(() => {
		pusherClient.subscribe(`chat_${chatId}`);

		const messageHandler = (message: ExtendedMessage) => {
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
				const prevMessageTimestamp = messages[index + 1]
					? format(messages[index + 1]?.timestamp!, "dd MMM yyyy")
					: 0;

				return (
					<div key={nanoid()}>
						{format(message.timestamp!, "dd MMM yyyy") !== prevMessageTimestamp && (
							<span className="flex justify-center items-center text-muted-foreground rounded-full text-sm p-2">
								{format(message.timestamp!, "dd MMM yyyy")}
							</span>
						)}
						<div
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
									{message.senderId !== sessionId && (
										<p
											className={cn("font-semibold", {
												hidden: shouldntRenderName || isCurrentUser,
											})}
										>
											{message.sender.name}
										</p>
									)}
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
									src={isCurrentUser ? sessionImg : message.sender.image}
									sizes="28"
								/>
							</div>
						</div>
					</div>
				);
			})}
		</div>
	);
};

export default GlobalMessages;
