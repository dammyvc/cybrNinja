"use client";
import { cn } from "@/lib/utils";

export const HowItWorks = () => {
    return <section className="pb-10">
        <div className="container">
            <h2 className="container text-4xl font-semibold text-center leading-tight text-black dark:text-white pt-10">
                How it Works

            </h2>
        </div>
        <div className="container max-w-7xl w-full pt-8 ">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                <div
                    className={cn(
                        "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
                        "bg-[url(https://images.unsplash.com/photo-1476842634003-7dcca8f832de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80)] bg-cover",
                        // Preload hover image by setting it in a pseudo-element
                        "before:bg-[url(https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXBtdWE5dWtkb3o5YzB5Y296cXo2NWF4ZWt6MnE5aTRrams1MGNmbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jyzjPmdKLm2fslKG8C/giphy.gif)] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
                        "hover:bg-[url(https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExaXBtdWE5dWtkb3o5YzB5Y296cXo2NWF4ZWt6MnE5aTRrams1MGNmbyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/jyzjPmdKLm2fslKG8C/giphy.gif)]",
                        "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
                        "transition-all duration-500"
                    )}
                >
                    <div className="text relative z-50">
                        <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative">
                            Sign Up & Get Started
                        </h1>
                        <p className="font-normal text-base text-gray-50 relative my-4">
                            Create your free account and set up your profile. No experience? No problem! CybrNinja will tailor the experience to your skill level.
                        </p>
                    </div>
                </div>

                <div
                    className={cn(
                        "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
                        "bg-[url(https://images.unsplash.com/photo-1476842634003-7dcca8f832de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80)] bg-cover",
                        // Preload hover image by setting it in a pseudo-element
                        "before:bg-[url(https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmpsdjJuanF1eTF5ZDE2dzB4YjJ1cXZ4NDE2ZTUxM2FwODh6d2FhcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0huDAdTHsuzT50D4in/giphy.gif)] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
                        "hover:bg-[url(https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmpsdjJuanF1eTF5ZDE2dzB4YjJ1cXZ4NDE2ZTUxM2FwODh6d2FhcyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/0huDAdTHsuzT50D4in/giphy.gif)]",
                        "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
                        "transition-all duration-500"
                    )}
                >
                    <div className="text relative z-50">
                        <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative">
                            Train with AI-Powered Quizzes
                        </h1>
                        <p className="font-normal text-base text-gray-50 relative my-4">
                            Take interactive cybersecurity quizzes that adapt to your performance. Learn through real-time feedback and AI-driven coaching.
                        </p>
                    </div>
                </div>

                <div
                    className={cn(
                        "group w-full cursor-pointer overflow-hidden relative card h-96 rounded-md shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
                        "bg-[url(https://images.unsplash.com/photo-1476842634003-7dcca8f832de?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80)] bg-cover",
                        // Preload hover image by setting it in a pseudo-element
                        "before:bg-[url(https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl4Z3hsbnMxZjN5c24xaTZxMWRtbHd5YWxub2FpNWlvaXB2N3JveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qUDenOaWmXImQ/giphy.gif)] before:fixed before:inset-0 before:opacity-0 before:z-[-1]",
                        "hover:bg-[url(https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExMGl4Z3hsbnMxZjN5c24xaTZxMWRtbHd5YWxub2FpNWlvaXB2N3JveSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/qUDenOaWmXImQ/giphy.gif)]",
                        "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
                        "transition-all duration-500"
                    )}
                >
                    <div className="text relative z-50">
                        <h1 className="font-bold text-xl md:text-3xl text-gray-50 relative">
                            Level Up & Stay Ahead
                        </h1>
                        <p className="font-normal text-base text-gray-50 relative my-4">
                            Earn points, climb leaderboards, and unlock new challenges as you improve your cybersecurity skills. Compete with others and track your progress!
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>;
};

export default HowItWorks;



