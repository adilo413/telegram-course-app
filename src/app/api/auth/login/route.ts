import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { comparePassword, hashPassword, signJwt, getTokenCookieName } from '@/lib/auth';

const PLACEHOLDER_PREFIX = 'placeholder.hash';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { password } = body || {};
    if (!password) {
      return NextResponse.json({ error: 'Password is required' }, { status: 400 });
    }

    // Ensure an admin row exists
    const { data: admins, error } = await supabase
      .from('admin_users')
      .select('*')
      .eq('username', 'admin')
      .limit(1);
    if (error) throw error;

    let admin = admins && admins[0];
    if (!admin) {
      const initialHash = await hashPassword(process.env.ADMIN_PASSWORD || 'admin123secure');
      const { data: inserted, error: insertErr } = await supabase
        .from('admin_users')
        .insert({ username: 'admin', password_hash: initialHash, is_active: true })
        .select('*')
        .single();
      if (insertErr) throw insertErr;
      admin = inserted;
    }

    const envPassword = process.env.ADMIN_PASSWORD || '';
    const storedHash: string = admin.password_hash || '';

    let isValid = false;
    if (storedHash.startsWith(PLACEHOLDER_PREFIX)) {
      // Accept env password on first real login and set hash
      if (envPassword && password === envPassword) {
        isValid = true;
        const newHash = await hashPassword(password);
        await supabase
          .from('admin_users')
          .update({ password_hash: newHash })
          .eq('id', admin.id);
      }
    } else if (!storedHash && envPassword) {
      // No hash yet, initialize from env
      if (password === envPassword) {
        isValid = true;
        const newHash = await hashPassword(password);
        await supabase
          .from('admin_users')
          .update({ password_hash: newHash })
          .eq('id', admin.id);
      }
    } else {
      isValid = await comparePassword(password, storedHash);
    }

    if (!isValid) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
    }

    const token = signJwt({ sub: admin.id, username: admin.username }, '30d');
    const res = NextResponse.json({ success: true });
    res.cookies.set(getTokenCookieName(), token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 30,
    });
    return res;
  } catch (err) {
    console.error('Login error', err);
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}


