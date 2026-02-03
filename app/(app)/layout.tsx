import { AppShell } from '@/components/layout/AppShell';
import { ErrorBoundary } from '@/components/error-boundary';

export const dynamic = "force-dynamic";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      <AppShell>{children}</AppShell>
    </ErrorBoundary>
  );
}
