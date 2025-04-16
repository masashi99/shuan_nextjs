import { relations } from "drizzle-orm";
import { integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core";

import { courses } from "./courses";

export const subjects = pgTable("subjects", {
	id: uuid("id").primaryKey(),
	subjectName: varchar("subject_name", { length: 10 }).notNull(),
	classHours: integer("class_hours").notNull(),
	progress: integer("progress").notNull(),
	tag: varchar("tag", { length: 20 }).notNull(),
});
export const subjectsRelations = relations(subjects, ({ many }) => ({
	courses: many(courses),
}));
