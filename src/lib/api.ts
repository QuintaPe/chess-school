
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
    },
};
