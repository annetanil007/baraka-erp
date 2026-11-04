"use client";

import { Command } from "lucide-react";

export default function CommandTrigger() {
  return (
    <button
      className="command-button"
      type="button"
      onClick={() => window.dispatchEvent(new KeyboardEvent("keydown", { key: "k", metaKey: true }))}
    >
      <Command size={14} />
      <span>Search anything</span>
      <kbd>⌘ K</kbd>
    </button>
  );
}
