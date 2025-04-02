import { DatabaseService } from "@/modules/database/service"
import { LoggerService } from "@/modules/monitoring/LoggerService"
import { MetricsCollector } from "@/modules/monitoring/MetricsCollector"
import { Document } from "@/modules/database/types"

export class DocumentProcessor {
  constructor(
    private databaseService: DatabaseService,
    private metricsCollector: MetricsCollector,
    private logger: LoggerService
  ) {}

  async processDocument(document: Document): Promise<Document> {
    try {
      this.logger.info(`Processing document: ${document.filename}`)
      this.metricsCollector.increment('documents_processed')

      // Update document status
      const updatedDocument = {
        ...document,
        status: 'processing' as const
      }

      // Save to database
      await this.databaseService.updateDocument(updatedDocument)

      this.logger.info(`Document processed successfully: ${document.filename}`)
      return updatedDocument
    } catch (error) {
      this.logger.error(`Error processing document: ${document.filename}`, error)
      this.metricsCollector.increment('document_processing_errors')
      throw error
    }
  }
}