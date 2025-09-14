import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/courses - Get all courses
export async function GET() {
  try {
    const { data, error } = await supabase
      .from('courses')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    const mapped = (data || []).map((c: any) => ({
      id: c.id,
      title: c.title,
      content: c.content,
      images: c.images || [],
      isActive: c.status === 'active',
      token: c.token,
      subject: c.subject,
      createdAt: c.created_at,
      updatedAt: c.updated_at,
      authorId: c.author_id,
      authorName: c.author_name,
    }));
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    );
  }
}

// POST /api/courses - Create a new course
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const { title, content, images = [], authorId, authorName, subject = 'English' } = data;

    if (!title || !content || !subject) {
      return NextResponse.json(
        { error: 'Title, content and subject are required' },
        { status: 400 }
      );
    }

    const token = Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
    const insert = {
      title,
      content,
      images,
      subject,
      status: 'active',
      token,
      author_id: authorId || null,
      author_name: authorName || null,
    };
    const { data: inserted, error } = await supabase
      .from('courses')
      .insert(insert)
      .select('*')
      .single();
    if (error) throw error;

    const mapped = {
      id: inserted.id,
      title: inserted.title,
      content: inserted.content,
      images: inserted.images || [],
      isActive: inserted.status === 'active',
      token: inserted.token,
      subject: inserted.subject,
      createdAt: inserted.created_at,
      updatedAt: inserted.updated_at,
      authorId: inserted.author_id,
      authorName: inserted.author_name,
    };

    return NextResponse.json(mapped, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
