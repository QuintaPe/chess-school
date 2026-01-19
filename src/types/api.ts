
export interface User {
    id: string | number;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
    subscription_plan: 'free' | 'premium';
    discord_id?: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface StudentGroup {
    id: string;
    name: string;
    description: string;
    teacher_id: string;
    teacher_name: string;
    student_count: number;
    created_at: string;
}

export interface GroupMember {
    id: string;
    name: string;
    email: string;
    avatar_url: string | null;
}

export interface ClassItem {
    id: string;
    title: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    start_time: string;
    teacher_id?: string | null;
    teacher_name?: string;
    group_id?: string | null;
    group_name?: string;
    status: 'scheduled' | 'live' | 'completed' | 'canceled';
    meeting_link?: string;
    video_url?: string;
    recurring_days?: number[];
}

export interface Puzzle {
    id: number;
    externalId?: string; // Original PuzzleId from CSV
    fen: string;
    solution: string[]; // UCI moves array
    rating: number;
    ratingDeviation?: number;
    popularity?: number;
    nbPlays?: number;
    turn: 'w' | 'b';
    tags: string[];
    gameUrl?: string;
    openingTags?: string[];
}

export interface PuzzleSolutionResponse {
    correct: boolean;
    points: number;
}

export interface Course {
    id: number;
    title: string;
    description: string;
    thumbnail_url: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    category: string;
    price: number;
    is_published: boolean;
    isEnrolled?: boolean;
    progress_percentage?: number;
    lessons?: Lesson[];
}

export interface Lesson {
    id: number;
    course_id: number;
    title: string;
    description: string;
    video_url: string;
    order_index: number;
    duration: number;
    is_free_preview: boolean;
    is_completed?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    meta: {
        total: number;
        page: number;
        limit: number;
        totalPages: number;
    };
}
export interface DailyPuzzle extends Puzzle {
    dailyPuzzleId: number;
    date: string;
    userAttempt?: {
        solved: boolean;
        attempts: number;
        timeSpent: number;
    };
}

export interface DailyStats {
    totalAttempted: number;
    totalSolved: number;
    currentStreak: number;
    longestStreak: number;
    averageAttempts: number;
    averageTime: number;
    solveRate: number;
    recentPuzzles: {
        date: string;
        solved: boolean;
        attempts: number;
    }[];
}

export interface LeaderboardEntry {
    rank: number;
    userId: number;
    userName: string;
    timeSpent: number;
    attempts: number;
    completedAt: string;
}

export interface DailyLeaderboard {
    date: string;
    leaderboard: LeaderboardEntry[];
    totalSolved: number;
    totalAttempted: number;
}
export interface Achievement {
    id: string;
    name: string;
    description: string;
    icon_url: string | null;
    criteria_type: string;
    criteria_value: number;
    unlocked_at?: string;
    isUnlocked: boolean;
    progress?: number;
}
