import { prisma } from '@/lib/prisma';
import { Document, User } from '@prisma/client';

export class DocumentService {
  async createDocument(data: {
    title: string;
    content: string;
    createdById: string;
  }) {
    return prisma.document.create({
      data: {
        title: data.title,
        content: data.content,
        userId: data.createdById
      }
    });
  }

  async getDocument(id: string) {
    const document = await prisma.document.findUnique({
      where: { id }
    });

    if (!document) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: document.userId }
    });

    return {
      ...document,
      createdBy: user
    };
  }

  async updateDocument(id: string, data: {
    title?: string;
    content?: string;
    createdById: string;
  }) {
    return prisma.document.update({
      where: { id },
      data: {
        title: data.title,
        content: data.content,
        userId: data.createdById
      }
    });
  }

  async deleteDocument(id: string) {
    return prisma.document.delete({
      where: { id }
    });
  }

  async listDocuments(userId: string) {
    const documents = await prisma.document.findMany({
      where: {
        userId
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: documents.map(doc => doc.userId)
        }
      }
    });

    return documents.map(doc => ({
      ...doc,
      createdBy: users.find(user => user.id === doc.userId)
    }));
  }

  async searchDocuments(userId: string, query: string) {
    const documents = await prisma.document.findMany({
      where: {
        userId,
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { content: { contains: query, mode: 'insensitive' } }
        ]
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: documents.map(doc => doc.userId)
        }
      }
    });

    return documents.map(doc => ({
      ...doc,
      createdBy: users.find(user => user.id === doc.userId)
    }));
  }

  async createFolder(data: {
    name: string;
    description?: string | null;
    parentId?: string | null;
    createdById: string;
  }): Promise<Folder> {
    return prisma.folder.create({
      data: {
        ...data,
        createdBy: { connect: { id: data.createdById } }
      }
    });
  }

  async getFolderContents(folderId: string | null) {
    const documents = await prisma.document.findMany({
      where: { folderId },
      include: {
        createdBy: true
      }
    });

    const folders = await prisma.folder.findMany({
      where: { parentId: folderId },
      include: {
        createdBy: true
      }
    });

    return { documents, folders };
  }
} 
} 