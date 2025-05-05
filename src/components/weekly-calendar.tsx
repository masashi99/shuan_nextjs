"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
	DAYS,
	PERIODS,
	THEME_COLORS,
	usePlanner,
} from "@/contexts/planner-context";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function WeeklyCalendar() {
	const { classTemplates, memos, updateMemo, getSubjectById, getUnitById } =
		usePlanner();
	const [currentWeekStart, setCurrentWeekStart] = useState(() => {
		// 今週の月曜日を取得
		const today = new Date();
		const day = today.getDay(); // 0が日曜、1が月曜...
		const diff = today.getDate() - day + (day === 0 ? -6 : 1); // 月曜日に調整
		return new Date(today.setDate(diff));
	});

	// 前の週へ
	const goToPreviousWeek = () => {
		const newDate = new Date(currentWeekStart);
		newDate.setDate(currentWeekStart.getDate() - 7);
		setCurrentWeekStart(newDate);
	};

	// 次の週へ
	const goToNextWeek = () => {
		const newDate = new Date(currentWeekStart);
		newDate.setDate(currentWeekStart.getDate() + 7);
		setCurrentWeekStart(newDate);
	};

	// 今週へ
	const goToCurrentWeek = () => {
		const today = new Date();
		const day = today.getDay();
		const diff = today.getDate() - day + (day === 0 ? -6 : 1);
		setCurrentWeekStart(new Date(today.setDate(diff)));
	};

	// 日本語の曜日表示
	const getDayInJapanese = (day: string) => {
		switch (day) {
			case "Monday":
				return "月";
			case "Tuesday":
				return "火";
			case "Wednesday":
				return "水";
			case "Thursday":
				return "木";
			case "Friday":
				return "金";
			case "Saturday":
				return "土";
			default:
				return day;
		}
	};

	// 指定した曜日の日付を取得
	const getDateForDay = (day: string) => {
		const dayIndex = DAYS.indexOf(day);
		if (dayIndex === -1) return "";

		const date = new Date(currentWeekStart);
		date.setDate(currentWeekStart.getDate() + dayIndex);
		return `${date.getDate()}`;
	};

	// メモの内容を取得
	const getMemoContent = (day: string) => {
		const memo = memos.find((m) => m.day === day);
		return memo ? memo.content : "";
	};

	// メモの変更を処理
	const handleMemoChange = (day: string, content: string) => {
		updateMemo(day, content);
	};

	// 特定の曜日・時限の授業テンプレートを取得
	const getClassTemplateForCell = (day: string, periodId: number) => {
		return classTemplates.find(
			(template) => template.day === day && template.periodId === periodId,
		);
	};

	// 色のクラス名を取得
	const getColorClass = (colorName: string) => {
		return THEME_COLORS.find((color) => color.name === colorName)?.value || "";
	};

	// 週の表示（例：2023年5月1日〜5月7日）
	const getWeekDisplay = () => {
		const endDate = new Date(currentWeekStart);
		endDate.setDate(currentWeekStart.getDate() + 5); // 月曜から土曜まで

		const startMonth = currentWeekStart.getMonth() + 1;
		const startDay = currentWeekStart.getDate();
		const endMonth = endDate.getMonth() + 1;
		const endDay = endDate.getDate();
		const year = currentWeekStart.getFullYear();

		if (startMonth === endMonth) {
			return `${year}年${startMonth}月${startDay}日〜${endDay}日`;
		}
		return `${year}年${startMonth}月${startDay}日〜${endMonth}月${endDay}日`;
	};

	// 表示するコマのみをフィルタリング（休み時間を含む）
	const displayPeriods = PERIODS.filter((period) => !period.isMemo);

	return (
		<div className="space-y-6">
			<h1 className="text-2xl font-bold">週間スケジュール</h1>

			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<Button
						variant="outline"
						size="icon"
						onClick={goToPreviousWeek}
						className="h-10 w-10"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" onClick={goToCurrentWeek} className="h-10">
						今週
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={goToNextWeek}
						className="h-10 w-10"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
				<h2 className="text-lg font-medium">{getWeekDisplay()}</h2>
			</div>

			<div className="border rounded-lg overflow-hidden">
				<table className="w-full border-collapse">
					<thead>
						<tr className="border-b">
							<th className="p-3 text-center font-medium">時限</th>
							{DAYS.map((day) => (
								<th key={day} className="p-3 text-center font-medium">
									{getDayInJapanese(day)} ({getDateForDay(day)})
								</th>
							))}
						</tr>
					</thead>
					<tbody>
						{displayPeriods.map((period) => (
							<tr key={period.id} className="border-b">
								<td className="border-r p-3 text-center">
									<div className={`${period.isBreak ? "bg-gray-50" : ""}`}>
										<div className="font-medium">{period.name}</div>
										{!period.isBreak && period.startTime && (
											<div className="text-xs text-muted-foreground">
												{period.startTime}〜{period.endTime}
											</div>
										)}
									</div>
								</td>

								{DAYS.map((day) => {
									// 休み時間の場合
									if (period.isBreak) {
										return <td key={day} className="border-r bg-gray-50" />;
									}

									// 通常のコマの場合
									const template = getClassTemplateForCell(day, period.id);
									const subject = template
										? getSubjectById(template.subjectId)
										: null;
									const unit = template?.unitId
										? getUnitById(template.unitId)
										: null;

									return (
										<td key={day} className="border-r p-2 h-24">
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

						{/* メモ欄 */}
						<tr className="border-b">
							<td className="border-r p-3 text-center font-medium">メモ</td>
							{DAYS.map((day) => (
								<td key={day} className="border-r p-1">
									<Textarea
										placeholder="メモ"
										className="h-24 w-full text-xs resize-none border-0 focus-visible:ring-0"
										value={getMemoContent(day)}
										onChange={(e) => handleMemoChange(day, e.target.value)}
									/>
								</td>
							))}
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	);
}
