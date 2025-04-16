"use client";
import { useEffect, useState } from "react";

export default function Home() {
	const [data, setData] = useState("");

	useEffect(() => {
		const fetcher = async () => {
			const res = await fetch("/api/hello");
			const data = await res.json();
			console.log(data);
			setData(data.message);
		};
		fetcher();
	}, []);
	return (
		<div>
			<p>{data}</p>
		</div>
	);
}
