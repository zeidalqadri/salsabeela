import { notFound } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { DocumentContent } from '@/components/DocumentContent';

interface DocumentPageProps {
  params: {
    id: string;
  };
}

export default async function DocumentPage({ params }: DocumentPageProps) {
  const session = await getServerSession();
  if (!session?.user?.email) {
    return notFound();
  }

  const document = await prisma.document.findUnique({
    where: { id: params.id },
    select: {
      id: true,
      name: true,
      content: true,
      userId: true,
    },
  });

  if (!document) {
    return notFound();
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user || document.userId !== user.id) {
    return notFound();
  }

  return (
    <div className="container py-8">
      <DocumentContent
        id={document.id}
        title={document.name}
        content={document.content || ''}
      />
    </div>
  );
}
