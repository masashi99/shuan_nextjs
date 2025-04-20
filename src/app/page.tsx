import { Test } from "@/features/test/Test";
import { Suspense } from "react";

export default function Home() {

	const res = getData();

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<Test data={res} />
		</Suspense>
	);
}

async function getData() {
	const res = await fetch("http://localhost:3000/api/hello");
	if (!res.ok) {
		throw new Error("Failed to fetch data");
	}
	const data = await res.json();
	return data.message;
}