"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { FC, ReactNode } from "react";
import { Toaster } from "react-hot-toast";
import { SpeedInsights } from "@vercel/speed-insights/next"

interface ProvidersProps {
	children: ReactNode;
}

function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

const Providers: FC<ProvidersProps> = ({ children }) => {
	return (
		<>
			<Toaster
				position="top-center"
				reverseOrder={false}
			/>
			<SpeedInsights/>
			<ThemeProvider
				attribute="class"
				defaultTheme="system"
				enableSystem
				>
				{children}
			</ThemeProvider>
		</>
	);
};

export default Providers;
