"use client";

import { useEffect, type ReactNode } from "react";
import type { AppId, Bounds, WindowPayload } from "@/lib/os/types";
import { useOs } from "./WindowManager";

export function RegisterWindow({
  id,
  appId,
  title,
  payload,
  bounds,
  maximized,
  children,
}: {
  id: string;
  appId: AppId;
  title: string;
  payload: WindowPayload;
  bounds?: Bounds;
  maximized?: boolean;
  children?: ReactNode;
}) {
  const { upsert, setBody } = useOs();

  useEffect(() => {
    upsert({ id, appId, title, payload, bounds, maximized });
  }, [id, appId, title, payload, bounds, maximized, upsert]);

  useEffect(() => {
    if (children) setBody(id, children);
  }, [id, children, setBody]);

  if (!children) return null;
  return <div className="os-ssr-article">{children}</div>;
}
