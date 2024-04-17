"use client";

import { leaveGroup } from "@/actions/leave-group";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { FC, useTransition } from "react";
import toast from "react-hot-toast";
import { Button } from "../ui/button";

interface LeaveGroupButtonProps {
	groupId: string;
}

const LeaveGroupButton: FC<LeaveGroupButtonProps> = ({ groupId }) => {
	const [isPending, startPending] = useTransition();
	const router = useRouter();

	const leave = () => {
		startPending(() => {
			leaveGroup(groupId).then((data) => {
				if (data.error) {
					return toast.error(data.error);
				}
				router.push("/dashboard");
			});
		});
	};

	return (
		<div className="group flex flex-col justify-center items-center gap-2">
			<Button
				variant={"outline"}
				onClick={leave}
				disabled={isPending}
			>
				<LogOut className="h-full aspect-square text-destructive-foreground" />
			</Button>
			<h1 className="bg-background absolute border text-foreground/90 rounded-lg p-2 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 duration-300 text-xs mt-20">
				Leave this group
			</h1>
		</div>
	);
};

export default LeaveGroupButton;
