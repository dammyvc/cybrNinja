"use client";

import { useState } from "react";
import ProfileView from "@/components/ProfileView";
import ProfileEdit from "@/components/ProfileEdit";
import { UserProvider } from "@/contexts/UserContext";

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);

    return (
        <UserProvider>
            <div className="container mx-auto p-4 max-w-4xl">
                <h1 className="text-3xl font-bold mb-6">User Profile</h1>
                <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                    {isEditing ? "View Profile" : "Edit Profile"}
                </button>

                {isEditing ? <ProfileEdit /> : <ProfileView />}
            </div>
        </UserProvider>
    );
}