import { UnitSettings } from "@/components/unit-settings"
import { PlannerProvider } from "@/contexts/planner-context"

export default function UnitSettingsPage() {
  return (
    <PlannerProvider>
      <h1 className="text-2xl font-bold mb-6">単元設定</h1>
      <UnitSettings />
    </PlannerProvider>
  )
}
