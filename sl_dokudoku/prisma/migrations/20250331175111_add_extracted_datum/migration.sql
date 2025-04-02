-- CreateTable
CREATE TABLE "ExtractedDatum" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "label" TEXT,
    "value" TEXT NOT NULL,
    "context" TEXT,
    "confidence" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExtractedDatum_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ExtractedDatum_documentId_idx" ON "ExtractedDatum"("documentId");

-- CreateIndex
CREATE INDEX "ExtractedDatum_category_idx" ON "ExtractedDatum"("category");

-- AddForeignKey
ALTER TABLE "ExtractedDatum" ADD CONSTRAINT "ExtractedDatum_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE CASCADE ON UPDATE CASCADE;
