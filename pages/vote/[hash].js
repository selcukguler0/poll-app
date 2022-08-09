import { supabase } from "../../utils/supabaseClient";

export default function Votes({ results, hash }) {
	console.log(results, hash);

	const handleChoice = async (e) => {
		const { value } = e.target;
		console.log(value);
		const { data, error } = await supabase
			.from("pool")
			.update(`choices: {
								choice: "qq",
								count: 2}`
			)
			.eq("choices->choice", value);
		if (error) {
			console.log(error);
			return;
		}
		console.log(data);
	};
	if (!results || results.length === 0) {
		console.log("no data");
		return <div>Loading...</div>;
	}
	console.log("res", results);
	return (
		<div className="h-screen flex justify-center items-center gap-y-3 flex-col w-96 m-auto">
			<input
				type="button"
				onClick={handleChoice}
				className="choiceButton"
				value={results[0].choices.choice}
			/>
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

// import { supabase } from "../../utils/supabaseClient";

// export default function Votes({ results, hash }) {
// 	console.log(results, hash);

// 	const handleChoice = async (e) => {
// 		const { value } = e.target;
// 		console.log(value);
// 		console.log(results[0].choices[0].choice === value);
// 		const { data, error } = await supabase
// 			.from("pool")
// 			.update(
// 				`
// 				choices: {
// 				choice: "${value}",
// 				count: 2
// 			}`
// 			)
// 			.eq("choices->choice", value)
// 			.match("url", hash);
// 		if (error) {
// 			console.log(error);
// 			return;
// 		}
// 		console.log(data);
// 	};
// 	if (!results || results.length === 0) {
// 		console.log("no data");
// 		return <div>Loading...</div>;
// 	}
// 	console.log("res", results);
// 	return (
// 		<div className="h-screen flex justify-center items-center gap-y-3 flex-col w-96 m-auto">
// 			{results[0].choices.map((choices, index) => {
// 				return (
// 					<input
// 						type="button"
// 						onClick={handleChoice}
// 						key={index}
// 						className="choiceButton"
// 						value={choices.choice}
// 					/>
// 				);
// 			})}
// 		</div>
// 	);
// }

// export async function getServerSideProps(context) {
// 	const { hash } = context.query;
// 	const { data, error } = await supabase
// 		.from("pool")
// 		.select("choices")
// 		.eq("url", "hash");
// 	if (error) {
// 		console.log(error);
// 		return { props: { error: error } };
// 	}
// 	return { props: { results: data, hash: hash } };
// }
