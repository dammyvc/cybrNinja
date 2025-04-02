"use client";

import { UserProvider, useUserData } from "@/contexts/UserContext";
import { InfoCards } from "@/components/InfoCards";
import { QuizCards } from "@/components/QuizCards";
import { QuizChart } from "@/components/QuizChart";
import { CalendarView } from "@/components/CalendarView";
import { LeaderBoard } from "@/components/LeaderBoard";

function DashboardContent() {
    const { dbUser, loading, error } = useUserData();

    if (loading) return <div>Please wait, getting user data...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <div className="pl-4 flex gap-4 flex-col md:flex-row mr-3 lg:mr-0 md:mr-0">
                {/* LEFT */}
                <div className="w-full lg:2-2/3">
                    {/* INFO CARDS */}
                    <div className="flex gap-4 justify-between flex-wrap">
                        <InfoCards
                            type="Experience Points"
                            value={dbUser?.xp || 0}
                        />
                        <InfoCards
                            type="Leaderboard Position"
                            value={dbUser?.leaderboard_position || "N/A"}
                        />
                        <InfoCards
                            type="No. of Quizzes Taken"
                            value={dbUser?.quizzes_taken || 0}
                        />
                        <InfoCards
                            type="Achievements"
                            value={dbUser?.achievements_count || 0}
                        />
                    </div>
                    {/* MIDDLE SECTION QUIZ CARDS */}
                    <div className="flex gap-4 flex-row pt-4">
                        <div className="w-full flex flex-row gap-4 flex-wrap">
                            <QuizCards
                                imageSrc="/assets/images/phishingimg.jpg"
                                title="Phishing Quizzes"
                                description="Test your ability to identify phishing attacks."
                                moreDescription="When a hacker launches a phishing attack, he or she is trying to trick you into believing that the message is from a legitimate source so that you will click the link or download an attachment."
                                quizLink="/quizzes/phishing_quiz"
                            />
                            <QuizCards
                                imageSrc="/assets/images/misdeliveryimg.jpg"
                                title="Misdelivery Quizzes"
                                description="Avoid accidentally sending sensitive information to the wrong recipient."
                                moreDescription="Misdelivery is the act of accidentally sending sensitive information to the wrong recipient, typically through email, like typing the wrong email address or selecting the incorrect recipient from an auto-complete list."
                                quizLink={undefined}
                            />
                            <QuizCards
                                imageSrc="/assets/images/quidproquoimg.jpg"
                                title="Quid Pro Quo Quizzes"
                                description="Test your ability to identify deceptive tactics by cyber attackers."
                                moreDescription="Quid pro quo is a deceptive tactic where a cyber attacker offers a seemingly helpful service or benefit in exchange for sensitive information or access to a system."
                                quizLink={undefined}
                            />
                            <QuizCards
                                imageSrc="/assets/images/pretextingimg.jpg"
                                title="Pretexting Quizzes"
                                description="Test your ability to identify pretexting attacks."
                                moreDescription="Pretexting is a form of social engineering attack in which a scammer creates a plausible scenario to bait victims into divulging sensitive information or making fraudulent payments."
                                quizLink={undefined}
                            />
                        </div>
                    </div>
                    {/* QUIZ TREND GRAPH */}
                    <div className="w-full h-[500px] pt-4 pb-2">
                        <QuizChart />
                    </div>
                </div>
                {/* RIGHT */}
                <div className="w-full lg:w-1/3 flex flex-col gap-8 mr-2">
                    <CalendarView />
                    <LeaderBoard />
                </div>
            </div>
        </>
    );
}

export default function Dashboard() {
    return (
        <UserProvider>
            <DashboardContent />
        </UserProvider>
    );
}