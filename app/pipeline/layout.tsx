import { ProtectedLayout } from '@/components/layout/ProtectedLayout';

export default function PipelineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
