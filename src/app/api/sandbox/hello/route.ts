
import { NextRequest, NextResponse } from 'next/server';
// hello

export async function POST(req: NextRequest) {
    return NextResponse.json({ message: 'Hello' });
}