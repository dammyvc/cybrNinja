"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const data = [
    {
        name: 'Jan',
        questions: 10,


    },
    {
        name: 'Feb',
        questions: 30,

    },
    {
        name: 'Mar',
        questions: 50,

    },
    {
        name: 'Apr',
        questions: 55,

    },
    {
        name: 'May',
        questions: 10,

    },
    {
        name: 'Jun',
        questions: 5,

    },
    {
        name: 'Jul',
        questions: 60,

    },
    {
        name: 'Aug',
        questions: 65,

    },
    {
        name: 'Sep',
        questions: 40,

    },
    {
        name: 'Oct',
        questions: 80,

    },
    {
        name: 'Nov',
        questions: 85,

    },
    {
        name: 'Dec',
        questions: 100,

    },
];


export const QuizChart = () => {
    return (
        <div className="bg-white dark:bg-dark rounded-xl w-full h-full p-4 shadow-md border-t-4 border-primary">
            <div className="flex justify-between items-center pb-2">
                <h2 className="font-bold text-lg">Quiz Statistics</h2>
            </div>
            <ResponsiveContainer width="100%" height="90%">
                <LineChart
                    width={500}
                    height={300}
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill:"#d1d5db"}} />
                    <YAxis axisLine={false} tickLine={false} tick={{fill:"#d1d5db"}} />
                    <Tooltip />
                    <Legend align='center' verticalAlign='top' wrapperStyle={{ paddingTop: "10px", paddingBottom: "30px"}} />
                    
                    <Line type="monotone" dataKey="questions" stroke="#15D17F" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>

        </div>
    )
}

