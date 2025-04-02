import { TextProcessor } from './TextProcessor';
import { EntityExtractor, ExtractedEntity } from './EntityExtractor';
import { MetricsCollector } from '../../monitoring/services/MetricsCollector';

export interface DocumentAnalysisResult {
  entities: ExtractedEntity[];
  entitiesByType: Record<string, ExtractedEntity[]>;
  keyPhrases: string[];
  language?: string;
  confidence: number;
  processingTimeMs: number;
}

export class DocumentAnalyzer {
  private textProcessor: TextProcessor;
  private entityExtractor: EntityExtractor;
  private metricsCollector?: MetricsCollector;

  constructor(metricsCollector?: MetricsCollector) {
    this.textProcessor = new TextProcessor();
    this.entityExtractor = new EntityExtractor();
    this.metricsCollector = metricsCollector;
  }

  /**
   * Analyze a document to extract entities and key phrases
   */
  async analyzeDocument(text: string, documentId?: string): Promise<DocumentAnalysisResult> {
    const startTime = Date.now();
    
    try {
      // Process the text
      const normalizedText = this.processText(text);
      
      // Extract entities
      const entities = this.entityExtractor.extractEntities(normalizedText);
      const entitiesByType = this.entityExtractor.extractEntitiesByType(normalizedText);
      
      // Extract key phrases/keywords
      const keyPhrases = this.textProcessor.extractKeywords(normalizedText, 15);
      
      // Calculate overall confidence
      const confidence = this.calculateOverallConfidence(entities);
      
      // Calculate processing time
      const processingTimeMs = Date.now() - startTime;
      
      // Record metrics if collector is provided
      if (this.metricsCollector) {
        this.metricsCollector.record('document_processing_duration', processingTimeMs, {
          documentId: documentId || 'unknown'
        });
        
        this.metricsCollector.record('entity_extraction_count', entities.length, {
          documentId: documentId || 'unknown'
        });
      }
      
      return {
        entities,
        entitiesByType,
        keyPhrases,
        confidence,
        processingTimeMs
      };
    } catch (error) {
      console.error('Error analyzing document:', error);
      
      // Record error metric if collector is provided
      if (this.metricsCollector) {
        this.metricsCollector.record('processing_errors', 1, {
          documentId: documentId || 'unknown',
          errorType: error instanceof Error ? error.name : 'unknown'
        });
      }
      
      // Return empty results
      return {
        entities: [],
        entitiesByType: {},
        keyPhrases: [],
        confidence: 0,
        processingTimeMs: Date.now() - startTime
      };
    }
  }

  /**
   * Process text to prepare for entity extraction and analysis
   */
  private processText(text: string): string {
    // If text appears to be HTML, extract plain text first
    const isHtml = /<\/?[a-z][\s\S]*>/i.test(text);
    
    let processedText = text;
    if (isHtml) {
      processedText = this.textProcessor.extractTextFromHtml(text);
    }
    
    // Normalize the text
    return this.textProcessor.normalizeText(processedText);
  }

  /**
   * Calculate overall confidence score for the document analysis
   */
  private calculateOverallConfidence(entities: ExtractedEntity[]): number {
    if (entities.length === 0) return 0;
    
    // Average of entity confidences
    const totalConfidence = entities.reduce((sum, entity) => sum + entity.confidence, 0);
    return totalConfidence / entities.length;
  }

  /**
   * Add a custom entity pattern to the entity extractor
   */
  addEntityPattern(type: string, pattern: RegExp, postProcess?: (match: string) => string): void {
    this.entityExtractor.addEntityPattern({ type, pattern, postProcess });
  }
} 