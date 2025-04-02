import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics | DokuDoku',
  description: 'Document repository analytics and monitoring',
};

export default function AnalyticsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {children}
    </div>
  );
} 