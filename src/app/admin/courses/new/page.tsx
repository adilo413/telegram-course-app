'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { createCourse } from '@/lib/storage';
import { COURSE_SUBJECTS } from '@/lib/supabase';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import CourseEditor from '@/components/CourseEditor';
import toast from 'react-hot-toast';

const courseSchema = z.object({
  title: z.string().min(1, 'Title is required').max(200, 'Title must be less than 200 characters'),
  content: z.string().min(1, 'Content is required'),
  subject: z.enum(['English','Amharic','Civic','Math','Science'], { required_error: 'Subject is required' }),
});

type CourseFormData = z.infer<typeof courseSchema>;

export default function NewCourse() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [content, setContent] = useState('');
  const router = useRouter();
  const { user, hapticFeedback, setupMainButton } = useTelegramWebApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      content: '',
      subject: 'English',
    },
  });

  const title = watch('title');

  // Set up Telegram main button
  useEffect(() => {
    const mainButton = setupMainButton('Create Course', handleCreateCourse);
    return () => mainButton.hide();
  }, [setupMainButton]);

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setValue('content', newContent);
  };

  const handleCreateCourse = async () => {
    hapticFeedback('impact', 'medium');
    await handleSubmit(onSubmit)();
  };

  const onSubmit = async (data: CourseFormData) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    try {
      const newCourse = createCourse({
        title: data.title,
        content: data.content,
        subject: data.subject as any,
        images: [], // Extract images from content if needed
        authorId: user?.id?.toString() || 'dev-admin',
        authorName: user?.first_name || 'Dev Admin',
      });

      toast.success('Course created successfully!');
      hapticFeedback('notification', 'success');
      
      // Redirect to course detail page
      router.push(`/admin/courses/${newCourse.id}`);
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
      hapticFeedback('notification', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="md:flex md:items-center md:justify-between">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Create New Course
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Create a new course with rich text content and images
          </p>
        </div>
        <div className="mt-4 flex md:mt-0 md:ml-4 space-x-3">
          <button
            onClick={() => router.back()}
            className="btn-secondary"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            onClick={handleCreateCourse}
            disabled={isSubmitting || !title.trim() || !content.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="spinner h-4 w-4 mr-2"></div>
                Creating...
              </div>
            ) : (
              'Create Course'
            )}
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="form-label">
            Course Title *
          </label>
          <input
            {...register('title')}
            type="text"
            id="title"
            className={`form-input ${errors.title ? 'border-red-500' : ''}`}
            placeholder="Enter course title..."
            disabled={isSubmitting}
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
          )}
        </div>

        {/* Subject */}
        <div>
          <label className="form-label">Subject *</label>
          <select
            {...register('subject')}
            className={`form-input ${errors.subject ? 'border-red-500' : ''}`}
            disabled={isSubmitting}
          >
            {COURSE_SUBJECTS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          {errors.subject && (
            <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
          )}
        </div>

        {/* Content */}
        <div>
          <label className="form-label">
            Course Content *
          </label>
          <CourseEditor
            onContentChange={handleContentChange}
            placeholder="Start writing your course content..."
          />
          {errors.content && (
            <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
          )}
        </div>

        {/* Preview */}
        {content && (
          <div>
            <label className="form-label">
              Preview
            </label>
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
              <div 
                className="prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
              />
            </div>
          </div>
        )}

        {/* Course Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-sm font-medium text-blue-800 mb-2">Course Information</h3>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Your course will be protected against copying and right-clicking</li>
            <li>• Students will need to be channel members to access the course</li>
            <li>• You can activate/deactivate the course anytime</li>
            <li>• The course will be distributed via your Telegram bot</li>
          </ul>
        </div>
      </form>
    </div>
  );
}
