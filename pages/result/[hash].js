import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";
import { FaShareSquare } from "react-icons/fa";

//Notification
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

//Doughnut - Pie
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
//Vertical Bar
import { CategoryScale, LinearScale, BarElement, Title } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Player } from "@lottiefiles/react-lottie-player";
import { Line } from "react-chartjs-2";
import { PointElement, LineElement, Filler } from "chart.js";

//Doughnut - Pie
ChartJS.register(ArcElement, Tooltip, Legend);
//Vertical Bar
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);
//Area
ChartJS.register(PointElement, LineElement, Filler);

//Daughnut - Pie Options
export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
	},
};

export const areaOptions = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
	},
};
export default function Results({ serverData, error }) {
	const [voteCount, setVoteCount] = useState(0);
	const [results, setResults] = useState(serverData);
	const [sub, setSub] = useState();
	const [chartType, setChartType] = useState("doughnut");
	const router = useRouter();
	const { hash } = router.query;

	//subscribe to updates to the poll
	useEffect(() => {
		const subscription = supabase
			.from("pool")
			.on("UPDATE", (payload) => {
				console.log(payload);
				setSub(payload);
			})
			.subscribe();

		return () => supabase.removeSubscription(subscription);
	}, []);

	useEffect(() => {
		//if new payload is received, update the results
		if (sub) {
			const getData = async () => {
				const { data, error } = await supabase
					.from("pool")
					.select("choices")
					.eq("url", hash);
				if (error) {
					console.log(error);
				}
				if (data) {
					setResults(data);
				}
			};
			getData();
		}
		console.log("voteCount", voteCount);
		//set null for avoiding infinite loop
		setSub(null);
	}),
		[sub];

	const shareHandler = (e) => {
		if(e !== "vote"){
			toast("✔ Results link copied to clickboard", {
				autoClose: 3000,
			});
			var text = document.location.href;
			navigator.clipboard.writeText(text);
		} else {
			toast("✔ Vote link copied to clickboard", {
				autoClose: 3000,
			});
			var text = document.location.href;
			text = text.replace("result", "vote");
			navigator.clipboard.writeText(text);
		}
	};
	const data = {
		labels: results.map((count) => count.choices[0].choice),
		datasets: [
			{
				data: results.map((count) => count.choices[0].count),

				backgroundColor: [
					"rgba(255, 99, 132, 0.2)",
					"rgba(54, 162, 235, 0.2)",
					"rgba(255, 206, 86, 0.2)",
					"rgba(75, 192, 192, 0.2)",
					"rgba(153, 102, 255, 0.2)",
					"rgba(255, 159, 64, 0.2)",
				],
				borderColor: [
					"rgba(255, 99, 132, 1)",
					"rgba(54, 162, 235, 1)",
					"rgba(255, 206, 86, 1)",
					"rgba(75, 192, 192, 1)",
					"rgba(153, 102, 255, 1)",
					"rgba(255, 159, 64, 1)",
				],
				borderWidth: 2,
			},
		],
	};
	const areaData = {
		labels: results.map((count) => count.choices[0].choice),
		datasets: [
			{
				label: "Votes",
				fill: true,
				data: results.map((count) => count.choices[0].count),
				borderColor: "rgb(53, 162, 235)",
				backgroundColor: "rgba(53, 162, 235, 0.5)",
			},
		],
	};

	if (!results) {
		return <div>Loading...</div>;
	}
	if (error) {
		console.log(error);
		return <div>Error</div>;
	}
	if (results.length === 0) {
		return <div>No results</div>;
	}
		
	return (
		<div className="h-screen flex flex-col justify-center items-center">
			<ToastContainer />
			<div className="flex flex-col gap-y-5 share-items">
				<button className="share-button" onClick={shareHandler}>
					<Player
						autoplay
						loop
						src="https://assets1.lottiefiles.com/packages/lf20_OBNxe4.json"
						style={{ height: "50px", width: "50px" }}></Player>
					Share Results
				</button>
				<button className="share-button" onClick={() => shareHandler("vote")}>
					<Player
						autoplay
						loop
						src="https://assets1.lottiefiles.com/packages/lf20_OBNxe4.json"
						style={{ height: "50px", width: "50px", color: "#fff" }}></Player>
					Vote
				</button>
			</div>
			<div className="flex gap-x-4 items-center">
				<button
					onClick={() => setChartType("doughnut")}
					className={
						chartType === "doughnut"
							? "text-white chartTypeButton active"
							: "text-white chartTypeButton"
					}>
					Doughnut
				</button>
				<button
					onClick={() => setChartType("pie")}
					className={
						chartType === "pie"
							? "text-white chartTypeButton active"
							: "text-white chartTypeButton"
					}>
					Pie
				</button>
				<button
					onClick={() => setChartType("area")}
					className={
						chartType === "area"
							? "text-white chartTypeButton active"
							: "text-white chartTypeButton"
					}>
					Area
				</button>
				<button onClick={shareHandler}></button>
			</div>
			<div className="w-96">
				{chartType === "doughnut" && <Doughnut data={data} />}
				{chartType === "pie" && <Pie data={data} />}
				{chartType === "area" && <Line options={areaOptions} data={areaData} />}
			</div>
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
	}
	return {
		props: {
			serverData: data,
			error,
		},
	};
}
