'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';
import { isAdminUser } from '@/lib/storage';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, setupBackButton } = useTelegramWebApp();

  useEffect(() => {
    if (user) {
      const adminCheck = isAdminUser(user.id.toString());
      if (adminCheck) {
        setIsAuthorized(true);
        setupBackButton(() => router.push('/'));
      } else {
        router.push('/');
      }
    } else {
      // For development/testing in browser, allow access if no user data
      // In production, this should be restricted to Telegram WebApp only
      if (process.env.NODE_ENV === 'development') {
        setIsAuthorized(true);
        console.log('Development mode: Admin access granted without Telegram user data');
      } else {
        router.push('/');
      }
    }
    setIsLoading(false);
  }, [user, router, setupBackButton]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="spinner h-12 w-12"></div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-4">You don't have admin privileges.</p>
          <button
            onClick={() => router.push('/')}
            className="btn-primary"
          >
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Panel
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/courses"
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Courses
              </Link>
              <Link
                href="/admin/courses/new"
                className="btn-primary text-sm"
              >
                New Course
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
