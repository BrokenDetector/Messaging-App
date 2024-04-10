import Link from "next/link";

const notFound = () => {
	return (
		<main className="flex flex-col items-center mt-20 text-lg gap-2">
			<h1 className="text-4xl text-primary font-semibold">
				There was a problem.
			</h1>
			<p className="italic">The requested content has not been found.</p>
			<p>
				Go back to the{" "}
				<Link
					href="/dashboard"
					className="text-primary hover:underline"
				>
					Dashboard
				</Link>{" "}
				page
			</p>
		</main>
	);
};

export default notFound;
