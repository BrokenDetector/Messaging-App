"use client";

import { acceptFriend } from "@/actions/accept-friend";
import { denyFriend } from "@/actions/deny-friend";
import { pusherClient } from "@/lib/pusher";
import { Check, UserPlus, X } from "lucide-react";
import { nanoid } from "nanoid";
import { useRouter } from "next/navigation";
import { FC, useEffect, useState, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface FriendRequestsProps {
	incomingFriendRequests: incomingFriendRequest[];
	sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({ incomingFriendRequests, sessionId }) => {
	const [friendRequests, setFriendRequests] = useState<incomingFriendRequest[]>(incomingFriendRequests);
	const [isPending, startPending] = useTransition();
	const router = useRouter();

	useEffect(() => {
		pusherClient.subscribe(`${sessionId}_incoming_friend_requests`);

		const friendRequestHandler = ({ senderId, senderEmail }: incomingFriendRequest) => {
			setFriendRequests((prev) => [...prev, { senderId, senderEmail }]);
		};

		pusherClient.bind("incoming_friend_requests", friendRequestHandler);

		return () => {
			pusherClient.unsubscribe(`${sessionId}_incoming_friend_requests`);
			pusherClient.unbind("incoming_friend_requests", friendRequestHandler);
		};
	}, [sessionId]);

	const accept = (senderId: string) => {
		startPending(async () => {
			try {
				await acceptFriend(senderId);
				setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId));
				router.refresh();
			} catch (error) {
				toast.error("Something went wrong. Please try again");
			}
		});
	};

	const deny = (senderId: string) => {
		startPending(async () => {
			try {
				await denyFriend(senderId);
				setFriendRequests((prev) => prev.filter((request) => request.senderId !== senderId));

				router.refresh();
			} catch (error) {
				toast.error("Something went wrong. Please try again");
			}
		});
	};

	return (
		<>
			{friendRequests && friendRequests.length > 0 ? (
				<div className="flex flex-col">
					{friendRequests.map((request) => (
						<div
							className="flex gap-4 items-center w-fit p-4 rounded-lg"
							key={nanoid()}
						>
							<UserPlus />
							<h3 className="font-medium text-lg">{request.senderEmail}</h3>
							<Button
								disabled={isPending}
								onClick={() => accept(request.senderId)}
								className="size-8 grid place-items-center rounded-full transition hover:shadow-md bg-primary hover:bg-indigo-700"
							>
								<Check className="font-semibold size-5 text-background" />
							</Button>
							<Button
								disabled={isPending}
								onClick={() => deny(request.senderId)}
								className="size-8 grid place-items-center rounded-full transition hover:shadow-md bg-red-600 hover:bg-red-700"
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

export default FriendRequests;
