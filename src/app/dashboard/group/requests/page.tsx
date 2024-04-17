import GroupRequests from "@/components/groups/GroupsRequestsList";
import { getUserGroupInvites } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";

const page = async () => {
	const session = await getServerSession(authOptions);
	const groupInvites = (await getUserGroupInvites(session?.user.id!)) as incomingGroupRequest[];

	return (
		<div className="flex flex-col pt-8">
			<h1 className="text-4xl font-bold pb-5">Join group requests</h1>
			<GroupRequests
				incomingGroupRequests={groupInvites}
				sessionId={session?.user.id!}
			/>
		</div>
	);
};

export default page;
