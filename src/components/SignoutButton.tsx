"use client";

import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { ButtonHTMLAttributes, FC, useState } from "react";
import toast from "react-hot-toast";

interface SignOutButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {}

const SignOutButton: FC<SignOutButtonProps> = ({ ...props }) => {
	const [isSigningOut, setIsSigningOut] = useState(false);
	return (
		<Button
			{...props}
			variant={"ghost"}
			onClick={async () => {
				setIsSigningOut(true);
				try {
					await signOut();
				} catch (error) {
					toast.error("There was a problem signing out");
				} finally {
					setIsSigningOut(false);
				}
			}}
		>
			{isSigningOut ? <Loader2 className="animate-spin size-4" /> : <LogOut className="size-4" />}
		</Button>
	);
};

export default SignOutButton;
