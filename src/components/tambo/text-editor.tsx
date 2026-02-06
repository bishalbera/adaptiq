"use client";

import { cn } from "@/lib/utils";
import * as React from "react";

export type ResourceItem = {
  id: string;
  name: string;
};

export type PromptItem = {
  id: string;
  name: string;
};

export type TamboEditor = {
  focus: (position?: "start" | "end") => void;
  setContent: (nextValue: string) => void;
  insertMention: (id: string, label: string) => void;
  getTextWithResourceURIs: () => {
    text: string;
    resourceNames: Record<string, string>;
  };
};

export function getImageItems(clipboardData: DataTransfer): {
  imageItems: File[];
  hasText: boolean;
} {
  const imageItems: File[] = [];
  let hasText = false;

  for (const item of Array.from(clipboardData.items)) {
    if (item.kind === "string") {
      hasText = true;
      continue;
    }
    if (item.type.startsWith("image/")) {
      const file = item.getAsFile();
      if (file) {
        imageItems.push(file);
      }
    }
  }

  return { imageItems, hasText };
}

type TriggerType = "resource" | "prompt";
type TriggerState =
  | {
      type: TriggerType;
      query: string;
      startIndex: number;
    }
  | { type: null };

const getTriggerState = (
  value: string,
  caretIndex: number,
): TriggerState => {
  const beforeCaret = value.slice(0, caretIndex);
  const lastAt = beforeCaret.lastIndexOf("@");
  const lastSlash = beforeCaret.lastIndexOf("/");

  const lastTriggerIndex = Math.max(lastAt, lastSlash);
  if (lastTriggerIndex < 0) {
    return { type: null };
  }

  const trigger = beforeCaret[lastTriggerIndex];
  const previousChar = beforeCaret[lastTriggerIndex - 1];
  const isBoundary =
    lastTriggerIndex === 0 || previousChar === undefined || /\s/.test(previousChar);
  if (!isBoundary) {
    return { type: null };
  }

  const query = beforeCaret.slice(lastTriggerIndex + 1);
  if (query.includes(" ") || query.includes("\n") || query.includes("\t")) {
    return { type: null };
  }

  if (trigger === "@") {
    return {
      type: "resource",
      query,
      startIndex: lastTriggerIndex,
    };
  }

  if (trigger === "/") {
    return {
      type: "prompt",
      query,
      startIndex: lastTriggerIndex,
    };
  }

  return { type: null };
};

export type TextEditorProps = {
  value: string;
  onChange: (nextValue: string) => void;
  onSubmit: (e: React.FormEvent) => void | Promise<void>;
  onAddImage: (file: File) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  onResourceNamesChange: (resourceNames: Record<string, string>) => void;

  resources: ResourceItem[];
  onSearchResources: (query: string) => void;
  onResourceSelect: (item: ResourceItem) => void;

  prompts: PromptItem[];
  onSearchPrompts: (query: string) => void;
  onPromptSelect: (item: PromptItem) => void;
};

export const TextEditor = React.forwardRef<TamboEditor, TextEditorProps>(
  (
    {
      value,
      onChange,
      onSubmit,
      onAddImage,
      placeholder,
      disabled,
      className,
      onResourceNamesChange,
      resources,
      onSearchResources,
      onResourceSelect,
      prompts,
      onSearchPrompts,
      onPromptSelect,
    },
    ref,
  ) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    const resourceNamesRef = React.useRef<Record<string, string>>({});

    const [triggerState, setTriggerState] = React.useState<TriggerState>({
      type: null,
    });

    const syncTriggerState = React.useCallback(() => {
      const el = textareaRef.current;
      if (!el) return;
      const caretIndex = el.selectionStart ?? value.length;
      const nextState = getTriggerState(value, caretIndex);
      setTriggerState(nextState);

      if (nextState.type === "resource") {
        onSearchResources(nextState.query);
      } else if (nextState.type === "prompt") {
        onSearchPrompts(nextState.query);
      } else {
        onSearchResources("");
        onSearchPrompts("");
      }
    }, [onSearchPrompts, onSearchResources, value]);

    React.useEffect(() => {
      syncTriggerState();
    }, [syncTriggerState]);

    React.useImperativeHandle(
      ref,
      () => ({
        focus: (position) => {
          const el = textareaRef.current;
          if (!el) return;
          el.focus();
          if (position === "end") {
            const end = el.value.length;
            el.setSelectionRange(end, end);
          }
          if (position === "start") {
            el.setSelectionRange(0, 0);
          }
        },
        setContent: (nextValue: string) => {
          resourceNamesRef.current = {};
          onResourceNamesChange({});
          onChange(nextValue);
        },
        insertMention: (id: string, label: string) => {
          const el = textareaRef.current;
          const mentionText = `@${label} `;
          if (el) {
            const start = el.selectionStart ?? value.length;
            const end = el.selectionEnd ?? value.length;
            onChange(value.slice(0, start) + mentionText + value.slice(end));
            requestAnimationFrame(() => {
              const nextEl = textareaRef.current;
              if (!nextEl) return;
              const nextCaret = start + mentionText.length;
              nextEl.focus();
              nextEl.setSelectionRange(nextCaret, nextCaret);
            });
          } else {
            onChange(value ? `${value} ${mentionText}` : mentionText);
          }

          resourceNamesRef.current = {
            ...resourceNamesRef.current,
            [id]: label,
          };
          onResourceNamesChange(resourceNamesRef.current);
        },
        getTextWithResourceURIs: () => ({
          text: value,
          resourceNames: resourceNamesRef.current,
        }),
      }),
      [onChange, onResourceNamesChange, value],
    );

    const insertAtCursor = React.useCallback(
      (replacement: string) => {
        const el = textareaRef.current;
        if (!el) return;

        const start = el.selectionStart ?? value.length;
        const end = el.selectionEnd ?? value.length;
        const nextValue = value.slice(0, start) + replacement + value.slice(end);
        const nextCaret = start + replacement.length;
        onChange(nextValue);

        requestAnimationFrame(() => {
          const nextEl = textareaRef.current;
          if (!nextEl) return;
          nextEl.focus();
          nextEl.setSelectionRange(nextCaret, nextCaret);
        });
      },
      [onChange, value],
    );

    const handleSelectResource = React.useCallback(
      (item: ResourceItem) => {
        if (triggerState.type !== "resource") {
          insertAtCursor(`@${item.name} `);
        } else {
          const nextValue =
            value.slice(0, triggerState.startIndex) + `@${item.name} `;
          onChange(nextValue);
          requestAnimationFrame(() => {
            textareaRef.current?.focus();
          });
        }

        resourceNamesRef.current = {
          ...resourceNamesRef.current,
          [item.id]: item.name,
        };
        onResourceNamesChange(resourceNamesRef.current);
        onResourceSelect(item);
        setTriggerState({ type: null });
        onSearchResources("");
      },
      [
        insertAtCursor,
        onChange,
        onResourceNamesChange,
        onResourceSelect,
        onSearchResources,
        triggerState,
        value,
      ],
    );

    const handleSelectPrompt = React.useCallback(
      (item: PromptItem) => {
        if (triggerState.type === "prompt") {
          onChange(value.slice(0, triggerState.startIndex));
        }
        onPromptSelect(item);
        setTriggerState({ type: null });
        onSearchPrompts("");
        requestAnimationFrame(() => {
          textareaRef.current?.focus();
        });
      },
      [onChange, onPromptSelect, onSearchPrompts, triggerState, value],
    );

    const handleKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        await onSubmit(e as unknown as React.FormEvent);
        return;
      }

      if (e.key === "Escape") {
        setTriggerState({ type: null });
        return;
      }
    };

    const handlePaste = async (e: React.ClipboardEvent<HTMLTextAreaElement>) => {
      const { imageItems, hasText } = getImageItems(e.clipboardData);
      if (imageItems.length === 0) {
        return;
      }

      if (!hasText) {
        e.preventDefault();
      }

      for (const file of imageItems) {
        await onAddImage(file);
      }
    };

    const showResources =
      triggerState.type === "resource" && resources.length > 0;
    const showPrompts = triggerState.type === "prompt" && prompts.length > 0;

    return (
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          onClick={syncTriggerState}
          onKeyUp={syncTriggerState}
          className={cn(
            "w-full p-3 rounded-t-lg bg-background text-foreground resize-none text-sm min-h-[82px] max-h-[40vh] focus:outline-none placeholder:text-muted-foreground/50",
            className,
          )}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Chat Message Input"
        />

        {(showResources || showPrompts) && (
          <div className="absolute left-0 right-0 bottom-full mb-2 rounded-lg border border-border bg-background shadow-lg overflow-hidden z-30">
            {showResources && (
              <ul className="max-h-56 overflow-auto">
                {resources.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectResource(item)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none"
                    >
                      @{item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {showPrompts && (
              <ul className="max-h-56 overflow-auto">
                {prompts.slice(0, 8).map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleSelectPrompt(item)}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-muted focus:bg-muted focus:outline-none"
                    >
                      /{item.name}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    );
  },
);
TextEditor.displayName = "TextEditor";
