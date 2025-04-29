"use client"

import { useState, useEffect } from "react"
import { PlusCircle, Trash2, Calendar, BookOpen, Clock, BarChart } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WeeklyCalendar } from "@/components/weekly-calendar"
import { AssignmentTracker } from "@/components/assignment-tracker"
import { StudyTimeAllocator } from "@/components/study-time-allocator"
import { Statistics } from "@/components/statistics"

export type Class = {
  id: string
  name: string
  instructor: string
  location: string
  day: string
  startTime: string
  endTime: string
  color: string
}

export type Assignment = {
  id: string
  classId: string
  title: string
  dueDate: string
  completed: boolean
  priority: "low" | "medium" | "high"
}

export type StudySession = {
  id: string
  classId: string
  day: string
  duration: number
}

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
const COLORS = [
  "bg-red-200",
  "bg-blue-200",
  "bg-green-200",
  "bg-yellow-200",
  "bg-purple-200",
  "bg-pink-200",
  "bg-indigo-200",
]

export function WeeklyPlanner() {
  const [classes, setClasses] = useState<Class[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("classes")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [assignments, setAssignments] = useState<Assignment[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("assignments")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("studySessions")
      return saved ? JSON.parse(saved) : []
    }
    return []
  })

  useEffect(() => {
    localStorage.setItem("classes", JSON.stringify(classes))
  }, [classes])

  useEffect(() => {
    localStorage.setItem("assignments", JSON.stringify(assignments))
  }, [assignments])

  useEffect(() => {
    localStorage.setItem("studySessions", JSON.stringify(studySessions))
  }, [studySessions])

  const [newClass, setNewClass] = useState<Omit<Class, "id" | "color">>({
    name: "",
    instructor: "",
    location: "",
    day: "",
    startTime: "",
    endTime: "",
  })

  const handleAddClass = () => {
    if (!newClass.name || !newClass.day || !newClass.startTime || !newClass.endTime) {
      return
    }

    const colorIndex = classes.length % COLORS.length

    setClasses([
      ...classes,
      {
        id: Date.now().toString(),
        ...newClass,
        color: COLORS[colorIndex],
      },
    ])

    setNewClass({
      name: "",
      instructor: "",
      location: "",
      day: "",
      startTime: "",
      endTime: "",
    })
  }

  const handleDeleteClass = (id: string) => {
    setClasses(classes.filter((c) => c.id !== id))
    setAssignments(assignments.filter((a) => a.classId !== id))
    setStudySessions(studySessions.filter((s) => s.classId !== id))
  }

  return (
    <Tabs defaultValue="calendar" className="w-full">
      <TabsList className="grid grid-cols-4 mb-6">
        <TabsTrigger value="calendar" className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Calendar</span>
        </TabsTrigger>
        <TabsTrigger value="assignments" className="flex items-center gap-2">
          <BookOpen className="h-4 w-4" />
          <span>Assignments</span>
        </TabsTrigger>
        <TabsTrigger value="study" className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Study Time</span>
        </TabsTrigger>
        <TabsTrigger value="stats" className="flex items-center gap-2">
          <BarChart className="h-4 w-4" />
          <span>Statistics</span>
        </TabsTrigger>
      </TabsList>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>My Classes</CardTitle>
            <CardDescription>
              You have {classes.length} class{classes.length !== 1 ? "es" : ""} scheduled this week
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {classes.map((cls) => (
                <div key={cls.id} className={`p-4 rounded-lg ${cls.color} flex justify-between items-center`}>
                  <div>
                    <h3 className="font-medium">{cls.name}</h3>
                    <p className="text-sm text-gray-700">
                      {cls.day} • {cls.startTime} - {cls.endTime} • {cls.location}
                    </p>
                    {cls.instructor && <p className="text-sm text-gray-700">Instructor: {cls.instructor}</p>}
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClass(cls.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}

              {classes.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  No classes added yet. Add your first class using the form.
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Add New Class</CardTitle>
            <CardDescription>Fill in the details to add a new class to your schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Class Name</Label>
                <Input
                  id="name"
                  value={newClass.name}
                  onChange={(e) => setNewClass({ ...newClass, name: e.target.value })}
                  placeholder="e.g. Mathematics 101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor (Optional)</Label>
                <Input
                  id="instructor"
                  value={newClass.instructor}
                  onChange={(e) => setNewClass({ ...newClass, instructor: e.target.value })}
                  placeholder="e.g. Prof. Smith"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={newClass.location}
                  onChange={(e) => setNewClass({ ...newClass, location: e.target.value })}
                  placeholder="e.g. Room 101"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="day">Day</Label>
                <Select value={newClass.day} onValueChange={(value) => setNewClass({ ...newClass, day: value })}>
                  <SelectTrigger id="day">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startTime">Start Time</Label>
                  <Input
                    id="startTime"
                    type="time"
                    value={newClass.startTime}
                    onChange={(e) => setNewClass({ ...newClass, startTime: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="endTime">End Time</Label>
                  <Input
                    id="endTime"
                    type="time"
                    value={newClass.endTime}
                    onChange={(e) => setNewClass({ ...newClass, endTime: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleAddClass} className="w-full">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Class
            </Button>
          </CardFooter>
        </Card>
      </div>

      <TabsContent value="calendar" className="mt-0">
        <WeeklyCalendar classes={classes} />
      </TabsContent>

      <TabsContent value="assignments" className="mt-0">
        <AssignmentTracker classes={classes} assignments={assignments} setAssignments={setAssignments} />
      </TabsContent>

      <TabsContent value="study" className="mt-0">
        <StudyTimeAllocator classes={classes} studySessions={studySessions} setStudySessions={setStudySessions} />
      </TabsContent>

      <TabsContent value="stats" className="mt-0">
        <Statistics classes={classes} assignments={assignments} studySessions={studySessions} />
      </TabsContent>
    </Tabs>
  )
}
