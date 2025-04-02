import { TextProcessor } from './TextProcessor';

export interface ExtractedEntity {
  type: string;
  value: string;
  confidence: number;
}

export interface EntityPattern {
  type: string;
  pattern: RegExp;
  postProcess?: (match: string) => string;
}

export class EntityExtractor {
  private textProcessor: TextProcessor;
  private patterns: EntityPattern[];

  constructor() {
    this.textProcessor = new TextProcessor();
    this.patterns = [
      // Date patterns
      {
        type: 'date',
        pattern: /\b(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})\b/g,
        postProcess: (match) => this.standardizeDate(match)
      },
      {
        type: 'date',
        pattern: /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]* \d{1,2},? \d{4}\b/g
      },
      
      // Email patterns
      {
        type: 'email',
        pattern: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g
      },
      
      // Phone number patterns
      {
        type: 'phone',
        pattern: /\b(\+\d{1,3}[\s\-]?)?\(?\d{3}\)?[\s\-]?\d{3}[\s\-]?\d{4}\b/g,
        postProcess: (match) => this.standardizePhone(match)
      },
      
      // Currency/amount patterns
      {
        type: 'currency',
        pattern: /\$\s?\d+([.,]\d+)?(\s?[kmb]illion)?|\d+([.,]\d+)?\s?(USD|EUR|GBP)/gi
      },
      
      // Person name patterns (simplified)
      {
        type: 'person',
        pattern: /\b([A-Z][a-z]+\s[A-Z][a-z]+)\b/g
      },
      
      // Organization patterns (simplified)
      {
        type: 'organization',
        pattern: /\b([A-Z][a-z]*\s)?(Inc|LLC|Ltd|GmbH|Corp|Corporation|Company)\b/g
      }
    ];
  }

  /**
   * Find all entities in the given text
   */
  extractEntities(text: string): ExtractedEntity[] {
    if (!text) return [];
    
    const normalizedText = this.textProcessor.normalizeText(text);
    const entities: ExtractedEntity[] = [];
    
    // Apply each pattern to extract entities
    for (const { type, pattern, postProcess } of this.patterns) {
      const matches = normalizedText.matchAll(new RegExp(pattern, 'g'));
      
      for (const match of matches) {
        const value = postProcess ? postProcess(match[0]) : match[0];
        
        // Add to results if not a duplicate
        const isDuplicate = entities.some(
          entity => entity.type === type && entity.value === value
        );
        
        if (!isDuplicate) {
          entities.push({
            type,
            value,
            confidence: this.calculateConfidence(type, value)
          });
        }
      }
    }
    
    return entities;
  }

  /**
   * Extract entities from text and group them by type
   */
  extractEntitiesByType(text: string): Record<string, ExtractedEntity[]> {
    const entities = this.extractEntities(text);
    const groupedEntities: Record<string, ExtractedEntity[]> = {};
    
    for (const entity of entities) {
      if (!groupedEntities[entity.type]) {
        groupedEntities[entity.type] = [];
      }
      groupedEntities[entity.type].push(entity);
    }
    
    return groupedEntities;
  }

  /**
   * Extract specific type of entity from text
   */
  extractEntitiesByTypeFilter(text: string, type: string): ExtractedEntity[] {
    return this.extractEntities(text).filter(entity => entity.type === type);
  }

  /**
   * Add a custom entity pattern
   */
  addEntityPattern(pattern: EntityPattern): void {
    this.patterns.push(pattern);
  }

  /**
   * Calculate confidence score for the extracted entity
   * This is a simple implementation - real systems would use more sophisticated methods
   */
  private calculateConfidence(type: string, value: string): number {
    // Start with a base confidence
    let confidence = 0.8;
    
    // Adjust confidence based on entity type and value
    switch (type) {
      case 'date':
        // Check if the date seems valid
        confidence = this.isValidDate(value) ? 0.95 : 0.7;
        break;
        
      case 'email':
        // Higher confidence for emails (easier to validate)
        confidence = 0.98;
        break;
        
      case 'phone':
        // Check phone number length for basic validation
        confidence = value.replace(/\D/g, '').length >= 10 ? 0.95 : 0.75;
        break;
        
      case 'person':
        // Lower confidence for names (more false positives)
        confidence = 0.75;
        break;
    }
    
    return confidence;
  }

  /**
   * Standardize date format to YYYY-MM-DD
   */
  private standardizeDate(dateStr: string): string {
    try {
      const parts = dateStr.split(/[\/\-\.]/);
      if (parts.length !== 3) return dateStr;
      
      let day, month, year;
      
      // Handle common date formats
      if (parts[2].length === 4) {
        // MM/DD/YYYY or DD/MM/YYYY format
        if (parts[0].length <= 2 && parseInt(parts[0]) <= 12) {
          [month, day, year] = parts;
        } else {
          [day, month, year] = parts;
        }
      } else {
        // MM/DD/YY or DD/MM/YY format
        if (parts[0].length <= 2 && parseInt(parts[0]) <= 12) {
          [month, day, year] = parts;
        } else {
          [day, month, year] = parts;
        }
        
        // Convert 2-digit year to 4-digit
        const currentYear = new Date().getFullYear();
        const century = Math.floor(currentYear / 100) * 100;
        const twoDigitYear = parseInt(year);
        year = twoDigitYear > (currentYear % 100) + 20 
          ? `${century - 100 + twoDigitYear}` 
          : `${century + twoDigitYear}`;
      }
      
      // Pad month and day with leading zeros if needed
      month = month.padStart(2, '0');
      day = day.padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    } catch (error) {
      // If parsing fails, return the original string
      return dateStr;
    }
  }

  /**
   * Standardize phone number format to +1 (123) 456-7890
   */
  private standardizePhone(phoneStr: string): string {
    try {
      // Extract only digits
      const digits = phoneStr.replace(/\D/g, '');
      
      // Format the phone number
      if (digits.length === 10) {
        return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      } else if (digits.length === 11 && digits[0] === '1') {
        return `+1 (${digits.slice(1, 4)}) ${digits.slice(4, 7)}-${digits.slice(7)}`;
      } else {
        return phoneStr; // Return original if cannot standardize
      }
    } catch (error) {
      return phoneStr;
    }
  }

  /**
   * Basic date validation
   */
  private isValidDate(dateStr: string): boolean {
    const date = new Date(dateStr);
    return !isNaN(date.getTime());
  }
} 