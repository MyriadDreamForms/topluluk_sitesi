import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
  pure: true
})
export class TruncatePipe implements PipeTransform {
  /**
   * Truncates text to specified length with ellipsis
   * @param value - The text to truncate
   * @param limit - Maximum character length (default: 100)
   * @param completeWords - If true, truncate at word boundary (default: true)
   * @param ellipsis - The ellipsis string to append (default: '...')
   * @returns Truncated string
   */
  transform(
    value: string | null | undefined,
    limit: number = 100,
    completeWords: boolean = true,
    ellipsis: string = '...'
  ): string {
    if (!value) {
      return '';
    }
    
    // Remove extra whitespace
    const text = value.trim().replace(/\s+/g, ' ');
    
    if (text.length <= limit) {
      return text;
    }
    
    if (!completeWords) {
      return text.substring(0, limit).trim() + ellipsis;
    }
    
    // Find the last space before the limit
    let truncated = text.substring(0, limit);
    const lastSpaceIndex = truncated.lastIndexOf(' ');
    
    if (lastSpaceIndex > 0) {
      truncated = truncated.substring(0, lastSpaceIndex);
    }
    
    // Remove trailing punctuation
    truncated = truncated.replace(/[.,;:!?]+$/, '').trim();
    
    return truncated + ellipsis;
  }
}

@Pipe({
  name: 'truncateWords',
  standalone: true,
  pure: true
})
export class TruncateWordsPipe implements PipeTransform {
  /**
   * Truncates text to specified number of words
   * @param value - The text to truncate
   * @param wordLimit - Maximum number of words (default: 20)
   * @param ellipsis - The ellipsis string to append (default: '...')
   * @returns Truncated string
   */
  transform(
    value: string | null | undefined,
    wordLimit: number = 20,
    ellipsis: string = '...'
  ): string {
    if (!value) {
      return '';
    }
    
    const words = value.trim().split(/\s+/);
    
    if (words.length <= wordLimit) {
      return value.trim();
    }
    
    const truncated = words.slice(0, wordLimit).join(' ');
    
    // Remove trailing punctuation
    const cleaned = truncated.replace(/[.,;:!?]+$/, '').trim();
    
    return cleaned + ellipsis;
  }
}

@Pipe({
  name: 'truncateMiddle',
  standalone: true,
  pure: true
})
export class TruncateMiddlePipe implements PipeTransform {
  /**
   * Truncates text in the middle (useful for file paths, URLs, etc.)
   * @param value - The text to truncate
   * @param startChars - Number of characters to keep at start (default: 20)
   * @param endChars - Number of characters to keep at end (default: 20)
   * @param ellipsis - The ellipsis string to insert (default: '...')
   * @returns Truncated string
   */
  transform(
    value: string | null | undefined,
    startChars: number = 20,
    endChars: number = 20,
    ellipsis: string = '...'
  ): string {
    if (!value) {
      return '';
    }
    
    const totalChars = startChars + endChars + ellipsis.length;
    
    if (value.length <= totalChars) {
      return value;
    }
    
    const start = value.substring(0, startChars);
    const end = value.substring(value.length - endChars);
    
    return start + ellipsis + end;
  }
}
