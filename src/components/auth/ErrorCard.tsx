import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { FC } from "react";
import CardWrapper from "./CardWrapper";

interface ErrorCardProps {}

const ErrorCard: FC<ErrorCardProps> = ({}) => {
	return (
		<CardWrapper
			headerLabel="Oops! Something went wrong!"
			backButtonHref="/auth/login"
			backButtonLabel="Back to login"
		>
			<div className="flex justify-center w-full">
				<ExclamationTriangleIcon className="text-destructive" />
			</div>
		</CardWrapper>
	);
};

export default ErrorCard;
