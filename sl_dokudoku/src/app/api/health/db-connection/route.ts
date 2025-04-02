import { query } from '@/lib/db';
import { dbMonitor } from '@/lib/db-monitoring';

export async function GET() {
  try {
    // Simple query to verify database connection
    await query('SELECT 1');
    
    // Get connection stats
    const stats = await dbMonitor.getConnectionStats();
    
    return Response.json({ 
      connected: true,
      stats
    });
  } catch (error) {
    console.error('Database connection error:', error);
    return Response.json(
      { 
        connected: false,
        error: 'Database connection failed'
      },
      { status: 500 }
    );
  }
} 