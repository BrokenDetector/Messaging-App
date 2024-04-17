import type { AdapterAccount } from "@auth/core/adapters";
import { relations } from "drizzle-orm";
import { integer, pgTable, primaryKey, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("user", {
	id: uuid("id").primaryKey().defaultRandom(),
	name: text("name"),
	password: text("password"),
	email: text("email").unique(),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image").notNull().default("https://i.imgur.com/KbLYs2i.png"),
});

export const accounts = pgTable(
	"account",
	{
		userId: uuid("userId")
			.notNull()
			.references(() => users.id, { onDelete: "cascade" }),
		type: text("type").$type<AdapterAccount["type"]>().notNull(),
		provider: text("provider").notNull(),
		providerAccountId: text("providerAccountId").notNull(),
		refresh_token: text("refresh_token"),
		access_token: text("access_token"),
		expires_at: integer("expires_at"),
		token_type: text("token_type"),
		scope: text("scope"),
		id_token: text("id_token"),
		session_state: text("session_state"),
	},
	(account) => ({
		compoundKey: primaryKey({
			columns: [account.provider, account.providerAccountId],
		}),
	})
);

export const friendRequests = pgTable("friendRequest", {
	id: uuid("id").primaryKey().defaultRandom(),
	senderId: uuid("senderId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	senderEmail: text("senderEmail")
		.notNull()
		.references(() => users.email),
	receiverId: uuid("receiverId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

export const friends = pgTable("friends", {
	id: uuid("id").primaryKey().defaultRandom(),
	userId: uuid("userId")
		.notNull()
		.unique()
		.references(() => users.id, { onDelete: "cascade" }),
	friendIds: uuid("friendIds")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" })
		.array(),
});

export const chats = pgTable("chat", {
	id: text("id").primaryKey(),
});

export const messages = pgTable("message", {
	id: uuid("id").primaryKey().defaultRandom(),
	chatId: text("chatId")
		.notNull()
		.references(() => chats.id, { onDelete: "cascade" }),
	senderId: uuid("senderId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	text: text("text").notNull(),
	timestamp: timestamp("timestamp", { mode: "string" }).defaultNow(),
});

export const groups = pgTable("groups", {
	groupName: text("groupName").unique().primaryKey(),
	members: uuid("members")
		.notNull()
		.references(() => users.id)
		.array()
		.default("{}" as unknown as []),
});

export const groupInvites = pgTable("groupInvites", {
	id: uuid("id").defaultRandom().primaryKey(),
	groupName: text("groupName").references(() => groups.groupName, { onDelete: "cascade" }),
	receiverId: uuid("receiverId")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
});

// RELATIONS

export const chatsRelations = relations(chats, ({ many }) => ({
	messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
	chat: one(chats, {
		fields: [messages.chatId],
		references: [chats.id],
	}),
	sender: one(users, {
		fields: [messages.senderId],
		references: [users.id],
	}),
}));

export const usersRelations = relations(users, ({ many }) => ({
	messages: many(messages),
}));
