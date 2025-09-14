'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import { isAdminUser, initializeDefaultAdmin } from '@/lib/storage';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();
  const { user, isLoading: tgLoading, error } = useTelegramWebApp();

  useEffect(() => {
    // Initialize default admin for development
    initializeDefaultAdmin();
    
    if (!tgLoading && user) {
      const adminCheck = isAdminUser(user.id.toString());
      setIsAdmin(adminCheck);
      
      // Redirect based on user role
      if (adminCheck) {
        router.push('/admin');
      } else {
        router.push('/courses');
      }
    } else if (!tgLoading && error) {
      // If not in Telegram WebApp, show welcome page
      setIsLoading(false);
    } else if (!tgLoading && !user && !error) {
      // Development mode - no Telegram user data
      setIsLoading(false);
    }
  }, [user, tgLoading, error, router]);

  if (tgLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="spinner h-12 w-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Secure Courses</h1>
          <p className="text-gray-600 mb-6">
            This app is designed to work within Telegram. Please open it through the Telegram bot.
          </p>
          <div className="space-y-4">
            <button
              onClick={() => router.push('/admin')}
              className="w-full btn-primary"
            >
              Admin Panel
            </button>
            <button
              onClick={() => router.push('/courses')}
              className="w-full btn-secondary"
            >
              View Courses
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Secure Courses</h1>
        <p className="text-gray-600 mb-6">
          {isAdmin ? 'Redirecting to admin panel...' : 'Loading your courses...'}
        </p>
        <div className="spinner h-8 w-8 mx-auto"></div>
      </div>
    </div>
  );
}
