/**
 * Utility functions for integrating with the Math SDK.
 *
 * The Math SDK (https://github.com/bryansmobiledetailing-star/math-sdk) generates
 * JSONL book files containing game events. These utilities help import that data
 * into the web SDK for storybook testing and development.
 */

import type { BaseBookEvent } from './types';

/**
 * Represents a book from the Math SDK.
 */
export interface MathSdkBook<TBookEvent extends BaseBookEvent = BaseBookEvent> {
	id: number;
	payoutMultiplier: number;
	events: TBookEvent[];
	criteria: string;
	baseGameWins?: number;
	freeGameWins?: number;
}

/**
 * Parses a single line of JSONL data into a book object.
 * @param line - A single JSON string representing a book
 * @returns The parsed book object
 */
export function parseJsonlLine<TBookEvent extends BaseBookEvent>(
	line: string,
): MathSdkBook<TBookEvent> {
	const trimmed = line.trim();
	if (!trimmed) {
		throw new Error('Empty line provided');
	}
	return JSON.parse(trimmed) as MathSdkBook<TBookEvent>;
}

/**
 * Parses JSONL content (multiple books) into an array of book objects.
 * JSONL format has one JSON object per line.
 *
 * @param content - The JSONL file content
 * @returns Array of parsed book objects
 */
export function parseJsonlContent<TBookEvent extends BaseBookEvent>(
	content: string,
): MathSdkBook<TBookEvent>[] {
	const lines = content.split('\n').filter((line) => line.trim());
	return lines.map((line) => parseJsonlLine<TBookEvent>(line));
}

/**
 * Extracts all events of a specific type from a book.
 * @param book - The book to extract events from
 * @param eventType - The type of event to extract
 * @returns Array of events matching the specified type
 */
export function extractEventsByType<TBookEvent extends BaseBookEvent>(
	book: MathSdkBook<TBookEvent>,
	eventType: string,
): TBookEvent[] {
	return book.events.filter((event) => event.type === eventType);
}

/**
 * Extracts unique event types from a book.
 * @param book - The book to analyze
 * @returns Array of unique event type strings
 */
export function getEventTypes<TBookEvent extends BaseBookEvent>(
	book: MathSdkBook<TBookEvent>,
): string[] {
	const types = new Set<string>();
	book.events.forEach((event) => types.add(event.type));
	return Array.from(types);
}

/**
 * Groups books by their criteria field.
 * @param books - Array of books to group
 * @returns Object with criteria as keys and arrays of books as values
 */
export function groupBooksByCriteria<TBookEvent extends BaseBookEvent>(
	books: MathSdkBook<TBookEvent>[],
): Record<string, MathSdkBook<TBookEvent>[]> {
	const grouped: Record<string, MathSdkBook<TBookEvent>[]> = {};
	books.forEach((book) => {
		const criteria = book.criteria;
		if (!grouped[criteria]) {
			grouped[criteria] = [];
		}
		grouped[criteria].push(book);
	});
	return grouped;
}

/**
 * Converts a book to a TypeScript export string for use in storybook data files.
 * @param book - The book to convert
 * @param variableName - Optional variable name for the export
 * @returns TypeScript code string
 */
export function bookToTypeScript<TBookEvent extends BaseBookEvent>(
	book: MathSdkBook<TBookEvent>,
	variableName?: string,
): string {
	const name = variableName || `book_${book.id}`;
	return `export const ${name} = ${JSON.stringify(book, null, '\t')} as const;`;
}

/**
 * Converts an array of books to a TypeScript export string.
 * @param books - Array of books to convert
 * @param variableName - Variable name for the default export
 * @returns TypeScript code string with default export
 */
export function booksToTypeScript<TBookEvent extends BaseBookEvent>(
	books: MathSdkBook<TBookEvent>[],
	variableName: string = 'books',
): string {
	const booksJson = JSON.stringify(books, null, '\t');
	return `const ${variableName} = ${booksJson} as const;\n\nexport default ${variableName};`;
}

/**
 * Creates a map of event types to sample events from a single book.
 * Useful for creating events.ts files for storybook.
 *
 * Note: Only the first occurrence of each event type is kept. This is typically
 * sufficient for storybook testing as it provides a representative sample of
 * each event type's structure. For more diverse samples, use createEventsMapFromBooks.
 *
 * @param book - The book to extract events from
 * @returns Object with event types as keys and sample events as values
 */
export function createEventsMap<TBookEvent extends BaseBookEvent>(
	book: MathSdkBook<TBookEvent>,
): Record<string, TBookEvent> {
	const eventsMap: Record<string, TBookEvent> = {};
	book.events.forEach((event) => {
		// Only keep the first occurrence of each event type
		if (!eventsMap[event.type]) {
			eventsMap[event.type] = event;
		}
	});
	return eventsMap;
}

/**
 * Creates a map of event types to sample events from multiple books.
 * This provides a more comprehensive events map by looking across all books.
 *
 * @param books - Array of books to extract events from
 * @returns Object with event types as keys and sample events as values
 */
export function createEventsMapFromBooks<TBookEvent extends BaseBookEvent>(
	books: MathSdkBook<TBookEvent>[],
): Record<string, TBookEvent> {
	const eventsMap: Record<string, TBookEvent> = {};
	books.forEach((book) => {
		book.events.forEach((event) => {
			// Only keep the first occurrence of each event type
			if (!eventsMap[event.type]) {
				eventsMap[event.type] = event;
			}
		});
	});
	return eventsMap;
}

/**
 * Converts an events map to TypeScript export string.
 * @param eventsMap - Map of event type to event object
 * @returns TypeScript code string with default export
 */
export function eventsMapToTypeScript<TBookEvent extends BaseBookEvent>(
	eventsMap: Record<string, TBookEvent>,
): string {
	const eventsJson = JSON.stringify(eventsMap, null, '\t');
	return `export default ${eventsJson};`;
}
