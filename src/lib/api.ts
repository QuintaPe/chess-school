
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
        list: async (params?: { level?: string; type?: string }) => {
            const url = new URL(`${BASE_URL}/classes`);
            if (params) {
                Object.entries(params).forEach(([key, value]) => {
                    if (value) url.searchParams.append(key, value);
                });
            }
            const res = await fetch(url.toString(), { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        get: async (id: number) => {
            const res = await fetch(`${BASE_URL}/classes/${id}`, { headers: getHeaders() });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        register: async (id: number) => {
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
        update: async (id: number, data: any) => {
            const res = await fetch(`${BASE_URL}/classes/${id}`, {
                method: 'PUT',
                headers: getHeaders(),
                body: JSON.stringify(data),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        delete: async (id: number) => {
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
        solve: async (puzzleId: number, solution: string) => {
            const res = await fetch(`${BASE_URL}/puzzles/solve`, {
                method: 'POST',
                headers: getHeaders(),
                body: JSON.stringify({ puzzleId, solution }),
            });
            if (!res.ok) throw new Error(await res.text());
            return res.json();
        },
        list: async () => {
            const res = await fetch(`${BASE_URL}/puzzles`, { headers: getHeaders() });
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
    },
};
