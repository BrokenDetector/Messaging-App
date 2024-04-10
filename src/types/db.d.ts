interface incomingFriendRequest {
	id?: string;
	senderId: string;
	senderEmail: string;
	receiverId?: string;
}

interface User {
	name: string | null;
	id: string;
	image: string;
	password: string | null;
	email: string | null;
	emailVerified: Date | null;
}

interface Message {
	id: string;
	senderId: string;
	receiverId: string;
	chatId: string;
	text: string;
	timestamp: string | null;
}

interface Chat {
	id: string;
	messages: Message[];
}
