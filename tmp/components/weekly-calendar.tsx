"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { usePlanner, DAYS, PERIODS, THEME_COLORS } from "@/contexts/planner-context"

export function WeeklyCalendar() {
  const { classTemplates, memos, updateMemo, getSubjectById, getUnitById } = usePlanner()
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    // 今週の月曜日を取得
    const today = new Date()
    const day = today.getDay() // 0が日曜、1が月曜...
    const diff = today.getDate() - day + (day === 0 ? -6 : 1) // 月曜日に調整
    return new Date(today.setDate(diff))
  })

  // 日本語の曜日表示
  const getDayInJapanese = (day: string) => {
    switch (day) {
      case "Monday":
        return "月"
      case "Tuesday":
        return "火"
      case "Wednesday":
        return "水"
      case "Thursday":
        return "木"
      case "Friday":
        return "金"
      case "Saturday":
        return "土"
      default:
        return day
    }
  }

  // 指定した曜日の日付を取得
  const getDateForDay = (day: string) => {
    const dayIndex = DAYS.indexOf(day)
    if (dayIndex === -1) return ""

    const date = new Date(currentWeekStart)
    date.setDate(currentWeekStart.getDate() + dayIndex)
    return `${date.getMonth() + 1}/${date.getDate()}`
  }

  // メモの内容を取得
  const getMemoContent = (day: string) => {
    const memo = memos.find((m) => m.day === day)
    return memo ? memo.content : ""
  }

  // メモの変更を処理
  const handleMemoChange = (day: string, content: string) => {
    updateMemo(day, content)
  }

  // 特定の曜日・時限の授業テンプレートを取得
  const getClassTemplateForCell = (day: string, periodId: number) => {
    return classTemplates.find((template) => template.day === day && template.periodId === periodId)
  }

  // 色のクラス名を取得
  const getColorClass = (colorName: string) => {
    return THEME_COLORS.find((color) => color.name === colorName)?.value || ""
  }

  return (
    <Card>
      <CardContent className="p-4">
        <div className="w-full overflow-x-auto">
          <div className="min-w-[700px]">
            {/* カレンダーヘッダー */}
            <div className="grid grid-cols-7 border-b">
              <div className="p-2 text-center font-medium text-muted-foreground">時限</div>
              {DAYS.map((day) => (
                <div key={day} className="p-2 text-center font-medium">
                  {getDayInJapanese(day)}（{getDateForDay(day)}）
                </div>
              ))}
            </div>

            {/* カレンダー本体 */}
            <div className="grid grid-cols-7">
              {/* 時限ラベル */}
              <div className="border-r">
                {PERIODS.map((period) => (
                  <div
                    key={period.id}
                    className={`border-b ${
                      period.isHalfHeight ? "h-12" : "h-24"
                    } text-xs text-muted-foreground flex flex-col items-center justify-center ${
                      period.isBreak ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="font-medium">{period.name}</div>
                  </div>
                ))}
              </div>

              {/* 曜日カラム */}
              {DAYS.map((day) => (
                <div key={day} className="relative border-r">
                  {/* 時限グリッド線 */}
                  {PERIODS.map((period) => {
                    // メモ欄の場合
                    if (period.isMemo) {
                      return (
                        <div key={period.id} className="border-b h-24 p-1">
                          <Textarea
                            placeholder="メモ"
                            className="h-full w-full text-xs resize-none"
                            value={getMemoContent(day)}
                            onChange={(e) => handleMemoChange(day, e.target.value)}
                          />
                        </div>
                      )
                    }

                    // 休み時間の場合
                    if (period.isBreak) {
                      return <div key={period.id} className="border-b h-12 bg-gray-50"></div>
                    }

                    // 通常のコマの場合
                    const template = getClassTemplateForCell(day, period.id)
                    const subject = template ? getSubjectById(template.subjectId) : null
                    const unit = template?.unitId ? getUnitById(template.unitId) : null

                    return (
                      <div key={period.id} className={`border-b ${period.isHalfHeight ? "h-12" : "h-24"} relative`}>
                        {template && subject && (
                          <div className={`p-2 h-full rounded-sm m-1 ${getColorClass(subject.color)}`}>
                            <div className="font-medium">{subject.name}</div>
                            {unit && <div className="text-xs mt-1">{unit.name}</div>}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
