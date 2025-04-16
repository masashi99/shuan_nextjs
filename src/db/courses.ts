import { relations } from "drizzle-orm";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { subjects } from "./subjects";

export const courses = pgTable("courses", {
	id: uuid("id").primaryKey(),
	subjectId: uuid("subject_id")
		.references(() => subjects.id, { onDelete: "cascade" })
		.notNull(),
	courseName: varchar("course_name", { length: 10 }).notNull(),
	classHours: integer("class_hours").notNull(),
	progress: integer("progress").notNull(),
	tag: varchar("tag", { length: 20 }).notNull(),
});

export const coursesRelations = relations(courses, ({ one }) => ({
	subject: one(subjects, {
		fields: [courses.subjectId],
		references: [subjects.id],
	}),
}));
