import { getUserByEmail, getUserById } from "@/helpers/get-db";
import { db } from "@/lib/db";
import { LoginSchema } from "@/lib/validations/schemas";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import type { Adapter } from "next-auth/adapters";
import Credentials from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";

function getGoogleCredentials() {
	const clientId = process.env.GOOGLE_CLIENT_ID;
	const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

	if (!clientId || clientId.length === 0) {
		throw new Error("Missing GOOGLE_CLIENT_ID");
	}

	if (!clientSecret || clientSecret.length === 0) {
		throw new Error("Missing GOOGLE_CLIENT_SECRET");
	}

	return { clientId, clientSecret };
}

function getGitHubCredentials() {
	const clientId = process.env.GITHUB_CLIENT_ID;
	const clientSecret = process.env.GITHUB_CLIENT_SECRET;

	if (!clientId || clientId.length === 0) {
		throw new Error("Missing GITHUB_CLIENT_ID");
	}

	if (!clientSecret || clientSecret.length === 0) {
		throw new Error("Missing GITHUB_CLIENT_SECRET");
	}

	return { clientId, clientSecret };
}

export const authOptions: NextAuthOptions = {
	adapter: DrizzleAdapter(db) as Adapter,
	session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/auth/login",
		error: "/auth/error",
	},
	secret: process.env.NEXTAUTH_SECRET,
	providers: [
		GoogleProvider({
			clientId: getGoogleCredentials().clientId,
			clientSecret: getGoogleCredentials().clientSecret,
		}),
		GitHubProvider({
			clientId: getGitHubCredentials().clientId,
			clientSecret: getGitHubCredentials().clientSecret,
		}),
		Credentials({
			name: "credentials",
			credentials: {
				email: { label: "Email", type: "email", placeholder: "email" },
				password: { label: "Password", type: "password" },
			},
			async authorize(credentials) {
				const validatedFields = LoginSchema.safeParse(credentials);
				if (validatedFields.success) {
					const { email, password } = validatedFields.data;

					const user = await getUserByEmail(email);
					if (!user || !user.password) return null;

					const passwordsMatch = await bcrypt.compare(
						password,
						user.password
					);
					if (passwordsMatch) return user;
				}
				return null;
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			const dbUser = await getUserById(token.id);

			if (!dbUser) {
				if (user) {
					token.id = user.id;
				}
				return token;
			}

			return {
				id: dbUser.id,
				name: dbUser.name,
				email: dbUser.email,
				picture: dbUser.image,
			};
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id;
				session.user.name = token.name;
				session.user.email = token.email;
				session.user.image = token.picture;
			}
			return session;
		},
	},
};
