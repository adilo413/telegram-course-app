'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCourses, Course, isChannelMember } from '@/lib/storage';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import ProtectedContent from '@/components/ProtectedContent';
import toast from 'react-hot-toast';

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, hapticFeedback } = useTelegramWebApp();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    try {
      const allCourses = getCourses();
      // Only show active courses
      const activeCourses = allCourses.filter(course => course.isActive);
      setCourses(activeCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCourseClick = (course: Course) => {
    if (!user) {
      toast.error('User not authenticated');
      return;
    }

    // Check if user is a channel member
    const isMember = isChannelMember(user.id.toString());
    if (!isMember) {
      toast.error('You must be a channel member to access courses');
      hapticFeedback('notification', 'error');
      return;
    }

    hapticFeedback('impact', 'light');
    // Navigate to course
    window.location.href = `/courses/${course.id}?token=${course.token}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Courses</h1>
              <p className="mt-1 text-sm text-gray-500">
                Access your courses securely through Telegram
              </p>
            </div>
            {user && (
              <div className="text-sm text-gray-500">
                Welcome, {user.first_name || 'Student'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No courses available</h3>
            <p className="mt-1 text-sm text-gray-500">
              There are no active courses at the moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => handleCourseClick(course)}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-500 rounded-md flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <h3 className="text-lg font-medium text-gray-900 truncate">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Created {new Date(course.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* Course Preview */}
                  <div className="mt-4">
                    <div 
                      className="text-sm text-gray-600 line-clamp-3"
                      dangerouslySetInnerHTML={{ 
                        __html: course.content.replace(/<[^>]*>/g, '').substring(0, 150) + '...' 
                      }}
                    />
                  </div>

                  {/* Course Stats */}
                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <span>
                      {course.images.length} image{course.images.length !== 1 ? 's' : ''}
                    </span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="bg-gray-50 px-6 py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-900">View Course</span>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Channel Membership Notice */}
        {user && !isChannelMember(user.id.toString()) && (
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3 flex-1">
                <h3 className="text-sm font-medium text-yellow-800">
                  Channel Membership Required
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <p className="mb-3">
                    You need to be a member of the private channel to access courses.
                  </p>
                  {process.env.NEXT_PUBLIC_CHANNEL_INVITE_LINK && (
                    <a
                      href={process.env.NEXT_PUBLIC_CHANNEL_INVITE_LINK}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-3 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors text-sm"
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                      </svg>
                      Join Channel
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
