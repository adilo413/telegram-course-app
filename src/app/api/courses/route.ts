import { NextResponse } from 'next/server';
import { getCourses, createCourse, Course } from '@/lib/storage';

// GET /api/courses - Get all courses
export async function GET() {
  try {
    const courses = getCourses();
    return NextResponse.json(courses);
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
    const { title, content, images, authorId, authorName } = data;

    if (!title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const newCourse = createCourse({
      title,
      content,
      images: images || [],
      authorId,
      authorName,
    });

    return NextResponse.json(newCourse, { status: 201 });
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: 'Failed to create course' },
      { status: 500 }
    );
  }
}
