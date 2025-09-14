'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCourseById, updateCourse, toggleCourseStatus, deleteCourse } from '@/lib/storage';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import { Course } from '@/lib/storage';
import toast from 'react-hot-toast';
import Link from 'next/link';

interface CourseDetailProps {
  params: {
    id: string;
  };
}

export default function CourseDetail({ params }: CourseDetailProps) {
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const router = useRouter();
  const { user, hapticFeedback, showConfirm, setupMainButton } = useTelegramWebApp();

  useEffect(() => {
    loadCourse();
  }, [params.id]);

  useEffect(() => {
    if (course) {
      const mainButton = setupMainButton('Send to Channel', handleSendToChannel);
      return () => mainButton.hide();
    }
  }, [course, setupMainButton]);

  const loadCourse = () => {
    try {
      const foundCourse = getCourseById(params.id);
      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        toast.error('Course not found');
        router.push('/admin/courses');
      }
    } catch (error) {
      console.error('Error loading course:', error);
      toast.error('Failed to load course');
      router.push('/admin/courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!course) return;
    
    hapticFeedback('impact', 'medium');
    setIsUpdating(true);
    
    try {
      const success = toggleCourseStatus(course.id);
      if (success) {
        loadCourse();
        toast.success(`Course ${course.isActive ? 'deactivated' : 'activated'} successfully`);
      } else {
        toast.error('Failed to update course status');
      }
    } catch (error) {
      console.error('Error toggling course status:', error);
      toast.error('Failed to update course status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!course) return;
    
    hapticFeedback('impact', 'heavy');
    const confirmed = await showConfirm(
      `Are you sure you want to delete "${course.title}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      setIsUpdating(true);
      try {
        const success = deleteCourse(course.id);
        if (success) {
          toast.success('Course deleted successfully');
          router.push('/admin/courses');
        } else {
          toast.error('Failed to delete course');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      } finally {
        setIsUpdating(false);
      }
    }
  };

  const handleSendToChannel = async () => {
    if (!course) return;
    
    hapticFeedback('impact', 'medium');
    
    try {
      const response = await fetch('/api/bot/send-course', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          courseId: course.id,
          channelId: process.env.NEXT_PUBLIC_CHANNEL_ID,
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Course sent to channel successfully!');
        hapticFeedback('notification', 'success');
      } else {
        toast.error(result.error || 'Failed to send course to channel');
        hapticFeedback('notification', 'error');
      }
    } catch (error) {
      console.error('Error sending course to channel:', error);
      toast.error('Failed to send course to channel');
      hapticFeedback('notification', 'error');
    }
  };

  const copyCourseLink = () => {
    if (!course) return;
    
    const courseUrl = `${window.location.origin}/courses/${course.id}?token=${course.token}`;
    navigator.clipboard.writeText(courseUrl);
    toast.success('Course link copied to clipboard!');
    hapticFeedback('impact', 'light');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-12 w-12"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Course Not Found</h1>
        <p className="text-gray-600 mb-6">The course you're looking for doesn't exist.</p>
        <Link href="/admin/courses" className="btn-primary">
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            {course.title}
          </h2>
          <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
            <div className="mt-2 flex items-center text-sm text-gray-500">
              <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              Created {new Date(course.createdAt).toLocaleDateString()}
            </div>
            {course.updatedAt && (
              <div className="mt-2 flex items-center text-sm text-gray-500">
                <svg className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                </svg>
                Updated {new Date(course.updatedAt).toLocaleDateString()}
              </div>
            )}
          </div>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <Link
            href={`/admin/courses/${course.id}/edit`}
            className="btn-secondary"
          >
            Edit
          </Link>
          <button
            onClick={handleToggleStatus}
            disabled={isUpdating}
            className={`${
              course.isActive ? 'btn-danger' : 'btn-primary'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isUpdating ? (
              <div className="flex items-center">
                <div className="spinner h-4 w-4 mr-2"></div>
                Updating...
              </div>
            ) : (
              course.isActive ? 'Deactivate' : 'Activate'
            )}
          </button>
        </div>
      </div>

      {/* Status and Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                course.isActive 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {course.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="text-sm text-gray-500">
                Token: <code className="bg-gray-100 px-2 py-1 rounded text-xs">{course.token}</code>
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={copyCourseLink}
                className="text-sm px-3 py-1 bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
              >
                Copy Link
              </button>
              <button
                onClick={handleSendToChannel}
                className="text-sm px-3 py-1 bg-green-100 text-green-800 rounded hover:bg-green-200"
              >
                Send to Channel
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Course Content</h3>
          <div 
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: course.content }}
          />
        </div>
      </div>

      {/* Course Images */}
      {course.images.length > 0 && (
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Course Images</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {course.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Course image ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Danger Zone */}
      <div className="bg-white shadow rounded-lg border border-red-200">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
          <p className="text-sm text-red-700 mb-4">
            Once you delete a course, there is no going back. Please be certain.
          </p>
          <button
            onClick={handleDeleteCourse}
            disabled={isUpdating}
            className="btn-danger disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUpdating ? (
              <div className="flex items-center">
                <div className="spinner h-4 w-4 mr-2"></div>
                Deleting...
              </div>
            ) : (
              'Delete Course'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
