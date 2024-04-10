import { Loader } from "lucide-react";

const LoadingSpinner = () => {
	return (
		<div className="flex justify-center items-center w-[400px] h-[500px] border bg-card rounded-xl shadow-md">
			<Loader
				size={40}
				className="size-10 animate-spin"
			/>
		</div>
	);
};

export default LoadingSpinner;
