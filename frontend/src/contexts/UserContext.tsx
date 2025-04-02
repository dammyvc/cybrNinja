"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useUser } from "@auth0/nextjs-auth0/client";

interface Achievement {
    achievement_id: string;
    details: {
        badge_icon?: string;
        name?: string;
        description?: string;
    };
}

interface UserData {
    username: string;
    email: string;
    xp?: number;
    avatar?: string;
    rank?: { title: string };
    leaderboard_position?: number;
    achievements?: Achievement[];
    quizzes_taken?: number;
    achievements_count:number;
}

interface UserContextType {
    dbUser: UserData | null;
    setDbUser: (user: UserData) => void;
    accessToken: string | null;
    loading: boolean;
    error: string | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const { user, isLoading: authLoading, error: authError } = useUser();
    const [dbUser, setDbUser] = useState<UserData | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch the access token for client-side requests
    useEffect(() => {
        const fetchAccessToken = async () => {
            if (authLoading || !user) return;

            try {
                const response = await fetch("/api/auth/get-token", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch access token");
                }

                const data = await response.json();
                setAccessToken(data.accessToken);
            } catch (err) {
                console.error("Error fetching access token:", err);
                setError("Failed to fetch access token");
            }
        };

        fetchAccessToken();
    }, [user, authLoading]);

    // Fetch user data
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
        <UserContext.Provider value={{ dbUser, setDbUser, accessToken, loading, error }}>
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