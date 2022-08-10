import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { supabase } from "../../utils/supabaseClient";

//Doughnut - Pie
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
//Vertical Bar
import { CategoryScale, LinearScale, BarElement, Title } from "chart.js";

import { Doughnut } from "react-chartjs-2";
import { Pie } from "react-chartjs-2";
import { Bar } from "react-chartjs-2";

//Doughnut - Pie
ChartJS.register(ArcElement, Tooltip, Legend);
//Vertical Bar
ChartJS.register(CategoryScale, LinearScale, BarElement, Title);

export const options = {
	responsive: true,
	plugins: {
		legend: {
			position: "top",
		},
		title: {
			display: true,
			text: "Chart.js Bar Chart",
		},
	},
};

export default function Results({ results, error }) {
	const [chartType, setChartType] = useState("doughnut");
	const router = useRouter();
	const { hash } = router.query;

	results.map((count) => {
		console.log("choice", count.choices[0].choice);
	});

	console.log("results", results);
	console.log("results", results[0].choices[0]);

	if (!results) {
		console.log("no data");
		return <div>Loading...</div>;
	}
	if (error) {
		console.log(error);
		return <div>Error</div>;
	}
	console.log(results[0]);

	const data = {
		labels: results.map((count) => count.choices[0].choice),
		datasets: [
			{
				label: "# of Votes",
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
	const verticalBarData = {
		labels: results[0].choices.map((result) => result.choice),
		datasets: [
			{
				label: "Choices",
				data: results[0].choices.map((result) => result.count),
				backgroundColor: "rgba(255, 99, 132, 0.5)",
			},
		],
	};
	return (
		<div className="h-screen flex flex-col justify-center items-center">
			<div className="flex gap-4">
				<button
					onClick={() => setChartType("doughnut")}
					className="text-center text-white chartTypeButton">
					Doughnut
				</button>
				<button
					onClick={() => setChartType("pie")}
					className=" text-white chartTypeButton">
					Pie
				</button>
				<button
					onClick={() => setChartType("bar")}
					className=" text-white chartTypeButton">
					Bar
				</button>
			</div>
			<div className="w-96">
				{chartType === "doughnut" && <Doughnut data={data} />}
				{chartType === "pie" && <Pie data={data} />}
				{chartType === "bar" && <Bar data={verticalBarData} />}
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
			results: data,
			error,
		},
	};
}
