import { Hono } from "hono";
import { handle } from "hono/vercel";

import { authMiddleware, handleAuthMiddleware } from "./middlewares";

export const runtime = "edge";

const app = new Hono().basePath("/api");

app.use("*", authMiddleware, handleAuthMiddleware);

const routes = app.get("/hello", (c) => {
  return c.text("hello");
});

export const GET = handle(app);
export const POST = handle(app);

export type AppType = typeof routes;
