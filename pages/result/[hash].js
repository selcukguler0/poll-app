import { useRouter } from "next/router";
import { useState } from "react";

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

const choices = [
	{ vote: "ss", count: 33 },
	{ vote: "2", count: 13 },
];

export const data = {
	labels: choices.map((choice) => choice.vote),
	datasets: [
		{
			label: "# of Votes",
			data: choices.map((choice) => choice.count),
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

export const verticalBarData = {
	labels: ["January", "February", "March", "April"],
	datasets: [
		{
			label: "Dataset 1",
			data: [40, 39, 10, 40],
			backgroundColor: "rgba(255, 99, 132, 0.5)",
		},
		{
			label: "Dataset 2",
			data: [40, 39, 10, 40],
			backgroundColor: "rgba(53, 162, 235, 0.5)",
		},
	],
};

export default function Results() {
	const [chartType, setChartType] = useState("doughnut");
	const router = useRouter();
	const { hash } = router.query;
	console.log(hash);
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
