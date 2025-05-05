"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import {
	DAYS,
	PERIODS,
	THEME_COLORS,
	usePlanner,
} from "@/contexts/planner-context";
import { Trash2 } from "lucide-react";
import { useState } from "react";

export function ClassSettings() {
	const {
		subjects,
		units,
		classTemplates,
		setClassTemplate,
		deleteClassTemplate,
		getClassTemplate,
		getSubjectById,
		getUnitById,
		getUnitsBySubjectId,
	} = usePlanner();

	const [isDialogOpen, setIsDialogOpen] = useState(false);
	const [selectedCell, setSelectedCell] = useState<{
		day: string;
		periodId: number;
	} | null>(null);
	const [selectedSubjectId, setSelectedSubjectId] = useState<string>("");
	const [selectedUnitId, setSelectedUnitId] = useState<string | null>(null);

	// セルをクリックしたときの処理
	const handleCellClick = (day: string, periodId: number) => {
		const template = getClassTemplate(day, periodId);
		setSelectedCell({ day, periodId });
		setSelectedSubjectId(template?.subjectId || "");
		setSelectedUnitId(template?.unitId || null);
		setIsDialogOpen(true);
	};

	// 授業テンプレートを保存
	const saveClassTemplate = () => {
		if (selectedCell && selectedSubjectId) {
			setClassTemplate(
				selectedCell.day,
				selectedCell.periodId,
				selectedSubjectId,
				selectedUnitId,
			);
			setIsDialogOpen(false);
		}
	};

	// 授業テンプレートを削除
	const handleDeleteTemplate = () => {
		if (selectedCell) {
			deleteClassTemplate(selectedCell.day, selectedCell.periodId);
			setIsDialogOpen(false);
		}
	};

	// 教科が変更されたときの処理
	const handleSubjectChange = (subjectId: string) => {
		setSelectedSubjectId(subjectId);
		setSelectedUnitId(null); // 教科が変わったら単元をリセット
	};

	// 日本語の曜日表示
	const getDayInJapanese = (day: string) => {
		switch (day) {
			case "Monday":
				return "月曜日";
			case "Tuesday":
				return "火曜日";
			case "Wednesday":
				return "水曜日";
			case "Thursday":
				return "木曜日";
			case "Friday":
				return "金曜日";
			case "Saturday":
				return "土曜日";
			default:
				return day;
		}
	};

	// 表示するコマのみをフィルタリング（休み時間とメモを除外）
	const displayPeriods = PERIODS.filter(
		(period) => !period.isBreak && !period.isMemo,
	);

	// 色のクラス名を取得
	const getColorClass = (colorName: string) => {
		return THEME_COLORS.find((color) => color.name === colorName)?.value || "";
	};

	return (
		<>
			<div className="space-y-6">
				<h1 className="text-2xl font-bold">授業設定</h1>

				<div className="border rounded-lg overflow-hidden">
					<table className="w-full border-collapse">
						<thead>
							<tr className="border-b">
								<th className="p-3 text-center font-medium">時限</th>
								{DAYS.map((day) => (
									<th key={day} className="p-3 text-center font-medium">
										{getDayInJapanese(day)}
									</th>
								))}
							</tr>
						</thead>
						<tbody>
							{displayPeriods.map((period) => (
								<tr key={period.id} className="border-b">
									<td className="border-r p-3 text-center">
										<div className="font-medium">{period.name}</div>
										{period.startTime && (
											<div className="text-xs text-muted-foreground">
												{period.startTime}〜{period.endTime}
											</div>
										)}
									</td>

									{DAYS.map((day) => {
										// 授業を設定できるコマの場合
										const template = getClassTemplate(day, period.id);
										const subject = template
											? getSubjectById(template.subjectId)
											: null;
										const unit = template?.unitId
											? getUnitById(template.unitId)
											: null;

										return (
											// biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
											<td
												key={day}
												className="border-r p-2 h-24 cursor-pointer hover:bg-gray-50"
												onClick={() => handleCellClick(day, period.id)}
											>
												{template && subject && (
													<div
														className={`h-full p-2 rounded ${getColorClass(subject.color)}`}
													>
														<div className="font-medium">{subject.name}</div>
														{unit && (
															<div className="text-xs mt-1">{unit.name}</div>
														)}
													</div>
												)}
											</td>
										);
									})}
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</div>

			{/* 授業設定ダイアログ */}
			<Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>
							{selectedCell &&
								`${getDayInJapanese(selectedCell.day)} ${
									PERIODS.find((p) => p.id === selectedCell.periodId)?.name
								}の授業設定`}
						</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<label htmlFor="subject" className="text-sm font-medium">
								教科
							</label>
							<select
								id="subject"
								className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
								value={selectedSubjectId}
								onChange={(e) => handleSubjectChange(e.target.value)}
							>
								<option value="">教科を選択</option>
								{subjects.map((subject) => (
									<option key={subject.id} value={subject.id}>
										{subject.name}
									</option>
								))}
							</select>
						</div>

						{selectedSubjectId && (
							<div className="space-y-2">
								<label htmlFor="unit" className="text-sm font-medium">
									単元
								</label>
								<select
									id="unit"
									className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
									value={selectedUnitId || ""}
									onChange={(e) => setSelectedUnitId(e.target.value || null)}
								>
									<option value="">単元を選択（任意）</option>
									{getUnitsBySubjectId(selectedSubjectId).map((unit) => (
										<option key={unit.id} value={unit.id}>
											{unit.name} （{unit.requiredPeriods}コマ）
										</option>
									))}
								</select>
							</div>
						)}
					</div>

					<DialogFooter className="flex justify-between">
						<Button
							variant="destructive"
							onClick={handleDeleteTemplate}
							className="mr-auto"
							disabled={!selectedSubjectId} // 授業が設定されていない場合は非活性化
						>
							<Trash2 className="h-4 w-4 mr-2" />
							削除
						</Button>
						<div>
							<Button
								variant="outline"
								onClick={() => setIsDialogOpen(false)}
								className="mr-2"
							>
								キャンセル
							</Button>
							<Button onClick={saveClassTemplate} disabled={!selectedSubjectId}>
								保存
							</Button>
						</div>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
