import ErrorCard from "@/components/auth/ErrorCard";
import { FC } from "react";

interface AuthErrorPageProps {}

const AuthErrorPage: FC<AuthErrorPageProps> = ({}) => {
	return <ErrorCard />;
};

export default AuthErrorPage;
