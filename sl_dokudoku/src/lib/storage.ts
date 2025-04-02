import { Storage } from '@google-cloud/storage';
import { Readable } from 'stream';

// Initialize GCS client
// Assumes credentials are configured in the environment
const storage = new Storage(); 

const BUCKET_NAME = process.env.GCS_BUCKET_NAME || 'sl-dokudoku-bucket'; // Use env var or default
const bucket = storage.bucket(BUCKET_NAME);

/**
 * Uploads a file to Google Cloud Storage and returns its public URL.
 * 
 * @param file The File object to upload.
 * @returns The publicly accessible URL of the uploaded file.
 * @throws If the upload fails.
 */
export async function uploadToStorage(file: File): Promise<string> {
  if (!BUCKET_NAME) {
    throw new Error('GCS_BUCKET_NAME environment variable is not set.');
  }

  // Generate a unique filename to avoid collisions
  const uniqueId = Date.now() + '-' + Math.random().toString(36).substring(2);
  const filename = `${uniqueId}-${file.name.replace(/\s+/g, '_')}`; // Replace spaces

  console.log(`Uploading ${filename} to GCS bucket ${BUCKET_NAME}...`);

  const blob = bucket.file(filename);
  
  // Convert File to Buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  // Create a writable stream and upload the buffer
  const blobStream = blob.createWriteStream({
    resumable: false, // Use simple upload for potentially smaller files
    contentType: file.type,
    // Optional: Set predefined ACL for public read if bucket isn't public by default
    // predefinedAcl: 'publicRead', 
  });

  return new Promise((resolve, reject) => {
    blobStream.on('error', (err) => {
      console.error(`GCS Upload Error for ${filename}:`, err);
      reject(new Error(`Failed to upload file to GCS: ${err.message}`));
    });

    blobStream.on('finish', () => {
      // Construct the public URL
      // Assumes bucket objects are publicly readable
      const publicUrl = `https://storage.googleapis.com/${BUCKET_NAME}/${filename}`;
      console.log(`File ${filename} uploaded successfully to ${publicUrl}`);
      resolve(publicUrl);
    });

    // Pipe the buffer to the stream
    const bufferStream = new Readable();
    bufferStream.push(buffer);
    bufferStream.push(null); // Signal end of stream
    bufferStream.pipe(blobStream);
  });
}

/**
 * Optional: Function to delete a file from GCS.
 * 
 * @param filename The name of the file in the bucket to delete.
 * @throws If the deletion fails.
 */
export async function deleteFromStorage(filename: string): Promise<void> {
   if (!BUCKET_NAME) {
    throw new Error('GCS_BUCKET_NAME environment variable is not set.');
  }
  console.log(`Deleting ${filename} from GCS bucket ${BUCKET_NAME}...`);
  try {
    await bucket.file(filename).delete();
    console.log(`File ${filename} deleted successfully.`);
  } catch (error: any) {
     console.error(`Failed to delete ${filename} from GCS:`, error);
     // Don't throw if file not found (e.g., already deleted), but throw for other errors
     if (error.code !== 404) { 
       throw new Error(`Failed to delete file from GCS: ${error.message}`);
     }
  }
}
