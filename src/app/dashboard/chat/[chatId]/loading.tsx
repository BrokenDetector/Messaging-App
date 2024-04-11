import { FC } from "react";
import Skeleton from "react-loading-skeleton";

interface loadingProps {}

const loading: FC<loadingProps> = ({}) => {
	return (
		<div className="flex flex-col h-full items-center">
			<Skeleton
				className="mb-4"
				height={40}
				width={400}
				baseColor="#5e6669"
			/>

			<div className="flex-1 max-h-full overflow-y-scroll w-full">
				<div className="flex flex-col flex-auto h-full p-6">
					<div className="flex flex-col flex-auto flex-shrink-0 rounded-2xl h-full p-4">
						<div className="flex flex-col h-full overflow-x-auto mb-4">
							<div className="flex flex-col h-full">
								<div className="grid grid-cols-12 gap-y-2">
									<div className="col-start-6 col-end-13 p-3 rounded-lg">
										<div className="flex items-center justify-start flex-row-reverse">
											<div className="relative size-10">
												<Skeleton
													width={40}
													height={40}
													borderRadius={999}
													baseColor="#5e6669"
												/>
											</div>

											<div className="relative mr-3 text-sm text-accent-foreground py-2 px-4 border rounded-xl">
												<Skeleton
													className="ml-2"
													width={150}
													height={20}
													baseColor="#5e6669"
												/>
											</div>
										</div>
									</div>

									<div className="col-start-6 col-end-13 p-3 rounded-lg">
										<div className="flex items-center justify-start flex-row-reverse">
											<div className="relative size-10">
												<Skeleton
													width={40}
													height={40}
													borderRadius={999}
													baseColor="#5e6669"
												/>
											</div>

											<div className="relative mr-3 text-sm text-accent-foreground py-2 px-4 border rounded-xl">
												<Skeleton
													className="ml-2"
													width={150}
													height={20}
													baseColor="#5e6669"
												/>
											</div>
										</div>
									</div>

									<div className="col-start-1 col-end-8 p-3 rounded-lg">
										<div className="flex flex-row items-center">
											<div className="relative size-10">
												<Skeleton
													width={40}
													height={40}
													borderRadius={999}
													baseColor="#5e6669"
												/>
											</div>

											<div className="relative ml-3 text-sm py-2 px-4 border rounded-xl">
												<Skeleton
													className="ml-2"
													width={150}
													height={20}
													baseColor="#5e6669"
												/>
											</div>
										</div>
									</div>

									<div className="col-start-6 col-end-13 p-3 rounded-lg">
										<div className="flex items-center justify-start flex-row-reverse">
											<div className="relative size-10">
												<Skeleton
													width={40}
													height={40}
													borderRadius={999}
													baseColor="#5e6669"
												/>
											</div>

											<div className="relative mr-3 text-sm text-accent-foreground py-2 px-4 border rounded-xl">
												<Skeleton
													className="ml-2"
													width={150}
													height={20}
													baseColor="#5e6669"
												/>
											</div>
										</div>
									</div>

									<div className="col-start-1 col-end-8 p-3 rounded-lg">
										<div className="flex flex-row items-center">
											<div className="relative size-10">
												<Skeleton
													width={40}
													height={40}
													borderRadius={999}
													baseColor="#5e6669"
												/>
											</div>

											<div className="relative ml-3 text-sm py-2 px-4 border rounded-xl">
												<Skeleton
													className="ml-2"
													width={150}
													height={20}
													baseColor="#5e6669"
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default loading;
