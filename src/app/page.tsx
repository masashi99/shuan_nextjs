import { WeeklyCalendar } from "@/src/components/weekly-calendar";
import { PlannerProvider } from "@/src/contexts/planner-context";

export default function Home() {
	return (
		<PlannerProvider>
			<h1 className="text-2xl font-bold mb-6">週間スケジュール</h1>
			<WeeklyCalendar />
		</PlannerProvider>
	);
}
