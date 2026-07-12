'use client';
import { useCompletion } from '@ai-sdk/react';
import { Loader2, ArrowUpRight } from 'lucide-react';

export default function SuggestMessages({
  onSelectQuestion,
}: {
  onSelectQuestion: (value: string) => void;
}) {
  const initialMessageString =
    "What's your favorite movie?||Do you have any pets?||What's your dream job?";

  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/suggest-messages',
    initialCompletion: initialMessageString
  });

  const questions = completion.split('||').filter((q) => q.trim().length > 0);

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={() => complete('')}
        disabled={isLoading}
        className="inline-flex items-center gap-2 rounded-full border border-[#D9A15B]/30 px-4 py-2 text-xs uppercase tracking-wider text-[#D9A15B] transition-colors hover:bg-[#D9A15B]/10 disabled:opacity-50"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Generating...
          </>
        ) : (
          'Suggest new messages'
        )}
      </button>

      <p className="text-xs text-[#8B92A6]">
        Click on any message below to select it.
      </p>

      <div>
        {error && (
          <p className="text-sm text-red-400">
            Failed to load suggestions. Try again.
          </p>
        )}

        {questions.length === 0 && !isLoading && !error && (
          <p className="text-sm text-[#8B92A6]">
            Click &quot;Suggest new messages&quot; to get started.
          </p>
        )}

        {questions.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelectQuestion(q.trim())}
            className="group flex w-full items-center justify-between border-b border-white/10 py-3 text-left text-sm text-[#EDE6DA]/80 transition-colors first:border-t hover:text-[#D9A15B]"
          >
            <span>{q.trim()}</span>
            <ArrowUpRight
              size={14}
              className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
            />
          </button>
        ))}
      </div>
    </div>
  );
}