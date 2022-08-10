import { supabase } from "../../utils/supabaseClient";
import { useRef, useState } from "react";
import { useRouter } from "next/router";
import LoadingLottie from "../../public/loading.json";
import { Player } from "@lottiefiles/react-lottie-player";

//Notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Votes({ results, hash }) {
	const router = useRouter();
	const choiceRef = useRef(null);
	const [loading, setLoading] = useState(false);

	const handleChoice = async (e) => {
		setLoading(true);
		const { value } = e.target;
		
		//select current count
		const { data: sdata, error: serror } = await supabase
			.from("pool")
			.select("choices")
			.match({ url: hash })
			.match({ choice_value: value });
		if (serror) {
			console.log(serror);
			return;
		}
		//current count
		console.log("sdata", sdata);
		console.log("Current Count", sdata[0]["choices"][0].count);
		var count = sdata[0]["choices"][0].count;
		count+=1;
		console.log("New Count", count);

		//update count
		const { data, error } = await supabase
			.from("pool")
			.update({ choices: [{ choice: value, count: count }] })
			.match({ url: hash })
			.match({ choice_value: value });

		if (error) {
			console.log(error);
			return;
		}
		if (data) {
			toast("✔ Successfully Voted, Redirecting to Results...");
			setTimeout(() => {
				router.push(`/result/${hash}`);
			},1500);
		}
	};

	if (!results || results.length === 0) {
		console.log("no data");
		return <div>Loading...</div>;
	}
	if (loading) {
		return (
			<div className="h-screen flex justify-center items-center">
				<ToastContainer />
				<Player
					autoplay
					loop
					src={LoadingLottie}
					style={{ height: "400px", width: "400px" }}></Player>
			</div>
		);
	}
	return (
		<div className="h-screen flex justify-center items-center gap-y-3 flex-col w-96 m-auto">
			{results.map((choice, i) => {
				return (
					<input
						key={i}
						ref={choiceRef}
						id={i + 1}
						type="button"
						onClick={handleChoice}
						className="choiceButton vote-button"
						value={choice.choices[0].choice}
					/>
				);
			})}
		</div>
	);
}

export async function getServerSideProps(context) {
	const { hash } = context.query;
	const { data, error } = await supabase
		.from("pool")
		.select("choices")
		.eq("url", hash);
	if (error) {
		console.log(error);
		return { props: { error: error } };
	}
	return { props: { results: data, hash: hash } };
}

