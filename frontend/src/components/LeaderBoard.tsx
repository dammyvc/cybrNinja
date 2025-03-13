"use client"

const leaders = [
    {
        rank: 1,
        name: "@cyberpro",
        xp: 200
    },
    {
        rank: 2,
        name: "@johndoe",
        xp: 150
    },
    {
        rank: 3,
        name: "@johndoe",
        xp: 0
    },
    {
        rank: 4,
        name: "@johndoe",
        xp: 0
    },
    {
        rank: 5,
        name: "@johndoe",
        xp: 0
    },
    {
        rank: 6,
        name: "@johndoe",
        xp: 0
    },
    {
        rank: 7,
        name: "@johndoe",
        xp: 0
    },
    {
        rank: 8,
        name: "@johndoe",
        xp: 0
    },
    {
        rank: 9,
        name: "@johndoe",
        xp: 0
    },
    
]


export const LeaderBoard = () => {
    return (
        <div className="bg-white dark:bg-dark p-4 rounded-xl shadow-md w-full border-t-4 border-secondary">
            <h2 className="font-bold text-lg pb-4">Leaderboard</h2>
    <table className="w-full text-left border-collapse">
        {/* Table Headings */}
        <thead>
            <tr className="border-b border-gray-300 dark:border-gray-700">
                <th className="p-2 font-semibold">Rank</th>
                <th className="p-2 font-semibold">User</th>
                <th className="p-2 font-semibold text-right">XP</th>
            </tr>
        </thead>
        
        {/* Table Body */}
        <tbody>
            {leaders.map((leader) => (
                <tr key={leader.rank} className="border-b border-gray-200 dark:border-gray-700">
                    <td className="p-2">{leader.rank}</td>
                    <td className="p-2">{leader.name}</td>
                    <td className="p-2 text-right">{leader.xp}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>
    )
}