"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Edit, Check, X } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { usePlanner, THEME_COLORS } from "@/contexts/planner-context"

export function UnitSettings() {
  const { subjects, units, addSubject, updateSubject, deleteSubject, addUnit, updateUnit, deleteUnit } = usePlanner()

  const [newSubjectName, setNewSubjectName] = useState("")
  const [showNewSubjectInput, setShowNewSubjectInput] = useState(false)
  const [editingSubject, setEditingSubject] = useState<{ id: string; name: string } | null>(null)
  const [newUnit, setNewUnit] = useState({ subjectId: "", name: "", requiredPeriods: 1 })
  const [editingUnit, setEditingUnit] = useState<{ id: string; name: string; requiredPeriods: number } | null>(null)

  // 教科の追加ボタンクリック
  const handleAddSubjectClick = () => {
    setShowNewSubjectInput(true)
  }

  // 教科の追加
  const handleAddSubject = () => {
    if (newSubjectName.trim()) {
      addSubject(newSubjectName)
      setNewSubjectName("")
      setShowNewSubjectInput(false)
    }
  }

  // 教科の追加キャンセル
  const handleCancelAddSubject = () => {
    setNewSubjectName("")
    setShowNewSubjectInput(false)
  }

  // 教科の編集開始
  const startEditingSubject = (id: string, name: string) => {
    setEditingSubject({ id, name })
  }

  // 教科の編集保存
  const saveEditingSubject = () => {
    if (editingSubject && editingSubject.name.trim()) {
      updateSubject(editingSubject.id, editingSubject.name)
      setEditingSubject(null)
    }
  }

  // 教科の編集キャンセル
  const cancelEditingSubject = () => {
    setEditingSubject(null)
  }

  // 単元の追加
  const handleAddUnit = (subjectId: string) => {
    if (newUnit.name.trim() && newUnit.requiredPeriods > 0) {
      addUnit(subjectId, newUnit.name, newUnit.requiredPeriods)
      setNewUnit({ ...newUnit, name: "", requiredPeriods: 1 })
    }
  }

  // 単元の編集開始
  const startEditingUnit = (id: string, name: string, requiredPeriods: number) => {
    setEditingUnit({ id, name, requiredPeriods })
  }

  // 単元の編集保存
  const saveEditingUnit = () => {
    if (editingUnit && editingUnit.name.trim() && editingUnit.requiredPeriods > 0) {
      updateUnit(editingUnit.id, editingUnit.name, editingUnit.requiredPeriods)
      setEditingUnit(null)
    }
  }

  // 単元の編集キャンセル
  const cancelEditingUnit = () => {
    setEditingUnit(null)
  }

  // 色のクラス名を取得
  const getColorClass = (colorName: string) => {
    return THEME_COLORS.find((color) => color.name === colorName)?.value || THEME_COLORS[0].value
  }

  return (
    <div className="space-y-6">
      {/* 教科追加ボタン */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">教科と単元の管理</h2>
        <Button onClick={handleAddSubjectClick}>
          <PlusCircle className="mr-2 h-4 w-4" />
          教科を追加
        </Button>
      </div>

      {/* 新規教科入力フォーム */}
      {showNewSubjectInput && (
        <Card>
          <CardHeader>
            <CardTitle>新しい教科を追加</CardTitle>
            <CardDescription>教科名を入力してください</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="subject-name">教科名</Label>
                <Input
                  id="subject-name"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="例: 国語"
                  className="flex-1"
                  autoFocus
                />
              </div>

              <div className="flex space-x-2 pt-2">
                <Button onClick={handleAddSubject}>追加</Button>
                <Button variant="outline" onClick={handleCancelAddSubject}>
                  キャンセル
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 教科と単元のリスト */}
      {subjects.length === 0 ? (
        <div className="text-center py-6 text-muted-foreground">
          教科が登録されていません。「教科を追加」ボタンから教科を追加してください。
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((subject) => {
            const subjectUnits = units.filter((unit) => unit.subjectId === subject.id)

            return (
              <Card key={subject.id} className="overflow-hidden">
                <CardHeader className={getColorClass(subject.color)}>
                  <div className="flex justify-between items-center">
                    {editingSubject && editingSubject.id === subject.id ? (
                      <div className="flex-1 space-y-4">
                        <Input
                          value={editingSubject.name}
                          onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                          className="max-w-xs"
                        />
                        <div className="flex space-x-2">
                          <Button variant="secondary" size="sm" onClick={saveEditingSubject}>
                            <Check className="h-4 w-4 mr-1" /> 保存
                          </Button>
                          <Button variant="outline" size="sm" onClick={cancelEditingSubject}>
                            <X className="h-4 w-4 mr-1" /> キャンセル
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <CardTitle>{subject.name}</CardTitle>
                    )}

                    {!editingSubject && (
                      <div className="flex space-x-2">
                        <Button
                          variant="secondary"
                          size="icon"
                          onClick={() => startEditingSubject(subject.id, subject.name)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="secondary" size="icon" onClick={() => deleteSubject(subject.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  <CardDescription className="text-card-foreground/80">
                    {subjectUnits.length}件の単元が登録されています
                  </CardDescription>
                </CardHeader>

                <CardContent className="p-4">
                  {/* 単元リスト */}
                  <div className="space-y-3">
                    {subjectUnits.length === 0 ? (
                      <div className="text-center py-4 text-muted-foreground">
                        単元が登録されていません。下のフォームから単元を追加してください。
                      </div>
                    ) : (
                      subjectUnits.map((unit) => (
                        <div key={unit.id} className="p-3 rounded-lg border flex justify-between items-center">
                          <div className="flex-1">
                            {editingUnit && editingUnit.id === unit.id ? (
                              <div className="flex space-x-2">
                                <Input
                                  value={editingUnit.name}
                                  onChange={(e) => setEditingUnit({ ...editingUnit, name: e.target.value })}
                                  className="max-w-xs"
                                />
                                <Input
                                  type="number"
                                  min="1"
                                  value={editingUnit.requiredPeriods}
                                  onChange={(e) =>
                                    setEditingUnit({
                                      ...editingUnit,
                                      requiredPeriods: Number.parseInt(e.target.value) || 1,
                                    })
                                  }
                                  className="w-20"
                                />
                              </div>
                            ) : (
                              <div>
                                <h4 className="font-medium">{unit.name}</h4>
                                <p className="text-sm text-muted-foreground">必要コマ数: {unit.requiredPeriods}</p>
                              </div>
                            )}
                          </div>
                          <div className="flex space-x-2">
                            {editingUnit && editingUnit.id === unit.id ? (
                              <>
                                <Button variant="ghost" size="icon" onClick={saveEditingUnit}>
                                  <Check className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={cancelEditingUnit}>
                                  <X className="h-4 w-4" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => startEditingUnit(unit.id, unit.name, unit.requiredPeriods)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => deleteUnit(unit.id)}>
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* 単元追加フォーム */}
                  <div className="mt-4 pt-4 border-t">
                    <h4 className="font-medium mb-2">単元を追加</h4>
                    <div className="flex space-x-2">
                      <Input
                        value={newUnit.name}
                        onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                        placeholder="単元名"
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        min="1"
                        value={newUnit.requiredPeriods}
                        onChange={(e) =>
                          setNewUnit({ ...newUnit, requiredPeriods: Number.parseInt(e.target.value) || 1 })
                        }
                        className="w-24"
                        placeholder="コマ数"
                      />
                      <Button onClick={() => handleAddUnit(subject.id)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        追加
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
