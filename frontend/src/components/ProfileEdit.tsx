import { useState } from 'react';
import { UserProfile } from '@/types/user';

interface ProfileEditProps {
    profile: UserProfile;
    setProfile: (profile: UserProfile) => void;
}

export default function ProfileEdit({ profile, setProfile }: ProfileEditProps) {
    const [formData, setFormData] = useState({
        username: profile.username,
        email: profile.email,
        oldPassword: '',
        password: '',
        confirmPassword: '',
        profilePicture: profile.profilePicture
    });
    const [error, setError] = useState<string>('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Check if new passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('New passwords do not match');
            return;
        }

        // Here you would typically make an API call to verify old password
        // and update the profile
        const updatedProfile = { 
            ...profile, 
            username: formData.username,
            email: formData.email,
            profilePicture: formData.profilePicture,
            // Only include password if it's being changed
            ...(formData.password && { password: formData.password })
        };
        setProfile(updatedProfile);
        // Add your API call here
        console.log('Profile updated:', updatedProfile);
        setError('');
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData({ ...formData, profilePicture: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center space-x-4">
                <img
                    src={formData.profilePicture}
                    alt="Profile preview"
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-blue-500 file:text-white hover:file:bg-blue-600"
                    />
                </div>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block mb-1 font-semibold">Username</label>
                    <input
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Email</label>
                    <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Current Password <span className='text-sm italic font-base'>(Needed if you change your password)</span></label>
                    <input
                        type="password"
                        value={formData.oldPassword}
                        onChange={(e) => setFormData({ ...formData, oldPassword: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                        required
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">New Password <span className='text-sm italic font-base'>(Leave blank if you don't wish to change it)</span></label>
                    <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                    />
                </div>

                <div>
                    <label className="block mb-1 font-semibold">Confirm New Password</label>
                    <input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                        className="w-full p-2 border rounded dark:bg-dark"
                    />
                </div>

                {error && (
                    <div className="text-red-500 text-sm">{error}</div>
                )}
            </div>

            <button
                type="submit"
                className="w-full py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Save Changes
            </button>
        </form>
    );
}