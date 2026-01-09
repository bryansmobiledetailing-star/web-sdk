#!/usr/bin/env node
/**
 * Math SDK Book Converter
 *
 * This script converts JSONL book files from the Math SDK into TypeScript files
 * for use in the web SDK's storybook data directory.
 *
 * Usage:
 *   node scripts/convert-math-sdk-books.js <input.jsonl> <output-dir> [--mode base|bonus]
 *
 * Example:
 *   node scripts/convert-math-sdk-books.js ../math-sdk/games/0_0_lines/library/books/books_base.jsonl apps/lines/src/stories/data --mode base
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
import { join, basename } from 'path';

/**
 * Parse command line arguments
 */
function parseArgs() {
	const args = process.argv.slice(2);

	if (args.length < 2) {
		console.error(
			'Usage: convert-math-sdk-books.js <input.jsonl> <output-dir> [--mode base|bonus]',
		);
		console.error('');
		console.error('Arguments:');
		console.error('  input.jsonl   Path to the Math SDK JSONL book file');
		console.error('  output-dir    Directory to write the TypeScript files');
		console.error('  --mode        Optional: "base" or "bonus" (default: inferred from filename)');
		process.exit(1);
	}

	const inputFile = args[0];
	const outputDir = args[1];
	let mode = 'base';

	// Parse optional flags
	for (let i = 2; i < args.length; i++) {
		if (args[i] === '--mode' && args[i + 1]) {
			mode = args[i + 1];
			i++;
		}
	}

	// Try to infer mode from filename if not specified
	const filename = basename(inputFile).toLowerCase();
	if (
		filename.includes('bonus') ||
		filename.includes('freegame') ||
		filename.includes('free_spin')
	) {
		mode = 'bonus';
	}

	return { inputFile, outputDir, mode };
}

/**
 * Parse JSONL content into an array of book objects
 */
function parseJsonl(content) {
	const lines = content.split('\n').filter((line) => line.trim());
	return lines
		.map((line, index) => {
			try {
				return JSON.parse(line);
			} catch (e) {
				console.warn(`Warning: Failed to parse line ${index + 1}: ${e.message}`);
				return null;
			}
		})
		.filter(Boolean);
}

/**
 * Create events map from books.
 * Collects first occurrence of each event type to use as sample events in storybook.
 * The index property is removed since storybook events don't need sequential indices.
 */
function createEventsMap(books) {
	const eventsMap = {};
	for (const book of books) {
		for (const event of book.events) {
			if (!eventsMap[event.type]) {
				// Remove index as storybook events are tested individually, not in sequence
				const { index, ...eventWithoutIndex } = event;
				eventsMap[event.type] = eventWithoutIndex;
			}
		}
	}
	return eventsMap;
}

/**
 * Generate TypeScript books file content
 */
function generateBooksFile(books) {
	const formattedBooks = books.map((book) => {
		// Keep original structure but format nicely
		return book;
	});

	return `/**
 * Auto-generated from Math SDK book data.
 * See: https://github.com/bryansmobiledetailing-star/math-sdk
 */

const books = ${JSON.stringify(formattedBooks, null, '\t')};

export default books;
`;
}

/**
 * Generate TypeScript events file content
 */
function generateEventsFile(eventsMap) {
	return `/**
 * Auto-generated from Math SDK book data.
 * Sample events for storybook testing.
 * See: https://github.com/bryansmobiledetailing-star/math-sdk
 */

export default ${JSON.stringify(eventsMap, null, '\t')};
`;
}

/**
 * Main function
 */
function main() {
	const { inputFile, outputDir, mode } = parseArgs();

	// Validate input file exists
	if (!existsSync(inputFile)) {
		console.error(`Error: Input file not found: ${inputFile}`);
		process.exit(1);
	}

	// Create output directory if it doesn't exist
	if (!existsSync(outputDir)) {
		mkdirSync(outputDir, { recursive: true });
	}

	// Read and parse the input file
	console.log(`Reading: ${inputFile}`);
	const content = readFileSync(inputFile, 'utf-8');
	const books = parseJsonl(content);

	if (books.length === 0) {
		console.error('Error: No valid books found in input file');
		process.exit(1);
	}

	console.log(`Parsed ${books.length} books`);

	// Generate events map
	const eventsMap = createEventsMap(books);
	console.log(
		`Found ${Object.keys(eventsMap).length} unique event types: ${Object.keys(eventsMap).join(', ')}`,
	);

	// Generate output file names based on mode
	const booksFileName = `${mode}_books.ts`;
	const eventsFileName = `${mode}_events.ts`;

	// Write books file
	const booksPath = join(outputDir, booksFileName);
	const booksContent = generateBooksFile(books);
	writeFileSync(booksPath, booksContent, 'utf-8');
	console.log(`Written: ${booksPath}`);

	// Write events file
	const eventsPath = join(outputDir, eventsFileName);
	const eventsContent = generateEventsFile(eventsMap);
	writeFileSync(eventsPath, eventsContent, 'utf-8');
	console.log(`Written: ${eventsPath}`);

	console.log('');
	console.log('Conversion complete!');
	console.log('');
	console.log('Next steps:');
	console.log('1. Review the generated files for TypeScript type compatibility');
	console.log('2. Update typesBookEvent.ts if new event types were added');
	console.log('3. Update bookEventHandlerMap.ts to handle any new event types');
}

main();
