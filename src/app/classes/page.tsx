import { ClassesManager } from "@/src/components/classes-manager";
import { PlannerProvider } from "@/src/contexts/planner-context";

export default function ClassesPage() {
	return (
		<PlannerProvider>
			<h1 className="text-2xl font-bold mb-6">授業設定</h1>
			<ClassesManager />
		</PlannerProvider>
	);
}
