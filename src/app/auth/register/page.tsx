import RegisterForm from "@/components/auth/RegisterForm";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Suspense } from "react";

const RegisterPage = () => {
	return (
		<Suspense fallback={<LoadingSpinner />}>
			<RegisterForm />
		</Suspense>
	);
};

export default RegisterPage;
