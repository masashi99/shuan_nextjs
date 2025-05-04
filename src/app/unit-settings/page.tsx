import { UnitSettings } from "@/src/components/unit-settings";
import { PlannerProvider } from "@/src/contexts/planner-context";

export default function UnitSettingsPage() {
	return (
		<PlannerProvider>
			<h1 className="text-2xl font-bold mb-6">単元設定</h1>
			<UnitSettings />
		</PlannerProvider>
	);
}
