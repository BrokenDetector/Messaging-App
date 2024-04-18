import GlobalChatInput from "@/components/chats/GlobalChatInput";
import GlobalMessages from "@/components/chats/GlobalMessages";
import LeaveGroupButton from "@/components/groups/LeaveGroupButton";
import { getChatMessages, getGroupByName } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";

interface ExtendedMessage extends Message {
	sender: User;
}

interface pageProps {
	params: { groupId: string };
}

const page: FC<pageProps> = async ({ params }) => {
	const { groupId } = params;

	const group = await getGroupByName(groupId);
	if (!group) return notFound();

	const notReversedInitialMessages = await getChatMessages(groupId);
	const initialMessages = notReversedInitialMessages ? notReversedInitialMessages.reverse() : [];

	const session = await getServerSession(authOptions);
	const currenUser = session?.user;
	if (!group.members?.includes(currenUser?.id!)) return notFound();

	return (
		<div className="flex-1 justify-between flex flex-col h-full max-h-[calc(100vh-6rem)]">
			<div className="flex sm:items-center justify-between py-3 border-b-2 border-border">
				<div className="relative flex items-center space-x-4">
					<div className="text-xl flex flex-col items-start leading-tight">
						<span className="mr-3 font-semibold">Welcome to {groupId} group</span>

						<span className="text-sm text-muted-foreground">{group.members?.length} members</span>
					</div>
				</div>
				<LeaveGroupButton groupId={groupId} />
			</div>

			<GlobalMessages
				initialMessages={initialMessages as ExtendedMessage[]}
				sessionId={currenUser?.id!}
				sessionImg={currenUser?.image!}
				chatId={groupId}
			/>

			<GlobalChatInput
				chatId={groupId}
				isGroup
			/>
		</div>
	);
};

export default page;
