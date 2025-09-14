import { NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// POST /api/upload - Handle image uploads
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File size must be less than 5MB' },
        { status: 400 }
      );
    }

    // In a real implementation, you would:
    // 1. Upload the file to a cloud storage service (AWS S3, Cloudinary, etc.)
    // 2. Return the public URL of the uploaded image
    
    // For now, we'll return a placeholder URL
    const imageUrl = `https://via.placeholder.com/800x600/4F46E5/FFFFFF?text=${encodeURIComponent(file.name)}`;
    
    return NextResponse.json({
      success: true,
      url: imageUrl,
      filename: file.name,
      size: file.size,
      type: file.type,
    });

  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

// GET /api/upload - Get upload configuration
export async function GET() {
  return NextResponse.json({
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    maxFiles: 10,
  });
}
