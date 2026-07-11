'use client';
import { useCompletion } from '@ai-sdk/react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function SuggestMessages({
  onSelectQuestion,
}: {
  onSelectQuestion: (value: string) => void;
}) {
  const { completion, complete, isLoading, error } = useCompletion({
    api: '/api/suggest-messages',
  });

  const questions = completion.split('||').filter((q) => q.trim().length > 0);

  return (
    <div className="mt-8 space-y-4">
      <Button
        variant="outline"
        onClick={() => complete('')}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Generating...
          </>
        ) : (
          'Suggest New Messages'
        )}
      </Button>

      <p className="text-sm text-muted-foreground">
        Click on any message below to select it.
      </p>

      <div className="rounded-2xl border bg-background shadow-sm p-6 space-y-3">
        <h3 className="text-xl font-semibold">Messages</h3>

        {error && (
          <p className="text-sm text-red-500">
            Failed to load suggestions. Try again.
          </p>
        )}

        {questions.length === 0 && !isLoading && !error && (
          <p className="text-sm text-muted-foreground">
            Click &quot;Suggest New Messages&quot; to get started.
          </p>
        )}

        {questions.map((q, i) => (
          <button
            key={i}
            type="button"
            onClick={() => onSelectQuestion(q.trim())}
            className="w-full text-left rounded-lg border px-4 py-3 text-sm hover:bg-accent transition-colors"
          >
            {q.trim()}
          </button>
        ))}
      </div>
    </div>
  );
}