
import React, { createContext, useContext, useState, useEffect } from "react";
import { User, AuthResponse } from "@/types/api";
import { api } from "@/lib/api";

interface AuthContextType {
    user: User | null;
    token: string | null;
    login: (data: any) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Ideally verify token validity with backend here
        const storedUser = localStorage.getItem("user");
        if (token && storedUser && storedUser !== "undefined") {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse stored user", e);
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null);
                setToken(null);
            }
        } else {
            // Cleanup invalid state if token exists but user is "undefined" or null
            if (token && (storedUser === "undefined" || !storedUser)) {
                localStorage.removeItem("user");
                // Optional: keep token or remove it? safer to remove if state is inconsistent
                // localStorage.removeItem("token");
                // setToken(null);
            }
        }
        setIsLoading(false);
    }, [token]);

    const saveAuth = (data: AuthResponse) => {
        setToken(data.token);
        setUser(data.user);
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
    };

    const login = async (credentials: any) => {
        const data = await api.auth.login(credentials);
        saveAuth(data);
    };

    const register = async (credentials: any) => {
        const data = await api.auth.register(credentials);
        saveAuth(data);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                login,
                register,
                logout,
                isAuthenticated: !!token,
                isLoading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
