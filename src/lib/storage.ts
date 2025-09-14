import { v4 as uuidv4 } from 'uuid';

export interface Course {
  id: string;
  title: string;
  content: string;
  images: string[];
  isActive: boolean;
  token: string;
  createdAt: string;
  updatedAt?: string;
  authorId?: string;
  authorName?: string;
}

export interface ChannelMember {
  userId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  joinedAt: string;
}

export interface AdminUser {
  userId: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive: boolean;
  createdAt: string;
}

// Initialize storage in localStorage if not exists (noop on server)
const initializeStorage = () => {
  if (typeof window === 'undefined') return;
  try {
    if (!localStorage.getItem('courses')) {
      localStorage.setItem('courses', JSON.stringify([]));
    }
    if (!localStorage.getItem('channelMembers')) {
      localStorage.setItem('channelMembers', JSON.stringify([]));
    }
    if (!localStorage.getItem('adminUsers')) {
      localStorage.setItem('adminUsers', JSON.stringify([]));
    }
  } catch (_err) {
    // Ignore storage errors on restricted environments
  }
};

// Get all courses
export const getCourses = (): Course[] => {
  if (typeof window === 'undefined') return [];
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem('courses') || '[]');
  } catch (_err) {
    return [];
  }
};

// Get a single course by ID
export const getCourseById = (id: string): Course | undefined => {
  const courses = getCourses();
  return courses.find(course => course.id === id);
};

// Get course by token
export const getCourseByToken = (token: string): Course | undefined => {
  const courses = getCourses();
  return courses.find(course => course.token === token && course.isActive);
};

// Create a new course
export const createCourse = (data: Omit<Course, 'id' | 'token' | 'createdAt' | 'isActive' | 'images'> & { images?: string[] }): Course => {
  const courses = getCourses();
  const newCourse: Course = {
    ...data,
    id: uuidv4(),
    images: data.images || [],
    token: Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15),
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  
  localStorage.setItem('courses', JSON.stringify([...courses, newCourse]));
  return newCourse;
};

// Update a course
export const updateCourse = (id: string, updates: Partial<Omit<Course, 'id' | 'token' | 'createdAt'>>): Course | null => {
  const courses = getCourses();
  const index = courses.findIndex(course => course.id === id);
  
  if (index === -1) return null;
  
  const updatedCourse = {
    ...courses[index],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  
  const newCourses = [...courses];
  newCourses[index] = updatedCourse;
  localStorage.setItem('courses', JSON.stringify(newCourses));
  
  return updatedCourse;
};

// Delete a course
export const deleteCourse = (id: string): boolean => {
  const courses = getCourses();
  const newCourses = courses.filter(course => course.id !== id);
  
  if (newCourses.length === courses.length) return false;
  
  localStorage.setItem('courses', JSON.stringify(newCourses));
  return true;
};

// Toggle course active status
export const toggleCourseStatus = (id: string): boolean => {
  const course = getCourseById(id);
  if (!course) return false;
  
  return !!updateCourse(id, { isActive: !course.isActive });
};

// Channel Members Management
export const getChannelMembers = (): ChannelMember[] => {
  if (typeof window === 'undefined') return [];
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem('channelMembers') || '[]');
  } catch (_err) {
    return [];
  }
};

export const addChannelMember = (member: Omit<ChannelMember, 'joinedAt'>): ChannelMember => {
  const members = getChannelMembers();
  const newMember: ChannelMember = {
    ...member,
    joinedAt: new Date().toISOString(),
  };
  
  // Check if member already exists
  const existingIndex = members.findIndex(m => m.userId === member.userId);
  if (existingIndex !== -1) {
    members[existingIndex] = newMember;
  } else {
    members.push(newMember);
  }
  
  localStorage.setItem('channelMembers', JSON.stringify(members));
  return newMember;
};

export const isChannelMember = (userId: string): boolean => {
  const members = getChannelMembers();
  return members.some(member => member.userId === userId);
};

// Admin Users Management
export const getAdminUsers = (): AdminUser[] => {
  if (typeof window === 'undefined') return [];
  initializeStorage();
  try {
    return JSON.parse(localStorage.getItem('adminUsers') || '[]');
  } catch (_err) {
    return [];
  }
};

export const addAdminUser = (user: Omit<AdminUser, 'createdAt' | 'isActive'>): AdminUser => {
  const admins = getAdminUsers();
  const newAdmin: AdminUser = {
    ...user,
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  
  // Check if admin already exists
  const existingIndex = admins.findIndex(a => a.userId === user.userId);
  if (existingIndex !== -1) {
    admins[existingIndex] = newAdmin;
  } else {
    admins.push(newAdmin);
  }
  
  localStorage.setItem('adminUsers', JSON.stringify(admins));
  return newAdmin;
};

export const isAdminUser = (userId: string): boolean => {
  const admins = getAdminUsers();
  return admins.some(admin => admin.userId === userId && admin.isActive);
};

// Initialize with default admin (for development)
export const initializeDefaultAdmin = () => {
  if (typeof window === 'undefined') return;
  
  const admins = getAdminUsers();
  if (admins.length === 0) {
    // Use the admin user ID from environment or default
    const adminUserId = process.env.NEXT_PUBLIC_ADMIN_USER_ID || '2798244043';
    addAdminUser({
      userId: adminUserId,
      username: 'admin',
      firstName: 'Admin',
      lastName: 'User',
    });
    
    // For development, also add a test admin user
    if (process.env.NODE_ENV === 'development') {
      addAdminUser({
        userId: 'dev-admin',
        username: 'dev_admin',
        firstName: 'Dev',
        lastName: 'Admin',
      });
    }
  }
};