import { NextResponse } from 'next/server';
import { getDatabase } from '@/lib/db';
import { DashboardController } from '@/lib/api/controllers/DashboardController';

export async function GET() {
  try {
    const db = await getDatabase();
    const stats = await DashboardController.getQuickStats(db);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch stats' }, 
      { status: 500 }
    );
  }
} 