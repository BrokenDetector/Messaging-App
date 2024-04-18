import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { FC } from "react";

interface FormErrorProps {
	message?: string;
}

const FormError: FC<FormErrorProps> = ({ message }) => {
	if (!message) {
		return null;
	}
	return (
		<div className="bg-destructive p-3 rounded-md flex items-center gap-x-2 text-sm text-destructive-foreground">
			<ExclamationTriangleIcon className="size-4" />
			<p>{message}</p>
		</div>
	);
};

export default FormError;
