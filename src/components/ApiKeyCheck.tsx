"use client";

import { useEffect, useState } from "react";

interface ApiKeyCheckProps {
  children?: React.ReactNode;
}

const ApiKeyMissingAlert = () => (
  <div className="mb-4 p-6 bg-neon-warning/10 border border-neon-warning/20 rounded-lg text-neon-warning">
    <p className="mb-3">To get started, you need to initialize Tambo:</p>
    <div className="flex items-center gap-2 glass p-3 rounded mb-3">
      <code className="text-sm flex-grow">npx tambo init</code>
      <CopyButton text="npx tambo init" />
    </div>
    <p className="text-sm">
      Or visit{" "}
      <a
        href="https://tambo.co/cli-auth"
        target="_blank"
        rel="noopener noreferrer"
        className="underline hover:text-neon-warning/80"
      >
        tambo.co/cli-auth
      </a>{" "}
      to get your API key and set it in{" "}
      <code className="bg-neon-warning/15 px-2 py-1 rounded">.env.local</code>
    </p>
  </div>
);

const CopyButton = ({ text }: { text: string }) => {
  const [showCopied, setShowCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  return (
    <button
      onClick={copyToClipboard}
      className="p-2 text-muted-foreground hover:text-foreground glass rounded transition-colors relative group"
      title="Copy to clipboard"
    >
      {showCopied ? (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ) : (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span className="absolute -top-8 left-1/2 transform -translate-x-1/2 glass-strong text-foreground px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity">
        {showCopied ? "Copied!" : "Copy"}
      </span>
    </button>
  );
};

export function ApiKeyCheck({ children }: ApiKeyCheckProps) {
  const isApiKeyMissing = !process.env.NEXT_PUBLIC_TAMBO_API_KEY;
  const isDev = process.env.NODE_ENV === "development";

  const initializedContent =
    children ??
    (isDev ? (
      <p className="mt-2 text-sm text-muted-foreground">
        Tambo is initialized. Render your app content as children of
        <code className="glass px-1 py-0.5 rounded ml-1">ApiKeyCheck</code>
        .
      </p>
    ) : null);

  useEffect(() => {
    if (!isApiKeyMissing && children === undefined && isDev) {
      console.warn(
        "ApiKeyCheck mounted without children while Tambo is initialized.",
      );
    }
  }, [children, isApiKeyMissing]);

  return (
    <div className="flex items-start gap-4">
      <div className="flex-grow">
        <div className="flex items-center gap-1">
          <div className="min-w-6">{isApiKeyMissing ? "❌" : "✅"}</div>
          <p>
            {isApiKeyMissing ? "Tambo not initialized" : "Tambo initialized"}
          </p>
        </div>
        {isApiKeyMissing && <ApiKeyMissingAlert />}
        {!isApiKeyMissing && initializedContent}
      </div>
    </div>
  );
}
