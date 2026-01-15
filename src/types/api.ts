
export interface User {
    id: number;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'admin';
    subscription_plan: 'free' | 'premium';
}

export interface AuthResponse {
    token: string;
    user: User;
}

export interface Class {
    id: number;
    title: string;
    description: string;
    level: 'beginner' | 'intermediate' | 'advanced';
    status: 'scheduled' | 'live' | 'completed';
    type: 'live' | 'recorded';
    start_time?: string;
    duration?: string;
    video_url?: string;
    teacher_id?: number;
    students_registered?: number;
}

export interface Puzzle {
    id: number;
    fen: string;
    solution: string; // SAN or UCI moves
    description?: string;
    difficulty?: number;
}

export interface PuzzleSolutionResponse {
    correct: boolean;
    points: number;
}
