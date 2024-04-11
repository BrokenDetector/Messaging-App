import ChatInput from "@/components/ChatInput";
import Messages from "@/components/Messages";
import { getChatMessages, getUserById } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Image from "next/image";
import { notFound } from "next/navigation";
import { FC } from "react";

interface pageProps {
	params: { chatId: string };
}

const page: FC<pageProps> = async ({ params }) => {
	const { chatId } = params;

	const notReversedInitialMessages = (await getChatMessages(chatId)) as Message[];
	const initialMessages = notReversedInitialMessages ? notReversedInitialMessages.reverse() : [];

	const session = await getServerSession(authOptions);
	const currenUser = session?.user;

	const [userId1, userId2] = chatId.split("--");
	if (currenUser?.id !== userId1 && currenUser?.id !== userId2) notFound();

	const chatPartnerId = currenUser.id === userId1 ? userId2 : userId1;
	const chatPartner = (await getUserById(chatPartnerId)) as User;

	return (
		<div className="flex flex-col flex-1 justify-between h-full max-h-[calc(100dvh-6rem)]">
			<div className="flex sm:items-center justify-between py-3 border-b-2 border-border">
				<div className="flex items-center space-x-4">
					{chatPartner?.image && (
						<div className="relative size-8 sm:size-12">
							<Image
								fill
								src={chatPartner.image}
								alt={`${chatPartner.name} picture`}
								className="rounded-full"
								sizes="32"
							/>
						</div>
					)}
					<div className="flex flex-col leading-tight">
						<div className="text-xl flex items-center">
							<span className=" mr-2 font-semibold">{chatPartner?.name}</span>
						</div>

						<span className="text-sm text-muted-foreground">{chatPartner?.email}</span>
					</div>
				</div>
			</div>

			<Messages
				initialMessages={initialMessages}
				sessionId={currenUser.id}
				sessionImg={currenUser.image!}
				chatPartner={chatPartner}
				chatId={chatId}
			/>

			<ChatInput
				chatPartner={chatPartner!}
				chatId={chatId}
			/>
		</div>
	);
};

export default page;
