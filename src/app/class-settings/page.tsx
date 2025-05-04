import { ClassSettings } from "@/src/components/class-settings";
import { PlannerProvider } from "@/src/contexts/planner-context";

export default function ClassSettingsPage() {
	return (
		<PlannerProvider>
			<h1 className="text-2xl font-bold mb-6">授業設定</h1>
			<ClassSettings />
		</PlannerProvider>
	);
}
