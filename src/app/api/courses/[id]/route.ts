import { NextResponse } from 'next/server';
import { getCourseById, updateCourse, deleteCourse, toggleCourseStatus } from '@/lib/storage';

interface RouteParams {
  params: {
    id: string;
  };
}

// GET /api/courses/[id] - Get a specific course
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const course = getCourseById(params.id);
    
    if (!course) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
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
    const { title, content, images, isActive } = data;

    const updatedCourse = updateCourse(params.id, {
      title,
      content,
      images,
      isActive,
    });

    if (!updatedCourse) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(updatedCourse);
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
    const success = deleteCourse(params.id);
    
    if (!success) {
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
    const success = toggleCourseStatus(params.id);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Course not found' },
        { status: 404 }
      );
    }

    const course = getCourseById(params.id);
    return NextResponse.json(course);
  } catch (error) {
    console.error('Error toggling course status:', error);
    return NextResponse.json(
      { error: 'Failed to toggle course status' },
      { status: 500 }
    );
  }
}
