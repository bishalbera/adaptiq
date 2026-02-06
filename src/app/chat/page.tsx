"use client";

import { MessageThreadFull } from "@/components/tambo/message-thread-full";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { ApiKeyCheck } from "@/components/ApiKeyCheck";
import { components, tools } from "@/lib/tambo";
import { TamboProvider } from "@tambo-ai/react";

export default function ChatPage() {
  // NOTE: `NEXT_PUBLIC_*` env vars are inlined at build time (changing them requires a rebuild).
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  return (
    <div className="relative h-screen">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-50 flex justify-end p-4">
        <div className="pointer-events-auto">
          <ThemeToggle />
        </div>
      </div>

      {!apiKey ? (
        <div className="flex h-full items-center justify-center p-4">
          <ApiKeyCheck />
        </div>
      ) : (
        <TamboProvider
          apiKey={apiKey}
          components={components}
          tools={tools}
          tamboUrl={process.env.NEXT_PUBLIC_TAMBO_URL}
          contextKey="adaptiq-main"
        >
          <MessageThreadFull />
        </TamboProvider>
      )}
    </div>
  );
}
