// User
export interface User {
  id: number;
  email: string;
  name: string;
  profileImageUrl: string | null;
  role: "USER" | "ADMIN";
  totalXp: number;
  level: number;
  createdAt: string;
}

// Auth
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
}

// Event (Calendar)
export interface Event {
  id: number;
  title: string;
  description: string | null;
  startTime: string;
  endTime: string;
  allDay: boolean;
  color: string | null;
  repeatRule: "NONE" | "DAILY" | "WEEKLY" | "BIWEEKLY" | "MONTHLY" | "YEARLY";
  createdAt: string;
}

export interface EventRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  allDay?: boolean;
  color?: string;
  repeatRule?: string;
}

// Todo
export interface Todo {
  id: number;
  title: string;
  description: string | null;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate: string | null;
  sortOrder: number;
  subtasks: Todo[];
  createdAt: string;
}

export interface TodoRequest {
  title: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  parentId?: number;
}

// Notification
export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  referenceId: number | null;
  read: boolean;
  createdAt: string;
}

// AlgoBank
export interface Problem {
  id: number;
  title: string;
  description: string;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  tags: string | null;
  authorId: number;
  authorName: string;
  createdAt: string;
}

export interface ProblemRequest {
  title: string;
  description: string;
  difficulty: string;
  tags?: string;
}

export interface Solution {
  id: number;
  problemId: number;
  code: string;
  language: string;
  explanation: string | null;
  timeComplexity: string | null;
  spaceComplexity: string | null;
  githubUrl: string | null;
  authorId: number;
  authorName: string;
  createdAt: string;
}

export interface SolutionRequest {
  code: string;
  language: string;
  explanation?: string;
}

export interface Evaluation {
  id: number;
  correctness: number;
  codeReadability: number;
  commentsClarity: number;
  conditionSatisfaction: number;
  averageScore: number;
  feedback: string | null;
  evaluatorId: number;
  evaluatorName: string;
  createdAt: string;
}

export interface EvaluationRequest {
  correctness: number;
  codeReadability: number;
  commentsClarity: number;
  conditionSatisfaction: number;
  feedback?: string;
}

// Community
export interface Post {
  id: number;
  title: string;
  content: string;
  tag: "ALGORITHM" | "DEVELOPMENT" | "HOBBY" | "IT_NEWS" | "JOB_INFO" | "LEARNING" | "FREE" | "QNA" | "INQUIRY";
  authorId: number;
  authorName: string;
  authorProfileImageUrl: string | null;
  likeCount: number;
  viewCount: number;
  reportCount: number;
  blinded: boolean;
  resolved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PostRequest {
  title: string;
  content: string;
  tag: string;
}

export interface Comment {
  id: number;
  content: string;
  authorId: number;
  authorName: string;
  authorProfileImageUrl: string | null;
  replies: Comment[];
  createdAt: string;
}

export interface CommentRequest {
  content: string;
  parentId?: number;
}

// Pagination
export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}
