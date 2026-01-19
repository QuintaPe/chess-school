
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const getHeaders = () => {
    const token = localStorage.getItem('token');
    const headers: HeadersInit = {
        'Content-Type': 'application/json',
    };
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
};

export const api = {
    auth: {
        register: async (data: any) => {
            const res = await fetch(`${BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        login: async (data: any) => {
            const res = await fetch(`${BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
    classes: {
        list: async (params?: { level?: string; type?: string; groupId?: string | number }) => {
            const url = new URL(`${BASE_URL}/classes`);
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined && value !== null) url.searchParams.append(key, value.toString());
                });
            }
            const res = await fetch(url.toString(), { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        // ... (rest of classes methods)
        get: async (id: string | number) => {
            const res = await fetch(`${BASE_URL}/classes/${id}`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        register: async (id: string | number) => {
            const res = await fetch(`${BASE_URL}/classes/${id}/register`, {
                method: 'POST',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        create: async (data: any) => {
            const res = await fetch(`${BASE_URL}/classes`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        update: async (id: string | number, data: any) => {
            const res = await fetch(`${BASE_URL}/classes/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        delete: async (id: string | number) => {
            const res = await fetch(`${BASE_URL}/classes/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
    puzzles: {
        daily: async () => {
            const res = await fetch(`${BASE_URL}/puzzles/daily`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        dailyAttempt: async (data: { dailyPuzzleId: number; moves: string[]; solved: boolean; timeSpent: number }) => {
            const res = await fetch(`${BASE_URL}/puzzles/daily/attempt`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        dailyStats: async () => {
            const res = await fetch(`${BASE_URL}/puzzles/daily/stats`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        dailyLeaderboard: async (date?: string) => {
            const url = new URL(`${BASE_URL}/puzzles/daily/leaderboard`);
            if (date) url.searchParams.append('date', date);
            const res = await fetch(url.toString(), { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        solve: async (puzzleId: number, solution: string) => {
            const res = await fetch(`${BASE_URL}/puzzles/solve`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ puzzleId, solution }),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        list: async (params?: { page?: number; limit?: number; ratingMin?: number; ratingMax?: number; tags?: string[]; sort?: string; order?: 'asc' | 'desc' }) => {
            const url = new URL(`${BASE_URL}/puzzles`);
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value !== undefined) {
                        if (Array.isArray(value)) {
                            value.forEach(v => url.searchParams.append(key, v));
                        } else {
                            url.searchParams.append(key, value.toString());
                        }
                    }
                });
            }
            const res = await fetch(url.toString(), { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        create: async (data: any) => {
            const res = await fetch(`${BASE_URL}/puzzles`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        update: async (id: number, data: any) => {
            const res = await fetch(`${BASE_URL}/puzzles/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        delete: async (id: number) => {
            const res = await fetch(`${BASE_URL}/puzzles/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        importFen: async (fen: string) => {
            const res = await fetch(`${BASE_URL}/puzzles/import-fen`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ fen }),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
    courses: {
        list: async () => {
            const res = await fetch(`${BASE_URL}/courses`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        get: async (id: number) => {
            const res = await fetch(`${BASE_URL}/courses/${id}`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        create: async (data: any) => {
            const res = await fetch(`${BASE_URL}/courses`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        addLesson: async (courseId: number, data: any) => {
            const res = await fetch(`${BASE_URL}/courses/${courseId}/lessons`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        enroll: async (courseId: number) => {
            const res = await fetch(`${BASE_URL}/courses/${courseId}/enroll`, {
                method: 'POST',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        update: async (id: number, data: any) => {
            const res = await fetch(`${BASE_URL}/courses/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        updateLesson: async (lessonId: number, data: any) => {
            const res = await fetch(`${BASE_URL}/courses/lessons/${lessonId}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        completeLesson: async (lessonId: number) => {
            const res = await fetch(`${BASE_URL}/courses/lessons/${lessonId}/complete`, {
                method: 'POST',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        deleteLesson: async (lessonId: number) => {
            const res = await fetch(`${BASE_URL}/courses/lessons/${lessonId}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        delete: async (id: number) => {
            const res = await fetch(`${BASE_URL}/courses/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
    users: {
        list: async (role?: string) => {
            const url = new URL(`${BASE_URL}/users`);
            if (role) url.searchParams.append('role', role);
            const res = await fetch(url.toString(), { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        get: async (id: string) => {
            const res = await fetch(`${BASE_URL}/users/${id}`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        update: async (id: string, data: any) => {
            const res = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        delete: async (id: string) => {
            const res = await fetch(`${BASE_URL}/users/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        getStats: async () => {
            const res = await fetch(`${BASE_URL}/users/me/stats`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
    admin: {
        getUsers: async (filters: { role?: string; search?: string } = {}) => {
            const url = new URL(`${BASE_URL}/auth/users`);
            Object.entries(filters).forEach(([key, value]) => {
                if (value) url.searchParams.append(key, value);
            });
            const res = await fetch(url.toString(), { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        updateUser: async (id: string, data: any) => {
            const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
                method: 'PATCH',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        deleteUser: async (id: string) => {
            const res = await fetch(`${BASE_URL}/auth/users/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        getDashboardStats: async () => {
            const res = await fetch(`${BASE_URL}/admin/stats`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
    materials: {
        list: async () => {
            const res = await fetch(`${BASE_URL}/materials`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        create: async (data: any) => {
            const res = await fetch(`${BASE_URL}/materials`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        delete: async (id: number) => {
            const res = await fetch(`${BASE_URL}/materials/${id}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
    achievements: {
        list: async () => {
            const res = await fetch(`${BASE_URL}/achievements`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
    studentGroups: {
        list: async () => {
            const res = await fetch(`${BASE_URL}/student-groups`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        create: async (data: { name: string; description: string; teacher_id: string | number }) => {
            const res = await fetch(`${BASE_URL}/student-groups`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        getMembers: async (groupId: string | number) => {
            const res = await fetch(`${BASE_URL}/student-groups/${groupId}/members`, {
                headers: getHeaders()
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        addMember: async (groupId: string | number, userId: string | number) => {
            const res = await fetch(`${BASE_URL}/student-groups/${groupId}/members`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ userId }),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        removeMember: async (groupId: string | number, userId: string | number) => {
            const res = await fetch(`${BASE_URL}/student-groups/${groupId}/members/${userId}`, {
                method: 'DELETE',
                headers: getHeaders(),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
    },
};
