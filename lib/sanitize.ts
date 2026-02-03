/**
 * Input Sanitization Utilities
 * 
 * Protects against XSS attacks by sanitizing user inputs before
 * storing in database or rendering in the UI.
 */

import DOMPurify from 'dompurify';

/**
 * Sanitizes text input by removing all HTML tags and scripts
 * @param input - Raw user input
 * @returns Sanitized text safe for storage and rendering
 */
export function sanitizeText(input: string): string {
  if (!input) return '';
  
  // Remove all HTML tags - only allow plain text
  return DOMPurify.sanitize(input, { 
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  }).trim();
}

/**
 * Sanitizes rich text input (allows safe HTML formatting)
 * Use only when you need to preserve formatting like bold, italic, lists
 * @param input - Raw HTML input
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeRichText(input: string): string {
  if (!input) return '';
  
  // Allow only safe formatting tags
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    ALLOWED_ATTR: []
  });
}

/**
 * Sanitizes phone number - keeps only digits
 * @param phone - Phone number input
 * @returns Only numeric characters
 */
export function sanitizePhone(phone: string): string {
  if (!phone) return '';
  return phone.replace(/\D/g, '');
}

/**
 * Sanitizes email - basic validation
 * @param email - Email input
 * @returns Lowercase trimmed email
 */
export function sanitizeEmail(email: string): string {
  if (!email) return '';
  return email.toLowerCase().trim();
}

/**
 * Sanitizes CSV data before import
 * @param data - CSV row data
 * @returns Sanitized object with all text fields cleaned
 */
export function sanitizeCsvRow<T extends Record<string, string>>(data: T): T {
  const sanitized = {} as T;
  
  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = sanitizeText(data[key]) as T[Extract<keyof T, string>];
    } else {
      sanitized[key] = data[key];
    }
  }
  
  return sanitized;
}

/**
 * Validates and sanitizes URL
 * @param url - URL input
 * @returns Sanitized URL or empty string if invalid
 */
export function sanitizeUrl(url: string): string {
  if (!url) return '';
  
  try {
    const parsed = new URL(url);
    // Only allow http and https protocols
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return '';
    }
    return DOMPurify.sanitize(parsed.toString());
  } catch {
    return '';
  }
}
