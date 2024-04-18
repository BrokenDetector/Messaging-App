"use client";

import { pusherClient } from "@/lib/pusher";
import { User } from "lucide-react";
import Link from "next/link";
import { FC, useEffect, useState } from "react";

interface GroupInvitesSidebarProps {
	sessionId: string;
	initialUnseenInvitesCount: number;
}

const GroupInvitesSidebar: FC<GroupInvitesSidebarProps> = ({ sessionId, initialUnseenInvitesCount }) => {
	const [unseenInvitesCount, setUnseenInviteCount] = useState(initialUnseenInvitesCount);

	useEffect(() => {
		pusherClient.subscribe(`${sessionId}_incoming_group_requests`);
		pusherClient.subscribe(`${sessionId}_groups`);

		const groupInvitesHandler = () => {
			setUnseenInviteCount((prev) => prev + 1);
		};

		const joinGroupHandler = () => {
			setUnseenInviteCount((prev) => prev - 1);
		};

		pusherClient.bind("incoming_group_requests", groupInvitesHandler);
		pusherClient.bind("new_group", joinGroupHandler);

		return () => {
			pusherClient.unsubscribe(`${sessionId}_incoming_group_requests`);
			pusherClient.unsubscribe(`${sessionId}_groups`);

			pusherClient.unbind("incoming_group_requests", groupInvitesHandler);
			pusherClient.unbind("new_group", joinGroupHandler);
		};
	}, [sessionId]);

	return (
		<Link
			href="/dashboard/group/requests"
			className="flex hover:bg-secondary hover:text-primary group gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
		>
			<div className="text-muted-foreground border group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg text-[0.625rem] font-medium bg-secondary">
				<User className="size-4" />
			</div>

			<p className="truncate">Group invites</p>

			{unseenInvitesCount > 0 ? (
				<div className="flex rounded-full items-center bg-primary justify-center size-5 text-xs text-primary-foreground">
					{unseenInvitesCount}
				</div>
			) : null}
		</Link>
	);
};

export default GroupInvitesSidebar;
