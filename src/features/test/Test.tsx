"use client";

import { use } from "react"

export function Test({data}: any) {
  const message = use(data);
  return <p>{message}</p>
}