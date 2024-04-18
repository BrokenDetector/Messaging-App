"use client";

import { pusherClient } from "@/lib/pusher";
import { User } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface FriendRequestSidebarProps {
	sessionId: string;
	initialUnseenRequestCount: number;
}

const FriendRequestSidebar: FC<FriendRequestSidebarProps> = ({ sessionId, initialUnseenRequestCount }) => {
	const [unseenRequestCount, setUnseenRequestCount] = useState(initialUnseenRequestCount);

	useEffect(() => {
		pusherClient.subscribe(`${sessionId}_incoming_friend_requests`);
		pusherClient.subscribe(`${sessionId}_friends`);

		const friendRequestHandler = () => {
			setUnseenRequestCount((prev) => prev + 1);
		};

		const addedFriendHandler = () => {
			setUnseenRequestCount((prev) => prev - 1);
		};

		pusherClient.bind("incoming_friend_requests", friendRequestHandler);
		pusherClient.bind("new_friend", addedFriendHandler);

		return () => {
			pusherClient.unsubscribe(`${sessionId}_incoming_friend_requests`);
			pusherClient.unsubscribe(`${sessionId}_friends`);

			pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
			pusherClient.unbind("new_friend", addedFriendHandler);
		};
	}, [sessionId]);

	return (
		<Link
			href="/dashboard/friend/requests"
			className="flex hover:bg-secondary hover:text-primary group gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
		>
			<div className="text-muted-foreground border group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium bg-secondary">
				<User className="size-4" />
			</div>
			<p className="truncate">Friends requests</p>

			{unseenRequestCount > 0 ? (
				<div className="flex rounded-full items-center bg-primary justify-center size-5 text-xs text-primary-foreground">
					{unseenRequestCount}
				</div>
			) : null}
		</Link>
	);
};

export default FriendRequestSidebar;
