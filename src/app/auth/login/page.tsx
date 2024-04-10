import LoginForm from "@/components/auth/LoginForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";

const LoginPage = () => {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<LoginForm />
		</Suspense>
	);
};

export default LoginPage;
