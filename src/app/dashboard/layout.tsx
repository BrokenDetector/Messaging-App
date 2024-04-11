import ChangeThemeButton from "@/components/ChangeThemeButton";
import ChatsList from "@/components/ChatsList";
import FriendRequestSidebar from "@/components/FriendRequestsSidebar";
import MobileSidebarLayout from "@/components/MobileSidebarLayout";
import SignOutButton from "@/components/SignoutButton";
import { getUserFriendRequests, getUserFriends } from "@/helpers/get-db";
import { authOptions } from "@/lib/auth";
import { UserPlus } from "lucide-react";
import { getServerSession } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { FC, ReactNode } from "react";

interface layoutProps {
	children: ReactNode;
}

const layout: FC<layoutProps> = async ({ children }) => {
	const session = await getServerSession(authOptions);
	const friends = (await getUserFriends(session?.user.id!)) as User[] | [];
	const initialUnseenRequestCount = await getUserFriendRequests(session?.user.id!);

	return (
		<div className="w-full h-screen flex">
			<div className="md:hidden">
				<MobileSidebarLayout
					friends={friends}
					session={session!}
					unseenRequestCount={initialUnseenRequestCount.length}
				/>
			</div>

			<div className="hidden md:flex size-full max-w-sm grow flex-col gap-y-5 overflow-y-auto border-r border-border bg-background px-6">
				<div className="flex justify-between items-center">
					<Link
						href={"/dashboard"}
						className="flex h-16 shrink-0 items-center"
					>
						<svg
							viewBox="0 0 2000 2000"
							className="h-8 w-auto text-primary"
						>
							<path
								fill="currentColor"
								d="m1976.678 964.142-1921.534-852.468c-14.802-6.571-32.107-3.37-43.577 8.046-11.477 11.413-14.763 28.703-8.28 43.532l365.839 836.751-365.839 836.749c-6.483 14.831-3.197 32.119 8.28 43.532 7.508 7.467 17.511 11.417 27.677 11.417 5.37 0 10.785-1.103 15.9-3.371l1921.533-852.466c14.18-6.292 23.322-20.349 23.322-35.861.001-15.514-9.141-29.571-23.321-35.861zm-1861.042-739.791 1664.615 738.489h-1341.737zm321.069 816.954h1334.219l-1655.287 734.35z"
							/>
						</svg>
					</Link>
					<ChangeThemeButton />
				</div>

				<nav className="flex flex-1 flex-col">
					<ul
						role="list"
						className="flex flex-col gap-y-7 flex-1"
					>
						<li>
							<div>
								{friends.length > 0 ? (
									<div className="text-xs font-semibold leading-6 text-gray-400">Your chats</div>
								) : null}

								<ul
									role="list"
									className="mx-2 mt-2 space-y-1"
								>
									<li>
										<ChatsList
											sessionId={session?.user.id!}
											friends={friends}
										/>
									</li>
								</ul>
							</div>
						</li>

						<li>
							<h1 className="text-muted-foreground text-sm font-semibold leading-6">Overview</h1>
							<ul
								role="list"
								className="-mx-2 mt-2 space-y-1"
							>
								<li>
									<Link
										href="/dashboard/add"
										className="flex hover:bg-secondary hover:text-primary group gap-3 rounded-md p-2 text-sm font-semibold"
									>
										<span className="text-muted-foreground group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-secondary	">
											<UserPlus className="size-4" />
										</span>

										<span className="truncate">Add friend</span>
									</Link>
								</li>
								<li>
									<FriendRequestSidebar
										sessionId={session?.user.id!}
										initialUnseenRequestCount={initialUnseenRequestCount.length}
									/>
								</li>
							</ul>
						</li>

						<li className="-mx-6 mt-auto flex items-center">
							<div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-base font-semibold leading-6 text-foreground">
								<div className="relative size-10 bg-transparent">
									<Image
										fill
										alt="Profile image"
										src={session?.user.image!}
										className="rounded-full"
										sizes="40"
									/>
								</div>
								<div className="flex flex-col">
									<h1>{session?.user.name}</h1>
									<h2 className="text-muted-foreground text-sm">{session?.user.email} </h2>
								</div>
							</div>
							<SignOutButton className="h-full aspect-square" />
						</li>
					</ul>
				</nav>
			</div>
			<aside className="max-h-screen container py-16 md:py-14 w-full">{children}</aside>
		</div>
	);
};

export default layout;
