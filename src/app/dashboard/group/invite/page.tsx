import GroupInvite from "@/components/groups/GroupInvite";

const page = () => {
	return (
		<div className="pt-8">
			<h1 className="text-4xl font-bold pb-5">Invite a user to join group</h1>
			<GroupInvite />
		</div>
	);
};

export default page;
