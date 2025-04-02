import { Credentials } from 'google-auth-library';

export const GOOGLE_CLOUD_CONFIG = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT_ID || 'sl-dokudoku',
  credentials: {
    client_email: process.env.GOOGLE_CLOUD_CLIENT_EMAIL || 'service@sl-dokudoku.iam.gserviceaccount.com',
    private_key: process.env.GOOGLE_CLOUD_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  } as Credentials,
  scopes: [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://www.googleapis.com/auth/drive.metadata.readonly'
  ]
}; 