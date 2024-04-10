"use client";

import { Dialog, Transition } from "@headlessui/react";
import { Menu, UserPlus, X } from "lucide-react";
import { Session } from "next-auth";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC, Fragment, useEffect, useState } from "react";
import ChatsList from "./ChatsList";
import FriendRequestSidebar from "./FriendRequestsSidebar";
import SignOutButton from "./SignoutButton";
import { Button, buttonVariants } from "./ui/button";

interface MobileSidebarLayoutProps {
	friends: User[];
	session: Session;
	unseenRequestCount: number;
}

const MobileSidebarLayout: FC<MobileSidebarLayoutProps> = ({ friends, session, unseenRequestCount }) => {
	const [open, setOpen] = useState<boolean>(false);

	const pathname = usePathname();

	useEffect(() => {
		setOpen(false);
	}, [pathname]);

	return (
		<div className="fixed bg-zinc-50 p-4 border-b top-0 py-2 inset-x-0">
			<div className="flex w-full justify-between items-center">
				<Link
					href={"/dashboard"}
					className={buttonVariants({ variant: "ghost" })}
				>
					<svg
						viewBox="0 0 2000 2000"
						className="h-6 w-auto text-primary"
					>
						<path
							fill="currentColor"
							d="m1976.678 964.142-1921.534-852.468c-14.802-6.571-32.107-3.37-43.577 8.046-11.477 11.413-14.763 28.703-8.28 43.532l365.839 836.751-365.839 836.749c-6.483 14.831-3.197 32.119 8.28 43.532 7.508 7.467 17.511 11.417 27.677 11.417 5.37 0 10.785-1.103 15.9-3.371l1921.533-852.466c14.18-6.292 23.322-20.349 23.322-35.861.001-15.514-9.141-29.571-23.321-35.861zm-1861.042-739.791 1664.615 738.489h-1341.737zm321.069 816.954h1334.219l-1655.287 734.35z"
						/>
					</svg>
				</Link>

				<Button
					onClick={() => setOpen(true)}
					className="gap-4"
				>
					Menu <Menu className="size-6" />
				</Button>
			</div>
			<Transition.Root
				show={open}
				as={Fragment}
			>
				<Dialog
					as="div"
					className="relative z-10"
					onClose={setOpen}
				>
					<div className="fixed inset-0" />

					<div className="fixed inset-0 overflow-hidden">
						<div className="absolute inset-0 overflow-hidden">
							<div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full pr-10">
								<Transition.Child
									as={Fragment}
									enter="transform transition ease-in-out duration-500 sm:duration-700"
									enterFrom="-translate-x-full"
									enterTo="translate-x-0"
									leave="transform transition ease-in-out duration-500 sm:duration-700"
									leaveFrom="translate-x-0"
									leaveTo="-translate-x-full"
								>
									<Dialog.Panel className="pointer-events-auto w-screen max-w-md">
										<div className="flex h-full flex-col overflow-hidden bg-background py-6 shadow-xl">
											<div className="px-4 sm:px-6">
												<div className="flex items-start justify-between">
													<Dialog.Title className="text-base font-semibold leading-6 text-foreground">
														Dashboard
													</Dialog.Title>
													<div className="ml-3 flex h-7 items-center">
														<button
															type="button"
															className="rounded-md bg-background text-muted-foreground hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
															onClick={() => setOpen(false)}
														>
															<span className="sr-only">Close panel</span>
															<X
																className="size-6"
																aria-hidden="true"
															/>
														</button>
													</div>
												</div>
											</div>

											<div className="relative mt-6 flex-1 px-4 sm:px-6">
												{/* Your content */}

												{friends.length > 0 ? (
													<div className="text-xs font-semibold leading-6 text-gray-400">
														Your chats
													</div>
												) : null}
												<nav className="flex flex-col">
													<ul
														role="list"
														className="flex flex-col gap-y-7"
													>
														<li>
															<ChatsList
																sessionId={session?.user.id!}
																friends={friends}
															/>
														</li>

														<li>
															<h1 className="text-muted-foreground text-sm font-semibold leading-6">
																Overview
															</h1>
															<ul
																role="list"
																className="-mx-2 mt-2 space-y-1"
															>
																<li>
																	<Link
																		href="/dashboard/add"
																		className="flex hover:bg-gray-50 hover:text-primary group gap-x-3 rounded-md p-2 text-sm font-semibold"
																	>
																		<span className="text-muted-foreground group-hover:border-primary group-hover:text-primary flex size-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-background">
																			<UserPlus className="size-4" />
																		</span>

																		<span className="truncate">Add friend</span>
																	</Link>
																</li>
																<li>
																	<FriendRequestSidebar
																		sessionId={session?.user.id!}
																		initialUnseenRequestCount={unseenRequestCount}
																	/>
																</li>
															</ul>
														</li>

														<li className="-mx-6 mt-auto flex items-center">
															<div className="flex flex-1 items-center gap-x-4 px-6 py-3 text-base font-semibold leading-6 text-foreground">
																<div className="relative size-10 bg-gray-50">
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
																	<h2 className="text-muted-foreground text-sm">
																		{session?.user.email}{" "}
																	</h2>
																</div>
															</div>
															<SignOutButton className="h-full aspect-square" />
														</li>
													</ul>
												</nav>
											</div>
										</div>
									</Dialog.Panel>
								</Transition.Child>
							</div>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
		</div>
	);
};

export default MobileSidebarLayout;
