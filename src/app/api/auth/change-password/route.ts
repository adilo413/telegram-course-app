import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyJwt, hashPassword, comparePassword } from '@/lib/auth';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromRequest(req);
    const payload = verifyJwt(token);
    if (!payload) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { currentPassword, newPassword } = body || {};
    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const { data: admin, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', payload.sub)
      .single();
    if (error || !admin) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });

    const ok = await comparePassword(currentPassword, admin.password_hash);
    if (!ok) return NextResponse.json({ error: 'Invalid current password' }, { status: 401 });

    const newHash = await hashPassword(newPassword);
    const { error: upErr } = await supabase
      .from('admin_users')
      .update({ password_hash: newHash })
      .eq('id', admin.id);
    if (upErr) throw upErr;

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Change password error', err);
    return NextResponse.json({ error: 'Change password failed' }, { status: 500 });
  }
}


