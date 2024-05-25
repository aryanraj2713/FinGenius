import React from "react";
import { Input } from "@/components/ui/input";

function Page() {
	return (
		<div className=" flex flex-col w-full h-screen pt-20 ">
			<h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl text-center">
				Bank Statement Analyser
			</h1>
			<p className="leading-7 [&:not(:first-child)]:mt-6 text-center">
				Upload your bank statement to get a brief analysis.
			</p>
			<div className="flex items-center justify-center pt-20">
				<Input id="file" type="file" className="max-w-[20vw]" />
			</div>
            <div className="max-w-[80%] text-center self-center pt-32">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Tenetur eveniet voluptatibus necessitatibus, quod, neque veniam assumenda eligendi illo alias explicabo soluta enim suscipit eum aperiam harum cupiditate, mollitia atque quae.
            </div>
		</div>
	);
}

export default Page;
