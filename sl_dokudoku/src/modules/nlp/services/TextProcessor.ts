export class TextProcessor {
  /**
   * Normalizes text by converting to lowercase, removing extra spaces, and handling special characters
   */
  normalizeText(text: string): string {
    if (!text) return '';
    
    return text
      .replace(/\s+/g, ' ')        // Replace multiple spaces with a single space
      .replace(/\n+/g, ' ')        // Replace newlines with spaces
      .trim();                      // Remove leading/trailing whitespace
  }

  /**
   * Extracts plain text content from HTML
   */
  extractTextFromHtml(html: string): string {
    if (!html) return '';
    
    // Basic HTML tag removal
    return html
      .replace(/<style[\s\S]*?<\/style>/g, '')   // Remove style tags and content
      .replace(/<script[\s\S]*?<\/script>/g, '') // Remove script tags and content
      .replace(/<[^>]*>/g, ' ')                  // Remove HTML tags
      .replace(/&nbsp;/g, ' ')                   // Replace non-breaking spaces
      .replace(/&[a-z]+;/g, ' ')                 // Replace other HTML entities
      .replace(/\s+/g, ' ')                      // Replace multiple spaces with a single space
      .trim();                                    // Remove leading/trailing whitespace
  }

  /**
   * Breaks text into sentences
   */
  splitIntoSentences(text: string): string[] {
    if (!text) return [];
    
    // Split on sentence-ending punctuation followed by space or end of string
    return text
      .split(/(?<=[.!?])\s+|(?<=[.!?])$/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 0);
  }

  /**
   * Breaks text into paragraphs
   */
  splitIntoParagraphs(text: string): string[] {
    if (!text) return [];
    
    // Split on double newlines which typically indicate paragraphs
    return text
      .split(/\n\s*\n/)
      .map(paragraph => paragraph.trim())
      .filter(paragraph => paragraph.length > 0);
  }

  /**
   * Removes stop words from text 
   */
  removeStopWords(text: string, stopWords: string[] = []): string {
    if (!text) return '';
    if (stopWords.length === 0) {
      // Default English stop words
      stopWords = [
        'a', 'an', 'the', 'and', 'but', 'or', 'for', 'nor', 'on', 'at', 'to', 
        'by', 'in', 'of', 'is', 'are', 'was', 'were', 'be', 'been', 'being'
      ];
    }
    
    const words = text.split(/\s+/);
    const filteredWords = words.filter(word => 
      !stopWords.includes(word.toLowerCase())
    );
    
    return filteredWords.join(' ');
  }

  /**
   * Finds keywords in text based on frequency and importance
   */
  extractKeywords(text: string, maxKeywords: number = 10): string[] {
    if (!text) return [];
    
    const normalizedText = this.normalizeText(text);
    const words = normalizedText.split(/\s+/);
    
    // Remove common stop words
    const filteredWords = this.removeStopWords(normalizedText).split(/\s+/);
    
    // Count frequency
    const wordFrequency: Record<string, number> = {};
    for (const word of filteredWords) {
      if (word.length > 2) { // Only consider words with 3+ characters
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    }
    
    // Sort by frequency
    const sortedWords = Object.entries(wordFrequency)
      .sort((a, b) => b[1] - a[1])
      .map(entry => entry[0]);
    
    return sortedWords.slice(0, maxKeywords);
  }
} 