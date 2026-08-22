import { FilePlus, UserPlus } from 'lucide-react';

export function OverviewHeader() {
  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Overview
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          A quick look at your business.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
        >
          <UserPlus className="size-4" />
          Add Client
        </button>

        <button
          type="button"
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-hover"
        >
          <FilePlus className="size-4" />
          New Invoice
        </button>
      </div>
    </div>
  );
}
