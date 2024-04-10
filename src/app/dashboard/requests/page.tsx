import FriendRequests from "@/components/FriendRequests";
import { getUserFriendRequests } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
	const session = await getServerSession(authOptions);
	const friendsRequests = (await getUserFriendRequests(session?.user.id!)) as
		| incomingFriendRequest[]
		| [];

	return (
		<div className="flex flex-col pt-8">
			<h1 className="text-4xl font-bold pb-5">Friends requests</h1>
			<FriendRequests
				incomingFriendRequests={friendsRequests}
				sessionId={session?.user.id!}
			/>
		</div>
	);
};

export default page;
