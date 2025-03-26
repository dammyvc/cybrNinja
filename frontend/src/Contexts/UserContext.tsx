"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

interface UserContextType {
    dbUser: any | null; // We'll use the raw dbUser structure
    setDbUser: (user: any) => void;
    loading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoading: authLoading, error: authError } = useUser();
    const [dbUser, setDbUser] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            if (authLoading) return;
            if (authError) {
                setError("Authentication error: " + authError.message);
                setLoading(false);
                return;
            }
            if (!user) {
                window.location.href = "/api/auth/login";
                return;
            }

            try {
                const res = await fetch("/api/auth/user", {
                    credentials: "include",
                    signal: AbortSignal.timeout(30000),
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.error || "Failed to fetch user data");
                }
                const data = await res.json();
                setDbUser(data);
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
                setError(`Error fetching user data: ${errorMessage}`);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [user, authLoading, authError]);

    return (
        <UserContext.Provider value={{ dbUser, setDbUser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserData = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUserData must be used within a UserProvider");
    }
    return context;
};