import { useRouter } from "next/router";

const choices = [{ vote: "asd" }, { vote: "qq" }];

export default function Votes() {
	const router = useRouter();
	const { hash } = router.query;
	console.log(hash);

	const handleChoice = (e) => {
		console.log(e.target.value);
	};

	return (
		<div className="h-screen flex justify-center items-center gap-y-3 flex-col w-96 m-auto">
			{choices.map((choice, index) => {
				return (
					<input
						type="button"
						onClick={handleChoice}
						key={index}
						className="choiceButton"
						value={choice.vote}
					/>
				);
			})}
		</div>
	);
}
