import { UserProfile } from '@/types/user';
import Image from 'next/image';
import { useUser } from '@auth0/nextjs-auth0/client';


interface ProfileViewProps {
    profile: UserProfile;
}

export default function ProfileView({ profile }: ProfileViewProps) {
    const { user, error, isLoading } = useUser();

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    return (
        user&& <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Image
                    src={user.picture || "/assets/images/avatar.png"}
                    alt={user.picture || "User Profile Picture"}
                    width={24}
                    height={24}
                    className="w-24 h-24 rounded-full object-cover"
                />
                <div>
                    <h2 className="text-2xl font-semibold">{user.name}</h2>
                    <p className="text-gray-600">{user.email}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-100 dark:bg-dark p-4 rounded">
                    <h3 className="font-semibold">Rank & Level</h3>
                    <p>Rank: {profile.rank}</p>
                    <p>Level: {profile.level}</p>
                </div>

                <div className="bg-gray-100 dark:bg-dark p-4 rounded">
                    <h3 className="font-semibold">Stats</h3>
                    <p>Badges: {profile.badges.length}</p>
                    <p>Milestones: {profile.milestones.length}</p>
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Badges</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {profile.badges.map(badge => (
                        <div key={badge.id} className="bg-gray-100 dark:bg-dark p-2 rounded text-center">
                            <Image src={badge.image} alt={badge.name} width={16} height={16} className="w-16 h-16 mx-auto" />
                            <p className="font-semibold">{badge.name}</p>
                            <p className="text-sm text-gray-600">{badge.description}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-2">Milestones</h3>
                <div className="space-y-2">
                    {profile.milestones.map(milestone => (
                        <div key={milestone.id} className="bg-gray-100 dark:bg-dark p-3 rounded">
                            <p className="font-semibold">{milestone.title}</p>
                            <p className="text-sm">{milestone.description}</p>
                            <p className="text-sm text-gray-600">
                                {milestone.completedDate.toLocaleDateString()}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}