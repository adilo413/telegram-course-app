'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { getCourseByToken, isChannelMember } from '@/lib/storage';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import ProtectedContent from '@/components/ProtectedContent';
import { Course } from '@/lib/storage';
import toast from 'react-hot-toast';

interface CourseViewProps {
  params: {
    id: string;
  };
}

export default function CourseView({ params }: CourseViewProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [accessDenied, setAccessDenied] = useState(false);
  const [accessReason, setAccessReason] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, hapticFeedback, setupBackButton } = useTelegramWebApp();

  useEffect(() => {
    loadCourse();
  }, [params.id, searchParams]);

  useEffect(() => {
    if (course) {
      setupBackButton(() => router.push('/courses'));
    }
  }, [course, setupBackButton, router]);

  const loadCourse = () => {
    try {
      const token = searchParams.get('token');
      
      if (!token) {
        setAccessDenied(true);
        setAccessReason('Invalid or missing access token');
        setIsLoading(false);
        return;
      }

      if (!user) {
        setAccessDenied(true);
        setAccessReason('User not authenticated');
        setIsLoading(false);
        return;
      }

      // Check if user is a channel member
      const isMember = isChannelMember(user.id.toString());
      if (!isMember) {
        setAccessDenied(true);
        setAccessReason('You must be a channel member to access this course');
        setInviteLink(process.env.NEXT_PUBLIC_CHANNEL_INVITE_LINK || '');
        setIsLoading(false);
        return;
      }

      // Get course by token
      const foundCourse = getCourseByToken(token);
      if (!foundCourse) {
        setAccessDenied(true);
        setAccessReason('Course not found or inactive');
        setIsLoading(false);
        return;
      }

      // Verify course ID matches
      if (foundCourse.id !== params.id) {
        setAccessDenied(true);
        setAccessReason('Invalid course access');
        setIsLoading(false);
        return;
      }

      setCourse(foundCourse);
      hapticFeedback('notification', 'success');
    } catch (error) {
      console.error('Error loading course:', error);
      setAccessDenied(true);
      setAccessReason('Failed to load course');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course...</p>
        </div>
      </div>
    );
  }

  if (accessDenied) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6 text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600 mb-4">{accessReason}</p>
          
          {inviteLink && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-sm text-blue-800 mb-3">
                Join our private channel to access courses:
              </p>
              <a
                href={inviteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                </svg>
                Join Channel
              </a>
            </div>
          )}
          
          <div className="space-y-3">
            <button
              onClick={() => router.push('/courses')}
              className="w-full btn-primary"
            >
              Back to Courses
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full btn-secondary"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
          <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/courses')}
            className="btn-primary"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-900">{course.title}</h1>
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Created {new Date(course.createdAt).toLocaleDateString()}
              {course.authorName && (
                <>
                  <span className="mx-2">•</span>
                  <span>By {course.authorName}</span>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
        <ProtectedContent
          userId={user?.id}
          watermarkText={user?.username || user?.first_name || 'Student'}
          className="bg-white shadow rounded-lg"
        >
          <div className="px-6 py-8">
            <div 
              className="prose prose-lg max-w-none"
              dangerouslySetInnerHTML={{ __html: course.content }}
            />
          </div>
        </ProtectedContent>

        {/* Course Images */}
        {course.images.length > 0 && (
          <div className="mt-6 bg-white shadow rounded-lg">
            <div className="px-6 py-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Course Images</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {course.images.map((image, index) => (
                  <div key={index} className="relative">
                    <img
                      src={image}
                      alt={`Course image ${index + 1}`}
                      className="w-full h-auto rounded-lg shadow-sm"
                      style={{ 
                        userSelect: 'none',
                        WebkitUserSelect: 'none',
                        pointerEvents: 'none'
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Security Notice */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Protected Content
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>
                  This content is protected. Copying, pasting, and right-clicking are disabled. 
                  Your access is logged and watermarked.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
