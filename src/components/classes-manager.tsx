"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export function ClassesManager() {
	const [className, setClassName] = useState("");
	const [classes, setClasses] = useState<{ id: string; name: string }[]>([]);

	const handleAddClass = () => {
		if (className.trim()) {
			setClasses([...classes, { id: crypto.randomUUID(), name: className }]);
			setClassName("");
		}
	};

	return (
		<Card>
			<CardContent className="p-4">
				<div className="space-y-4">
					<div>
						<Label htmlFor="class-name">授業名</Label>
						<Input
							id="class-name"
							placeholder="例：数学I"
							value={className}
							onChange={(e) => setClassName(e.target.value)}
						/>
					</div>
					<Button onClick={handleAddClass}>授業を追加</Button>

					<div>
						<h3 className="text-lg font-semibold mb-2">登録済み授業</h3>
						{classes.length === 0 ? (
							<p className="text-muted-foreground">
								授業はまだ登録されていません。
							</p>
						) : (
							<ul>
								{classes.map((c) => (
									<li key={c.id} className="py-1">
										{c.name}
									</li>
								))}
							</ul>
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
