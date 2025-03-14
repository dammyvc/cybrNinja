// pages/profile.tsx
'use client';

import { useState, useEffect } from 'react';
import ProfileView from '@/components/ProfileView';
import ProfileEdit from '@/components/ProfileEdit';
import { UserProfile } from '../types/user';

export default function ProfilePage() {
    const [isEditing, setIsEditing] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);

    // Mock fetch function - replace with your actual API call
    useEffect(() => {
        const fetchProfile = async () => {
            // This would come from your API in a real application
            const mockProfile: UserProfile = {
                username: 'johndoe',
                email: 'john@example.com',
                rank: 5,
                level: 'Genin',
                profilePicture: '/assets/images/avatar.png',
                badges: [
                    { id: '1', name: 'First Steps', description: 'Completed first task', image: '/assets/images/avatar.png', earnedDate: new Date() },
                    { id: '2', name: 'Community Star', description: 'Helped 10 users', image: '/assets/images/avatar.png', earnedDate: new Date() },
                ],
                milestones: [
                    { id: '1', title: 'Level 10', description: 'Reached level 10', completedDate: new Date() },
                    { id: '2', title: '100 Points', description: 'Earned 100 points', completedDate: new Date() },
                ]
            };
            setUserProfile(mockProfile);
        };
        fetchProfile();
    }, []);

    if (!userProfile) return <div>Loading...</div>;

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-3xl font-bold mb-6">User Profile</h1>
            <button
                onClick={() => setIsEditing(!isEditing)}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                {isEditing ? 'View Profile' : 'Edit Profile'}
            </button>

            {isEditing ? (
                <ProfileEdit profile={userProfile} setProfile={setUserProfile} />
            ) : (
                <ProfileView profile={userProfile} />
            )}
        </div>
    );
}