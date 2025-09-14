'use client';

import { useState, useEffect, useCallback } from 'react';
import { getCourses, Course, createCourse, updateCourse, deleteCourse, toggleCourseStatus } from '@/lib/storage';
import toast from 'react-hot-toast';

export const useCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadCourses = useCallback(() => {
    try {
      const allCourses = getCourses();
      setCourses(allCourses);
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Failed to load courses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCourse = useCallback((courseData: Omit<Course, 'id' | 'token' | 'createdAt' | 'isActive' | 'images'> & { images?: string[] }) => {
    try {
      const newCourse = createCourse(courseData);
      setCourses(prev => [...prev, newCourse]);
      toast.success('Course created successfully');
      return newCourse;
    } catch (error) {
      console.error('Error creating course:', error);
      toast.error('Failed to create course');
      throw error;
    }
  }, []);

  const editCourse = useCallback((id: string, updates: Partial<Omit<Course, 'id' | 'token' | 'createdAt'>>) => {
    try {
      const updatedCourse = updateCourse(id, updates);
      if (updatedCourse) {
        setCourses(prev => prev.map(course => 
          course.id === id ? updatedCourse : course
        ));
        toast.success('Course updated successfully');
        return updatedCourse;
      } else {
        toast.error('Course not found');
        return null;
      }
    } catch (error) {
      console.error('Error updating course:', error);
      toast.error('Failed to update course');
      throw error;
    }
  }, []);

  const removeCourse = useCallback((id: string) => {
    try {
      const success = deleteCourse(id);
      if (success) {
        setCourses(prev => prev.filter(course => course.id !== id));
        toast.success('Course deleted successfully');
        return true;
      } else {
        toast.error('Course not found');
        return false;
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      toast.error('Failed to delete course');
      throw error;
    }
  }, []);

  const toggleStatus = useCallback((id: string) => {
    try {
      const success = toggleCourseStatus(id);
      if (success) {
        loadCourses(); // Reload to get updated status
        toast.success('Course status updated');
        return true;
      } else {
        toast.error('Course not found');
        return false;
      }
    } catch (error) {
      console.error('Error toggling course status:', error);
      toast.error('Failed to update course status');
      throw error;
    }
  }, [loadCourses]);

  const getActiveCourses = useCallback(() => {
    return courses.filter(course => course.isActive);
  }, [courses]);

  const getInactiveCourses = useCallback(() => {
    return courses.filter(course => !course.isActive);
  }, [courses]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  return {
    courses,
    isLoading,
    loadCourses,
    addCourse,
    editCourse,
    removeCourse,
    toggleStatus,
    getActiveCourses,
    getInactiveCourses,
  };
};
