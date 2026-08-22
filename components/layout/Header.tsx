import { MobileNavigation } from './MobileNavigation';
import { UserMenu } from './UserMenu';

interface HeaderProps {
  title: string;
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <MobileNavigation />

        <h1 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h1>
      </div>

      <UserMenu name="Vansh Dadhich" email="dadhichvansh46@gmail.com" />
    </header>
  );
}
