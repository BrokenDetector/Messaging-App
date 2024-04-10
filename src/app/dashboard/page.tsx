import { getChatMessages, getUserFriends } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { chatHrefConstructor } from "@/lib/utils";
import { ChevronRight } from "lucide-react";
import { nanoid } from "nanoid";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";

const page = async () => {
	const session = await getServerSession(authOptions);
	const friends = await getUserFriends(session?.user.id!);
	const friendsWithLastMessage = await Promise.all(
		friends.map(async (friend) => {
			const lastMessage = (await getChatMessages(chatHrefConstructor(session?.user.id!, friend?.id!)))
				?.reverse()
				.findLast((message) => parseInt(message.timestamp!) > 0) as Message;

			return {
				...friend,
				lastMessage,
			};
		})
	);

	return (
		<div className="container py-12">
			<h1 className="text-5xl mb-8 font-bold">Recent chats</h1>
			{friendsWithLastMessage.length > 0 ? (
				friendsWithLastMessage.map((friend) => {
					if (!friend.lastMessage) return;

					return (
						<div
							key={nanoid()}
							className="relative bg-gray-50 border-border p-3 rounded-md"
						>
							<div className="absolute right-4 inset-y-4 flex items-center">
								<ChevronRight className="size-7 text-muted-foreground" />
							</div>

							<Link
								href={`/dashboard/chat/${friend.lastMessage.chatId}`}
								className="relative sm:flex"
							>
								<div className="mb-4 flex-shrink-0 sm:mb-0 sm:mr-4">
									<div className="relative size-10">
										<Image
											className="rounded-full"
											alt={`${friend.name} profile picture`}
											src={friend.image!}
											fill
											sizes="40"
										/>
									</div>
								</div>

								<div>
									<h4 className="text-lg font-semibold">{friend.name}</h4>
									<p className="mt-1 max-w-md">
										<span className="text-muted-foreground">
											{friend.lastMessage.senderId === session?.user.id ? "You: " : ""}
										</span>
										{friend.lastMessage.text}
									</p>
								</div>
							</Link>
						</div>
					);
				})
			) : (
				<p className="text-sm text-muted-foreground">Nothing to show here...</p>
			)}
		</div>
	);
};

export default page;
