import {
	DEFAULT_LOGIN_REDIRECT,
	apiAuthPrefix,
	authRoutes,
	publicRoutes,
} from "@/lib/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
	const pathname = req.nextUrl.pathname;
	const isLoggedIn = await getToken({ req });

	const isApiAuthRoute = pathname.startsWith(apiAuthPrefix);
	const isPublicRoute = publicRoutes.includes(pathname);
	const isAuthRoute = authRoutes.includes(pathname);

	if (isApiAuthRoute) {
		return NextResponse.next();
	}

	if (isAuthRoute) {
		if (isLoggedIn) {
			return NextResponse.redirect(
				new URL(DEFAULT_LOGIN_REDIRECT, req.url)
			);
		}
		return NextResponse.next();
	}

	if (!isLoggedIn && !isPublicRoute) {
		let callbackUrl = pathname;
		if (req.nextUrl.search) {
			callbackUrl += req.nextUrl.search;
		}

		const encodedCallbackUrl = encodeURIComponent(callbackUrl);

		return NextResponse.redirect(
			new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, req.url)
		);
	}

	if (pathname === "/") {
		return NextResponse.redirect(new URL("/dashboard", req.url));
	}
}

// Optionally, don't invoke Middleware on some paths
export const config = {
	matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
