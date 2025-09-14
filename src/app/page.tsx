'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTelegramWebApp } from '@/hooks/useTelegramWebApp';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const { user, isLoading: tgLoading, error } = useTelegramWebApp();

  useEffect(() => {
    const go = async () => {
      if (tgLoading) return;
      try {
        const res = await fetch('/api/auth/me', { cache: 'no-store' });
        if (res.ok) {
          router.replace('/admin');
        } else {
          router.replace('/admin/login');
        }
      } catch {
        router.replace('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };
    go();
  }, [tgLoading, router]);

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

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Secure Courses</h1>
        <p className="text-gray-600 mb-6">
          Redirecting to admin...
        </p>
        <div className="spinner h-8 w-8 mx-auto"></div>
      </div>
    </div>
  );
}
