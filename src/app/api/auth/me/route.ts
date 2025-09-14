import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyJwt } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ authenticated: false }, { status: 401 });
    return NextResponse.json({ authenticated: true, user: { id: payload.sub, username: payload.username } });
  } catch (err) {
    console.error('Me error', err);
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}


