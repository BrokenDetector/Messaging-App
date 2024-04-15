"use client";

import { pusherClient } from "@/lib/pusher";
import { chatHrefConstructor } from "@/lib/utils";
import { nanoid } from "nanoid";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FC, useEffect, useState } from "react";
import toast from "react-hot-toast";
import UnseenChatToast from "../UnseenChatToas";

interface ChatsListProps {
	sessionId: string;
	friends: User[];
}

interface ExtendedMessage extends Message {
	senderImg: string;
	senderName: string;
}

const ChatsList: FC<ChatsListProps> = ({ sessionId, friends }) => {
	const router = useRouter();
	const pathname = usePathname();
	const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
	const [activeChats, setActiveChats] = useState(friends);

	useEffect(() => {
		pusherClient.subscribe(`${sessionId}_chats`);
		pusherClient.subscribe(`${sessionId}_friends`);

		const newFriendHandler = (newFriend: User) => {
			setActiveChats((prev) => [...prev, newFriend]);
		};

		const chatHandler = (message: ExtendedMessage) => {
			const shouldNotify = pathname !== `/dashboard/chat/${chatHrefConstructor(sessionId, message.senderId)}`;

			if (!shouldNotify) return;

			// should be notified
			toast.custom((t) => (
				<UnseenChatToast
					t={t}
					senderId={message.senderId}
					sessionId={sessionId}
					senderImg={message.senderImg}
					senderMessage={message.text}
					senderName={message.senderName}
				/>
			));

			setUnseenMessages((prev) => [...prev, message]);
		};

		pusherClient.bind("new_message", chatHandler);
		pusherClient.bind("new_friend", newFriendHandler);

		return () => {
			pusherClient.unsubscribe(`${sessionId}_chats`);
			pusherClient.unsubscribe(`${sessionId}_friends`);

			pusherClient.unbind("new_message", chatHandler);
			pusherClient.unbind("new_friend", newFriendHandler);
		};
	}, [pathname, sessionId, router]);

	useEffect(() => {
		if (pathname?.includes("chat")) {
			setUnseenMessages((prev) => {
				return prev.filter((message) => !pathname.includes(message.senderId));
			});
		}
	}, [pathname]);

	return (
		<ul
			role="list"
			className="space-y-1 overflow-y-auto -mx-2 max-h-[25rem]"
		>
			<li>
				<Link
					href="/dashboard/chat/global"
					className="hover:text-primary hover:bg-secondary text-base rounded-md font-semibold group flex items-center gap-x-3 p-2 leading-6"
				>
					<div className="size-8 text-2xl">🌐</div>
					<h1>Global chat</h1>
				</Link>
			</li>
			{activeChats.length > 0 ? (
				<>
					{activeChats.sort().map((friend) => {
						const unseenMessagesCount = unseenMessages.filter((unseenMessage) => {
							return unseenMessage.senderId === friend.id;
						}).length;

						return (
							<li key={nanoid()}>
								<a
									href={`/dashboard/chat/${chatHrefConstructor(sessionId, friend.id)}`}
									className="hover:text-primary hover:bg-secondary text-base rounded-md font-semibold group flex items-center gap-x-3 p-2 leading-6"
								>
									<div className="relative size-8">
										<Image
											fill
											className="rounded-full"
											alt={`${friend.name} profile image`}
											src={friend.image}
											sizes="32"
										/>
									</div>
									<h1>{friend.name}</h1>
									{unseenMessagesCount > 0 ? (
										<div className="bg-primary font-medium text-xs text-primary-foreground size-4 rounded-full flex justify-center items-center">
											{unseenMessagesCount}
										</div>
									) : null}
								</a>
							</li>
						);
					})}
				</>
			) : null}
		</ul>
	);
};

export default ChatsList;
