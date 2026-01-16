
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

export interface ClassItem {
    id: number;
    title: string;
    description: string;
    start_time: string; // ISO Date
    duration: number; // minutos
    level: 'beginner' | 'intermediate' | 'advanced';
    status: 'scheduled' | 'live' | 'completed';
    type: 'live' | 'recorded';
    video_url: string;
    capacity?: number;
    teacher_id?: number;
    isRegistered?: boolean; // Booleano devuelto en el detalle si está autenticado
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
