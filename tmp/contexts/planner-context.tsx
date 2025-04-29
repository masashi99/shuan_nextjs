"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

// 教科の型定義
export type Subject = {
  id: string
  name: string // 教科名（例：国語、数学）
  color: string // 教科の色（例：primary, secondary, danger）
}

// 単元の型定義
export type Unit = {
  id: string
  subjectId: string // 所属する教科のID
  name: string // 単元名（例：古文、方程式）
  requiredPeriods: number // 必要なコマ数
}

// 授業の型定義（テンプレート）
export type ClassTemplate = {
  id: string
  day: string // 曜日
  periodId: number // コマID
  subjectId: string // 教科ID
  unitId: string | null // 単元ID（nullの場合は単元未設定）
}

// 実際の授業の型定義（特定の日付に紐づく）
export type Class = {
  id: string
  date: string // 日付（YYYY-MM-DD形式）
  day: string // 曜日
  periodId: number // コマID
  subjectId: string // 教科ID
  unitId: string | null // 単元ID
}

export type Memo = {
  id: string
  day: string
  content: string
}

// 日曜日を除外
export const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

// テーマカラー
export const THEME_COLORS = [
  { name: "primary", value: "bg-primary text-primary-foreground" },
  { name: "secondary", value: "bg-secondary text-secondary-foreground" },
  { name: "danger", value: "bg-danger text-danger-foreground" },
]

// 授業コマの定義（朝学と休み時間を含む）
export const PERIODS = [
  { id: 0, name: "朝学", startTime: "08:15", endTime: "08:45", isHalfHeight: true, isBreak: false },
  { id: 1, name: "1時間目", startTime: "08:50", endTime: "09:40", isHalfHeight: false, isBreak: false },
  { id: 2, name: "2時間目", startTime: "09:50", endTime: "10:40", isHalfHeight: false, isBreak: false },
  { id: 3, name: "休み時間", startTime: "10:40", endTime: "11:00", isHalfHeight: true, isBreak: true },
  { id: 4, name: "3時間目", startTime: "11:00", endTime: "11:50", isHalfHeight: false, isBreak: false },
  { id: 5, name: "4時間目", startTime: "12:00", endTime: "12:50", isHalfHeight: false, isBreak: false },
  { id: 6, name: "休み時間", startTime: "12:50", endTime: "13:30", isHalfHeight: true, isBreak: true },
  { id: 7, name: "5時間目", startTime: "13:30", endTime: "14:20", isHalfHeight: false, isBreak: false },
  { id: 8, name: "6時間目", startTime: "14:30", endTime: "15:20", isHalfHeight: false, isBreak: false },
  { id: 9, name: "メモ", startTime: "", endTime: "", isHalfHeight: false, isBreak: false, isMemo: true },
]

// 授業を登録できるコマのIDのみを抽出
export const CLASS_PERIOD_IDS = PERIODS.filter((p) => !p.isBreak && !p.isMemo).map((p) => p.id)

type PlannerContextType = {
  subjects: Subject[]
  units: Unit[]
  classTemplates: ClassTemplate[]
  classes: Class[]
  memos: Memo[]
  addSubject: (name: string) => void
  updateSubject: (id: string, name: string) => void
  deleteSubject: (id: string) => void
  addUnit: (subjectId: string, name: string, requiredPeriods: number) => void
  updateUnit: (id: string, name: string, requiredPeriods: number) => void
  deleteUnit: (id: string) => void
  setClassTemplate: (day: string, periodId: number, subjectId: string, unitId: string | null) => void
  deleteClassTemplate: (day: string, periodId: number) => void
  getClassTemplate: (day: string, periodId: number) => ClassTemplate | undefined
  updateMemo: (day: string, content: string) => void
  getSubjectById: (id: string) => Subject | undefined
  getUnitById: (id: string) => Unit | undefined
  getUnitsBySubjectId: (subjectId: string) => Unit[]
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined)

export function PlannerProvider({ children }: { children: ReactNode }) {
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("subjects")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [units, setUnits] = useState<Unit[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("units")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [classTemplates, setClassTemplates] = useState<ClassTemplate[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("classTemplates")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [classes, setClasses] = useState<Class[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("classes")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [memos, setMemos] = useState<Memo[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("memos")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem("subjects", JSON.stringify(subjects))
  }, [subjects])

  useEffect(() => {
    localStorage.setItem("units", JSON.stringify(units))
  }, [units])

  useEffect(() => {
    localStorage.setItem("classTemplates", JSON.stringify(classTemplates))
  }, [classTemplates])

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes))
  }, [classes])

  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos))
  }, [memos])

  // 教科の追加
  const addSubject = (name: string) => {
    if (!name.trim()) return
    // 色を自動的に割り当て（primary, secondary, dangerを順番に使用）
    const colorIndex = subjects.length % THEME_COLORS.length
    const color = THEME_COLORS[colorIndex].name
    setSubjects([...subjects, { id: Date.now().toString(), name, color }])
  }

  // 教科の更新
  const updateSubject = (id: string, name: string) => {
    if (!name.trim()) return
    setSubjects(subjects.map((subject) => (subject.id === id ? { ...subject, name } : subject)))
  }

  // 教科の削除（関連する単元も削除）
  const deleteSubject = (id: string) => {
    setSubjects(subjects.filter((subject) => subject.id !== id))
    setUnits(units.filter((unit) => unit.subjectId !== id))
    setClassTemplates(classTemplates.filter((template) => template.subjectId !== id))
  }

  // 単元の追加
  const addUnit = (subjectId: string, name: string, requiredPeriods: number) => {
    if (!name.trim() || requiredPeriods <= 0) return
    setUnits([...units, { id: Date.now().toString(), subjectId, name, requiredPeriods }])
  }

  // 単元の更新
  const updateUnit = (id: string, name: string, requiredPeriods: number) => {
    if (!name.trim() || requiredPeriods <= 0) return
    setUnits(units.map((unit) => (unit.id === id ? { ...unit, name, requiredPeriods } : unit)))
  }

  // 単元の削除
  const deleteUnit = (id: string) => {
    setUnits(units.filter((unit) => unit.id !== id))
    // 関連するテンプレートの単元IDをnullに設定
    setClassTemplates(
      classTemplates.map((template) => (template.unitId === id ? { ...template, unitId: null } : template)),
    )
  }

  // 授業テンプレートの設定（追加または更新）
  const setClassTemplate = (day: string, periodId: number, subjectId: string, unitId: string | null) => {
    const existingIndex = classTemplates.findIndex((template) => template.day === day && template.periodId === periodId)

    if (existingIndex >= 0) {
      // 既存のテンプレートを更新
      const updatedTemplates = [...classTemplates]
      updatedTemplates[existingIndex] = {
        ...updatedTemplates[existingIndex],
        subjectId,
        unitId,
      }
      setClassTemplates(updatedTemplates)
    } else {
      // 新しいテンプレートを追加
      setClassTemplates([
        ...classTemplates,
        {
          id: Date.now().toString(),
          day,
          periodId,
          subjectId,
          unitId,
        },
      ])
    }
  }

  // 授業テンプレートの削除
  const deleteClassTemplate = (day: string, periodId: number) => {
    setClassTemplates(classTemplates.filter((template) => !(template.day === day && template.periodId === periodId)))
  }

  // 特定の曜日・時限の授業テンプレートを取得
  const getClassTemplate = (day: string, periodId: number) => {
    return classTemplates.find((template) => template.day === day && template.periodId === periodId)
  }

  // メモの更新
  const updateMemo = (day: string, content: string) => {
    const existingMemoIndex = memos.findIndex((memo) => memo.day === day)

    if (existingMemoIndex >= 0) {
      // 既存のメモを更新
      const updatedMemos = [...memos]
      updatedMemos[existingMemoIndex] = {
        ...updatedMemos[existingMemoIndex],
        content,
      }
      setMemos(updatedMemos)
    } else {
      // 新しいメモを追加
      setMemos([
        ...memos,
        {
          id: Date.now().toString(),
          day,
          content,
        },
      ])
    }
  }

  // IDから教科を取得
  const getSubjectById = (id: string) => {
    return subjects.find((subject) => subject.id === id)
  }

  // IDから単元を取得
  const getUnitById = (id: string) => {
    return units.find((unit) => unit.id === id)
  }

  // 教科IDから単元のリストを取得
  const getUnitsBySubjectId = (subjectId: string) => {
    return units.filter((unit) => unit.subjectId === subjectId)
  }

  return (
    <PlannerContext.Provider
      value={{
        subjects,
        units,
        classTemplates,
        classes,
        memos,
        addSubject,
        updateSubject,
        deleteSubject,
        addUnit,
        updateUnit,
        deleteUnit,
        setClassTemplate,
        deleteClassTemplate,
        getClassTemplate,
        updateMemo,
        getSubjectById,
        getUnitById,
        getUnitsBySubjectId,
      }}
    >
      {children}
    </PlannerContext.Provider>
  )
}

export function usePlanner() {
  const context = useContext(PlannerContext)
  if (context === undefined) {
    throw new Error("usePlanner must be used within a PlannerProvider")
  }
  return context
}
