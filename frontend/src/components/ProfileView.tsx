import Image from "next/image";
import { useUserData } from "@/contexts/UserContext";

interface Achievement {
    achievement_id: string;
    details: {
        badge_icon?: string;
        title?: string;
        name?: string;
        description?: string;
    };
}

export default function ProfileView() {
    const { dbUser, loading, error } = useUserData();


    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!dbUser) return <div>No profile data available</div>;

    return (
        dbUser && (
            <div className="space-y-6">
                <div className="flex items-center space-x-4">
                    <Image
                        src={dbUser.avatar || "/assets/images/avatar.png"}
                        alt="User Profile Picture"
                        width={24}
                        height={24}
                        className="w-24 h-24 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-2xl font-semibold">@{dbUser.username}</h2>
                        <p className="text-gray-600">{dbUser.email}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-gray-100 dark:bg-dark p-4 rounded">
                        <h3 className="font-semibold">Leaderboard Position & cybrNinja Rank</h3>
                        <p>cybrNinja Rank: {dbUser.rank?.title || "Unranked"}</p>
                        <p>Leaderboard Position: {dbUser.leaderboard_position || "N/A"}</p>
                    </div>

                    <div className="bg-gray-100 dark:bg-dark p-4 rounded">
                        <h3 className="font-semibold">Stats</h3>
                        <p>Achievements: {dbUser.achievements?.length || 0}</p>
                    </div>
                </div>

                <div>
                    <h3 className="text-xl font-semibold mb-2">Achievements</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {dbUser.achievements?.map((achievement: Achievement) => (
                            <div
                                key={achievement.achievement_id}
                                className="bg-gray-100 dark:bg-dark p-2 rounded text-center"
                            >
                                <Image
                                    src={achievement.details?.badge_icon || "/assets/images/black_dash_logo.png" }
                                    alt={achievement.details?.title || "Achievement"}
                                    width={16}
                                    height={16}
                                    className="w-16 h-16 mx-auto"
                                />
                                <p className="font-semibold">{achievement.details?.name || "Unknown Achievement"}</p>
                                <p className="text-sm text-gray-600">{achievement.details?.description || ""}</p>
                            </div>
                        )) || <p>No achievements yet.</p>}
                    </div>
                </div>
            </div>
        )
    );
}