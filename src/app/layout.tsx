import Providers from "@/components/Providers";
import type { Metadata } from "next";
import { Rubik } from "next/font/google";
import "./globals.css";

const rubik = Rubik({ subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Messaging App",
	description: "Simple chat application with authentication and realtime-feature built with Next.js 14",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={rubik.className}>
				<Providers>{children}</Providers>
			</body>
		</html>
	);
}
