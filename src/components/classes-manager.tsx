"use client";

import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlanner } from "@/contexts/planner-context";
import { useState } from "react";

export function ClassesManager() {
	const { subjects, addSubject, updateSubject, deleteSubject } = usePlanner();

	const [newSubject, setNewSubject] = useState("");

	const handleAddSubject = () => {
		if (newSubject.trim()) {
			addSubject(newSubject);
			setNewSubject("");
		}
	};

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
			<Card>
				<CardHeader>
					<CardTitle>授業一覧</CardTitle>
					<CardDescription>登録されている授業を表示します</CardDescription>
				</CardHeader>
				<CardContent>
					{subjects.length === 0 ? (
						<p>授業はまだ登録されていません。</p>
					) : (
						<ul>
							{subjects.map((subject) => (
								<li
									key={subject.id}
									className="flex items-center justify-between py-2 border-b"
								>
									<span>{subject.name}</span>
									<div className="space-x-2">
										<Button variant="outline" size="sm">
											編集
										</Button>
										<Button variant="destructive" size="sm">
											削除
										</Button>
									</div>
								</li>
							))}
						</ul>
					)}
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>授業の追加</CardTitle>
					<CardDescription>新しい授業を登録します</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						<div>
							<Label htmlFor="name">授業名</Label>
							<Input
								type="text"
								id="name"
								placeholder="授業名を入力"
								value={newSubject}
								onChange={(e) => setNewSubject(e.target.value)}
							/>
						</div>
					</div>
				</CardContent>
				<CardFooter>
					<Button onClick={handleAddSubject}>授業を追加</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
