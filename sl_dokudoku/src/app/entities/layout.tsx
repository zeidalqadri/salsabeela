import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Entity Extraction | DokuDoku',
  description: 'Explore document entity extraction and analysis capabilities',
};

export default function EntitiesLayout({
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