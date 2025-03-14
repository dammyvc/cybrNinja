// types/user.ts
export interface Badge {
    id: string;
    name: string;
    description: string;
    image: string;
    earnedDate: Date;
}

export interface Milestone {
    id: string;
    title: string;
    description: string;
    completedDate: Date;
}

export interface UserProfile {
    username: string;
    email: string;
    rank: number;
    level: string;
    profilePicture: string;
    badges: Badge[];
    milestones: Milestone[];
}