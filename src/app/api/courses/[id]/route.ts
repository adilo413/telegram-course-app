import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/courses/[id] - Get a specific course
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { data: c, error } = await supabase
      .from('courses')
      .select('*')
      .eq('id', params.id)
      .single();
    if (error || !c) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const mapped = {
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
    };
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error fetching course:', error);
    return NextResponse.json(
      { error: 'Failed to fetch course' },
      { status: 500 }
    );
  }
}

// PUT /api/courses/[id] - Update a course
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const data = await request.json();
    const { title, content, images, isActive, subject } = data;

    const updates: any = {
      title,
      content,
      images,
      subject,
      status: isActive === undefined ? undefined : (isActive ? 'active' : 'inactive'),
    };

    const { data: updated, error } = await supabase
      .from('courses')
      .update(updates)
      .eq('id', params.id)
      .select('*')
      .single();

    if (error || !updated) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const mapped = {
      id: updated.id,
      title: updated.title,
      content: updated.content,
      images: updated.images || [],
      isActive: updated.status === 'active',
      token: updated.token,
      subject: updated.subject,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
      authorId: updated.author_id,
      authorName: updated.author_name,
    };
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error updating course:', error);
    return NextResponse.json(
      { error: 'Failed to update course' },
      { status: 500 }
    );
  }
}

// DELETE /api/courses/[id] - Delete a course
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { error } = await supabase
      .from('courses')
      .delete()
      .eq('id', params.id);
    if (error) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Error deleting course:', error);
    return NextResponse.json(
      { error: 'Failed to delete course' },
      { status: 500 }
    );
  }
}

// PATCH /api/courses/[id] - Toggle course status
export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { data: c, error } = await supabase
      .from('courses')
      .select('status')
      .eq('id', params.id)
      .single();
    if (error || !c) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }
    const newStatus = c.status === 'active' ? 'inactive' : 'active';
    const { data: updated } = await supabase
      .from('courses')
      .update({ status: newStatus })
      .eq('id', params.id)
      .select('*')
      .single();
    const mapped = updated ? {
      id: updated.id,
      title: updated.title,
      content: updated.content,
      images: updated.images || [],
      isActive: updated.status === 'active',
      token: updated.token,
      subject: updated.subject,
      createdAt: updated.created_at,
      updatedAt: updated.updated_at,
      authorId: updated.author_id,
      authorName: updated.author_name,
    } : null;
    return NextResponse.json(mapped);
  } catch (error) {
    console.error('Error toggling course status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle course status' },
      { status: 500 }
    );
  }
}
