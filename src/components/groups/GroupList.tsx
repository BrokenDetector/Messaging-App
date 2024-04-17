"use client";

import { pusherClient } from "@/lib/pusher";
import { nanoid } from "nanoid";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { setgid } from "process";
import { FC, useEffect, useState } from "react";

interface GroupListProps {
	sessionId: string;
	groups: Group[];
}

interface ExtendedMessage extends Message {
	sender: User;
}

const GroupList: FC<GroupListProps> = ({ sessionId, groups }) => {
	const router = useRouter();
	const pathname = usePathname();
	const [unseenMessages, setUnseenMessages] = useState<ExtendedMessage[]>([]);
	const [groupChat, setGroupChat] = useState(groups);

	useEffect(() => {
		pusherClient.subscribe(`${sessionId}_groups`);

		const newGroupHandler = (newGroup: Group) => {
			setGroupChat((prev) => [...prev, newGroup]);
		};

		const leaveGroupHandler=(groupName:string)=>{
			setGroupChat((prev)=>prev.filter((group)=> group.groupName!==groupName))
		}

		pusherClient.bind("new_group", newGroupHandler);
		pusherClient.bind('leave_group',leaveGroupHandler)

		return () => {
			pusherClient.unsubscribe(`${sessionId}_groups`);
			pusherClient.unbind("new_group", newGroupHandler);
			pusherClient.unbind('leave_group',leaveGroupHandler)
		};
	}, [pathname, sessionId, router]);

	useEffect(() => {
		if (pathname?.includes("chat/group")) {
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
			{groupChat.length > 0 ? (
				<>
					<h1 className="text-xs font-semibold leading-6 text-muted-foreground">Your groups</h1>
					{groupChat.sort().map((group) => {
						const unseenMessagesCount = unseenMessages.filter((unseenMessage) => {
							return unseenMessage.chatId === group.groupName;
						}).length;

						return (
							<li key={nanoid()}>
								<Link
									href={`/dashboard/chat/group/${group.groupName}`}
									className="hover:text-primary hover:bg-secondary text-base rounded-md font-semibold group flex items-center gap-x-3 p-2 leading-6"
								>
									<h1>{group.groupName}</h1>
									{unseenMessagesCount > 0 ? (
										<div className="bg-primary font-medium text-xs text-primary-foreground size-4 rounded-full flex justify-center items-center">
											{unseenMessagesCount}
										</div>
									) : null}
								</Link>
							</li>
						);
					})}
				</>
			) : null}
		</ul>
	);
};

export default GroupList;
