'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { getCourses, Course, toggleCourseStatus, deleteCourse } from '@/lib/storage';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import toast from 'react-hot-toast';

export default function CoursesList() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const router = useRouter();
  const { hapticFeedback, showConfirm } = useTelegramWebApp();

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = () => {
    try {
      const storedCourses = getCourses();
      setCourses(storedCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStatus = async (courseId: string) => {
    hapticFeedback('impact', 'light');
    try {
      const success = toggleCourseStatus(courseId);
      if (success) {
        loadCourses();
        toast.success('Course status updated');
      } else {
        toast.error('Failed to update course status');
      }
    } catch (error) {
      console.error('Error toggling course status:', error);
      toast.error('Failed to update course status');
    }
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    hapticFeedback('impact', 'medium');
    const confirmed = await showConfirm(
      `Are you sure you want to delete "${courseTitle}"? This action cannot be undone.`
    );
    
    if (confirmed) {
      try {
        const success = deleteCourse(courseId);
        if (success) {
          loadCourses();
          toast.success('Course deleted successfully');
        } else {
          toast.error('Failed to delete course');
        }
      } catch (error) {
        console.error('Error deleting course:', error);
        toast.error('Failed to delete course');
      }
    }
  };

  const filteredCourses = courses.filter(course => {
    switch (filter) {
      case 'active':
        return course.isActive;
      case 'inactive':
        return !course.isActive;
      default:
        return true;
    }
  });

  const getFilterCounts = () => {
    const total = courses.length;
    const active = courses.filter(c => c.isActive).length;
    const inactive = total - active;
    return { total, active, inactive };
  };

  const counts = getFilterCounts();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-12 w-12"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Course Management
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage all your courses and their status
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4">
          <Link
            href="/admin/courses/new"
            className="btn-primary"
          >
            Create New Course
          </Link>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setFilter('all')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              filter === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            All ({counts.total})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              filter === 'active'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Active ({counts.active})
          </button>
          <button
            onClick={() => setFilter('inactive')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              filter === 'inactive'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            Inactive ({counts.inactive})
          </button>
        </nav>
      </div>

      {/* Courses List */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredCourses.length === 0 ? (
          <div className="text-center p-12">
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
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              {filter === 'all' ? 'No courses' : `No ${filter} courses`}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {filter === 'all' 
                ? 'Get started by creating a new course.'
                : `No ${filter} courses found.`
              }
            </p>
            {filter === 'all' && (
              <div className="mt-6">
                <Link
                  href="/admin/courses/new"
                  className="btn-primary"
                >
                  Create New Course
                </Link>
              </div>
            )}
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredCourses.map((course) => (
              <li key={course.id}>
                <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/admin/courses/${course.id}`}
                        className="text-sm font-medium text-blue-600 hover:text-blue-500 truncate"
                      >
                        {course.title}
                      </Link>
                      <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Created {new Date(course.createdAt).toLocaleDateString()}</span>
                        {course.images.length > 0 && (
                          <span>{course.images.length} image{course.images.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        course.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {course.isActive ? 'Active' : 'Inactive'}
                      </span>
                      <div className="flex space-x-1">
                        <button
                          onClick={() => handleToggleStatus(course.id)}
                          className={`text-xs px-2 py-1 rounded ${
                            course.isActive
                              ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                              : 'bg-green-100 text-green-800 hover:bg-green-200'
                          }`}
                        >
                          {course.isActive ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.id, course.title)}
                          className="text-xs px-2 py-1 rounded bg-red-100 text-red-800 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
