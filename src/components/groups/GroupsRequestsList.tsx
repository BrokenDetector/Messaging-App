"use client";

import { acceptGroupInvite } from "@/actions/accept-group";
import { denyGroupInvite } from "@/actions/deny-group";
import { pusherClient } from "@/lib/pusher";
import { Check, UserPlus, X } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

interface GroupRequestsProps {
	incomingGroupRequests: incomingGroupRequest[];
	sessionId: string;
}

const GroupRequests: FC<GroupRequestsProps> = ({ incomingGroupRequests, sessionId }) => {
	const [groupRequests, setGroupRequests] = useState<incomingGroupRequest[]>(incomingGroupRequests);
	const [isPending, startPending] = useTransition();
	const router = useRouter();

	useEffect(() => {
		pusherClient.subscribe(`${sessionId}_incoming_group_requests`);

		const groupRequestHandler = (groupName: string) => {
			setGroupRequests((prev) => [...prev, { groupName }]);
		};

		pusherClient.bind("incoming_group_requests", groupRequestHandler);

		return () => {
			pusherClient.unsubscribe(`${sessionId}_incoming_group_requests`);
			pusherClient.unbind("incoming_group_requests", groupRequestHandler);
		};
	}, [sessionId]);

	const accept = (groupName: string) => {
		startPending(async () => {
			try {
				acceptGroupInvite(groupName);
				setGroupRequests((prev) => prev.filter((request) => request.groupName !== groupName));
				router.refresh();
			} catch (error) {
				toast.error("Something went wrong. Please try again");
			}
		});
	};

	const deny = (groupName: string) => {
		startPending(async () => {
			try {
				denyGroupInvite(groupName);
				setGroupRequests((prev) => prev.filter((request) => request.groupName !== groupName));
				router.refresh();
			} catch (error) {
				toast.error("Something went wrong. Please try again");
			}
		});
	};

	return (
		<>
			{groupRequests && groupRequests.length > 0 ? (
				<div className="flex flex-col">
					{groupRequests.map((request) => (
						<div
							className="flex gap-4 items-center w-fit p-4 rounded-lg"
							key={nanoid()}
						>
							<UserPlus />
							<h3 className="font-medium text-lg">{request.groupName}</h3>
							<Button
								disabled={isPending}
								onClick={() => accept(request.groupName)}
								className="size-8 grid place-items-center rounded-full transition hover:shadow-md bg-primary hover:bg-indigo-700"
							>
								<Check className="font-semibold size-5 text-background" />
							</Button>
							<Button
								disabled={isPending}
								onClick={() => deny(request.groupName)}
								className="size-8 grid place-items-center rounded-full transition hover:shadow-md bg-destructive hover:bg-red-700"
							>
								<X className="font-semibold size-5 text-background" />
							</Button>
						</div>
					))}
				</div>
			) : (
				<p className="text-sm text-muted-foreground">Nothing to show here...</p>
			)}
		</>
	);
};

export default GroupRequests;
