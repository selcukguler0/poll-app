import { supabase } from "../../utils/supabaseClient";
import { useRef } from "react";

export default function Votes({ results, hash }) {
	const choiceRef = useRef(null);
	
	const handleChoice = async (e) => {
		const { value } = e.target;
		console.log(value);
		console.log(choiceRef.current.id);
		const column = await choiceRef.current.id;
		//select current count
		const { data: sdata, error: serror } = await supabase
			.from("pool")
			.select(column)
			.match({ url: hash });
		if (serror) {
			console.log(serror);
			return;
		}
		//current count
		console.log(sdata[0][column][0].count);
		const count = sdata[0][column][0].count;	

		//update count
		const { data, error } = await supabase
			.from("pool")
			.update({ choices_2: [{ choice: value, count: count + 1 }] })
			.eq("url", hash);

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
			{results[0].choices_1 && (
				<input
					ref={choiceRef}
					id="choices_1"
					type="button"
					onClick={handleChoice}
					className="choiceButton"
					value={results[0].choices_1[0].choice}
				/>
			)}
			{results[0].choices_2 && (
				<input
					ref={choiceRef}
					id="choices_2"
					type="button"
					onClick={handleChoice}
					className="choiceButton"
					value={results[0].choices_2[0].choice}
				/>
			)}
			{results[0].choices_3 && (
				<input
					ref={choiceRef}
					id="choices_3"
					type="button"
					onClick={handleChoice}
					className="choiceButton"
					value={results[0].choices_3[0].choice}
				/>
			)}
			{results[0].choices_4 && (
				<input
					ref={choiceRef}
					id="choices_4"
					type="button"
					onClick={handleChoice}
					className="choiceButton"
					value={results[0].choices_4[0].choice}
				/>
			)}
			{results[0].choices_5 && (
				<input
					ref={choiceRef}
					id="choices_5"
					type="button"
					onClick={handleChoice}
					className="choiceButton"
					value={results[0].choices_5[0].choice}
				/>
			)}
		</div>
	);
}

export async function getServerSideProps(context) {
	const { hash } = context.query;
	const { data, error } = await supabase
		.from("pool")
		.select("choices_1, choices_2, choices_3, choices_4, choices_5")
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
