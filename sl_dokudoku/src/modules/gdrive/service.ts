import { google } from 'googleapis';
import { Readable } from 'stream';
import { GOOGLE_CLOUD_CONFIG } from './config';

interface ServiceAccountCredentials {
  client_email: string;
  private_key: string | undefined;
}

export interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
  size?: number | null;
  modifiedTime?: string | null;
}

export class GoogleDriveService {
  private drive;

  constructor() {
    const auth = new google.auth.GoogleAuth({
      credentials: GOOGLE_CLOUD_CONFIG.credentials as ServiceAccountCredentials,
      scopes: GOOGLE_CLOUD_CONFIG.scopes,
      projectId: GOOGLE_CLOUD_CONFIG.projectId,
    });

    this.drive = google.drive({ version: 'v3', auth });
  }

  async listFiles(folderId?: string): Promise<DriveFile[]> {
    try {
      const response = await this.drive.files.list({
        q: folderId ? `'${folderId}' in parents and trashed = false` : 'trashed = false',
        fields: 'files(id, name, mimeType, size, modifiedTime)',
        spaces: 'drive',
        pageSize: 100,
      });

      return (response.data.files || []).map(file => ({
        id: file.id || '',
        name: file.name || '',
        mimeType: file.mimeType || '',
        size: file.size ? Number(file.size) : null,
        modifiedTime: file.modifiedTime || null,
      }));
    } catch (error) {
      console.error('Error listing files:', error);
      throw new Error('Failed to list files from Google Drive');
    }
  }

  async downloadFile(fileId: string): Promise<Readable> {
    try {
      const response = await this.drive.files.get(
        { fileId, alt: 'media' },
        { responseType: 'stream' }
      );
      return response.data;
    } catch (error) {
      console.error('Error downloading file:', error);
      throw new Error('Failed to download file from Google Drive');
    }
  }

  async getFileMetadata(fileId: string): Promise<DriveFile> {
    try {
      const response = await this.drive.files.get({
        fileId,
        fields: 'id, name, mimeType, size, modifiedTime',
      });
      return response.data as DriveFile;
    } catch (error) {
      console.error('Error getting file metadata:', error);
      throw new Error('Failed to get file metadata from Google Drive');
    }
  }
} 