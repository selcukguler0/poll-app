import { useState, useRef } from "react";
import { FaTrashAlt } from "react-icons/fa";
import randomBytes from "randombytes";
import { useRouter } from "next/router";

export default function Home() {
	const router = useRouter();
	const [pollList, setPollList] = useState([{ vote: "" }, { vote: "" }]);
	const hash = randomBytes(16).toString("hex");

	const handleChoiceChange = (e, index) => {
		const { name, value } = e.target;
		const list = [...pollList];
		list[index][name] = value;
		setPollList(list);
	};

	const handleChoiceRemove = (index) => {
		const list = [...pollList];
		list.splice(index, 1);
		setPollList(list);
	};

	const handleChoiceAdd = () => {
		if (pollList.length < 5) {
			setPollList([...pollList, { vote: "" }]);
		}
	};

	const createHandler = () => {
		const count = 0;
		pollList.map((poll) => {
			if (poll.vote !== "") {
				count++;
			}
		});
		if (count >= 2) {
			router.push(`/vote/${hash}`);
		}else{
			alert("Please add at least two choices");
		}
	};

	return (
		<div className="flex justify-center flex-col">
			{/* title */}
			<div className="text-center mt-[100px]">
				<h1 className="text-white font-bold text-6xl">Create Poll</h1>
			</div>

			{/* form */}
			<div
				id="poll-elements"
				className="flex flex-col gap-y-5 items-center justify-center w-96 m-auto mt-10">
				<div>
					<button
						className="shadow appearance-none rounded py-2 px-3
					bg-blue-400 text-white mr-5"
						onClick={handleChoiceAdd}>
						+
					</button>
					<button
						onClick={createHandler}
						className="shadow appearance-none rounded py-2 px-3
					bg-blue-400 text-white">
						Create
					</button>
				</div>
				<div>
					{pollList.map((x, i) => (
						<div key={i} className="flex items-center flex-row gap-3 mt-3">
							<input
								name="vote"
								value={x.vote}
								onChange={(e) => handleChoiceChange(e, i)}
								placeholder="Choice"
							/>
							{pollList.length !== 2 ? (
								<button onClick={() => handleChoiceRemove(i)}>
									<FaTrashAlt className="text-red-500" />
								</button>
							) : (
								<div className="block w-4"></div>
							)}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
