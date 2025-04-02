/*
  Warnings:

  - You are about to drop the `_DocumentToTag` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `color` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_DocumentToTag" DROP CONSTRAINT "_DocumentToTag_A_fkey";

-- DropForeignKey
ALTER TABLE "_DocumentToTag" DROP CONSTRAINT "_DocumentToTag_B_fkey";

-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "color" TEXT NOT NULL;

-- DropTable
DROP TABLE "_DocumentToTag";

-- CreateTable
CREATE TABLE "DocumentTag" (
    "documentId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentTag_pkey" PRIMARY KEY ("documentId","tagId")
);

-- CreateIndex
CREATE INDEX "DocumentTag_documentId_idx" ON "DocumentTag"("documentId");

-- CreateIndex
CREATE INDEX "DocumentTag_tagId_idx" ON "DocumentTag"("tagId");

-- AddForeignKey
ALTER TABLE "DocumentTag" ADD CONSTRAINT "DocumentTag_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentTag" ADD CONSTRAINT "DocumentTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
