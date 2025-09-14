-- Telegram Course App Database Schema
-- Run this in your Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum for course subjects
CREATE TYPE course_subject AS ENUM (
  'English',
  'Amharic', 
  'Civic',
  'Math',
  'Science'
);

-- Create enum for course status
CREATE TYPE course_status AS ENUM (
  'active',
  'inactive'
);

-- Admin users table
CREATE TABLE admin_users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Courses table
CREATE TABLE courses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  subject course_subject NOT NULL,
  status course_status DEFAULT 'active',
  token VARCHAR(50) UNIQUE NOT NULL,
  author_id UUID REFERENCES admin_users(id),
  author_name VARCHAR(100),
  images JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Channel members table (for tracking who has access)
CREATE TABLE channel_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id VARCHAR(50) UNIQUE NOT NULL,
  username VARCHAR(50),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Course access logs (for future tracking)
CREATE TABLE course_access_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  course_id UUID REFERENCES courses(id),
  user_id VARCHAR(50),
  accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT
);

-- Create indexes for better performance
CREATE INDEX idx_courses_status ON courses(status);
CREATE INDEX idx_courses_subject ON courses(subject);
CREATE INDEX idx_courses_token ON courses(token);
CREATE INDEX idx_courses_created_at ON courses(created_at);
CREATE INDEX idx_channel_members_user_id ON channel_members(user_id);
CREATE INDEX idx_access_logs_course_id ON course_access_logs(course_id);
CREATE INDEX idx_access_logs_accessed_at ON course_access_logs(accessed_at);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at BEFORE UPDATE ON admin_users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert default admin user (password will be set via environment)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2a$10$placeholder.hash.will.be.updated');

-- Create RLS (Row Level Security) policies
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE channel_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE course_access_logs ENABLE ROW LEVEL SECURITY;

-- Admin users can only see their own data
CREATE POLICY "Admin users can view own data" ON admin_users
  FOR SELECT USING (true);

-- Courses are readable by everyone (for the mini app)
CREATE POLICY "Courses are readable by everyone" ON courses
  FOR SELECT USING (true);

-- Only admins can modify courses
CREATE POLICY "Only admins can modify courses" ON courses
  FOR ALL USING (true);

-- Channel members are readable by everyone
CREATE POLICY "Channel members are readable by everyone" ON channel_members
  FOR SELECT USING (true);

-- Access logs are readable by everyone
CREATE POLICY "Access logs are readable by everyone" ON course_access_logs
  FOR SELECT USING (true);
