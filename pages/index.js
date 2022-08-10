import { useState, useEffect } from "react";
import { FaTrashAlt } from "react-icons/fa";
import randomBytes from "randombytes";
import { useRouter } from "next/router";
import { supabase } from "../utils/supabaseClient";

import { Player } from "@lottiefiles/react-lottie-player";

//Notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
	const router = useRouter();
	const [loading, setLoading] = useState(false);
	const [pollList, setPollList] = useState([
		{ choice: "", count: 0 },
		{ choice: "", count: 0 },
	]);
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
			setPollList([...pollList, { choice: "", count: 0 }]);
		}
	};

	const createHandler = async () => {
		console.log(pollList);
		const count = 0;
		pollList.map((poll) => {
			if (poll.choice !== "") {
				count++;
			}
		});
		if (count >= 2) {
			//filter unique choices
			let uniqueObjArray = [
				...new Map(pollList.map((item) => [item["choice"], item])).values(),
			];
			//check if there are duplicate choices
			if (pollList.length !== uniqueObjArray.length) {
				toast.error("Duplicate choices are not allowed", { autoClose: 1500 });
				return;
			}
			//if no error, create poll
			toast("✔ Poll Successfully Created \n Redirecting...", {
				position: "top-right",
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});

			pollList.map(async (poll) => {
				console.log("pollList", poll);
				const { data, error } = await supabase
					.from("pool")
					.insert([{ url: hash, choices: [poll], choice_value: poll.choice }]);
				if (error) {
					console.log(error);
					throw new error();
				}
				if (data) {
					setLoading(true);
					
					setTimeout(() => {
						router.push(`/vote/${hash}`);
					}, 2000);
				}
			});
		} else {
			toast.error("Please add at least two choices", {autoClose: 1500});
		}
	};
	if (loading) {
		return (
			<div className="h-screen flex justify-center items-center">
				<ToastContainer />
				<Player
					autoplay
					loop
					src="https://assets9.lottiefiles.com/datafiles/QeC7XD39x4C1CIj/data.json"
					style={{ height: "400px", width: "400px" }}></Player>
			</div>
		);
	}
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
								name="choice"
								value={x.choice}
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
