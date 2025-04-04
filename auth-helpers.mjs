import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const projectId = 'genkit-idx';
const filesToDownload = [
	'auth/handler',
	'auth/handler.js',
	'auth/experiments.js',
	'auth/iframe',
	'auth/iframe.js',
	'firebase/init.json',
];
const baseUrl = `https://${projectId}.firebaseapp.com/__`;
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outputBaseDir = path.join(__dirname, 'downloads');

/**
 * Ensures a directory exists, creating it recursively if necessary.
 * @param {string} dirPath - The path to the directory.
 */
async function ensureDirectoryExists(dirPath) {
	try {
		await fs.mkdir(dirPath, { recursive: true });
	} catch (error) {
		if (error.code !== 'EEXIST') {
			throw error;
		}
	}
}

/**
 * Downloads a file from a given URL and saves it to a local path.
 * @param {string} fileUrl - The URL to download from.
 * @param {string} localPath - The local path to save the file to.
 */
async function downloadFile(fileUrl, localPath) {
	console.log(`Attempting to download: ${fileUrl}`);
	try {
		const response = await fetch(fileUrl);

		if (!response.ok) {
			throw new Error(`HTTP error! Status: ${response.status} ${response.statusText} for ${fileUrl}`);
		}

		// Get response body as an ArrayBuffer, then convert to Node.js Buffer
		const arrayBuffer = await response.arrayBuffer();
		const fileBuffer = Buffer.from(arrayBuffer);

		// Ensure the specific subdirectory for the file exists
		const dirName = path.dirname(localPath);
		await ensureDirectoryExists(dirName);

		// Write the file
		await fs.writeFile(localPath, fileBuffer);
		console.log(`  -> Successfully saved to: ${localPath}`);

	} catch (error) {
		console.error(`  -> FAILED to download ${fileUrl}: ${error.message}`);
		// Re-throw the error to make Promise.all fail if any download fails
		throw error;
	}
}

/**
 * Main function to orchestrate the downloads.
 */
async function downloadAllFiles() {
	console.log(`Starting downloads for project: ${projectId}`);
	console.log(`Saving files to: ${outputBaseDir}`);

	// Ensure the base output directory exists
	try {
		await ensureDirectoryExists(outputBaseDir);
	} catch (error) {
		console.error(`Fatal: Could not create base output directory ${outputBaseDir}: ${error.message}`);
		process.exit(1); // Exit if the base directory cannot be created
	}


	const downloadPromises = filesToDownload.map(relativePath => {
		const fileUrl = `${baseUrl}/${relativePath}`;
		// Construct local path mirroring the remote structure within outputBaseDir
		const localPath = path.join(outputBaseDir, relativePath);
		return downloadFile(fileUrl, localPath);
	});

	try {
		// Wait for all download promises to resolve
		await Promise.all(downloadPromises);
		console.log('\n✅ All specified files downloaded successfully!');
	} catch (error) {
		// Error is already logged in downloadFile
		console.error('\n❌ One or more downloads failed. Please check the log above.');
		// Optionally exit with an error code if any download fails
		// process.exit(1);
	}
}

// --- Execute the script ---
downloadAllFiles();
