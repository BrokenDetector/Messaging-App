import GlobalChatInput from "@/components/chats/GlobalChatInput";
import GlobalMessages from "@/components/chats/GlobalMessages";
import { getChatMessages } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

interface ExtendedMessage extends Message {
	sender: User;
}

const page = async () => {
	const chatId = "global";

	const notReversedInitialMessages = await getChatMessages(chatId);
	const initialMessages = notReversedInitialMessages ? notReversedInitialMessages.reverse() : [];

	const session = await getServerSession(authOptions);
	const currenUser = session?.user;

	return (
		<div className="flex flex-col flex-1 justify-between h-full max-h-[calc(100dvh-6rem)]">
			<div className="flex sm:items-center justify-between py-3 border-b-2 border-border">
				<div className="flex items-center space-x-2">
					<div className="size-8 text-2xl">🌐</div>
					<div className="text-xl flex items-center leading-tight">
						<span className=" mr-2 font-semibold">Global chat</span>
					</div>
				</div>
			</div>

			<GlobalMessages
				chatId={chatId}
				initialMessages={initialMessages as ExtendedMessage[]}
				sessionId={currenUser?.id!}
				sessionImg={currenUser?.image!}
			/>

			<GlobalChatInput chatId={chatId} />
		</div>
	);
};

export default page;
