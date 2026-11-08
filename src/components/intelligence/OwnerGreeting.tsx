"use client";

import { useSyncExternalStore } from "react";

function getGreeting(hour: number) {
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export default function OwnerGreeting({ name, role }: { name: string; role: string }) {
  const greeting = useSyncExternalStore(
    () => () => undefined,
    () => getGreeting(new Date().getHours()),
    () => "Welcome"
  );

  return <h2 className="page-title">{greeting}, {name} <span className="owner-role">· {role}</span></h2>;
}
