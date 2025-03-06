"use client";

import { useState, useEffect } from "react";
import Button from "./Button";
import Links from "./Links";

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const toggleMenu = () => {
        setMenuOpen((prev) => !prev);
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    // Close menu if clicked outside of it
    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent) => {
            const cardContainer = document.getElementById('cardContainer');
            if (cardContainer && !cardContainer.contains(event.target as Node | null) && menuOpen) {
                closeMenu();
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        // Cleanup event listener on component unmount
        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [menuOpen]);

    return (
        <nav className="dark:background-dark">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative w-full flex h-16 items-center justify-between">

                    {/* Logo Left Side */}
                    <div className="flex items-center">
                        <a href="/" aria-label="Home">
                            <img
                                alt="cybrninja_logo"
                                src="/black_logo.png"
                                className="w-auto"
                            />
                        </a>
                    </div>

                    {/* Menu Middle (Hidden for smaller screens) */}
                    <div className="sm:hidden flex justify-center space-x-4">
                        <a
                            href="#"
                            className="text-dark hover:text-secondary rounded-md px-3 py-2 text-sm font-medium"
                        >
                            How it Works
                        </a>
                        <a
                            href="#"
                            className="text-dark hover:text-secondary rounded-md px-3 py-2 text-sm font-medium"
                        >
                            Contact
                        </a>
                    </div>

                    {/* Right Side Menu (Hidden for smaller screens) */}
                    <div className="sm:hidden flex items-center space-x-4">
                        <Button text="Login" className="border border-primary hover:border-0 hover:text-white hover:bg-secondary" />
                        <Button text="Sign Up" className="bg-primary text-white hover:bg-secondary" />
                    </div>

                    <div className="hidden sm:flex items-center space-x-4">
                        <button onClick={toggleMenu}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="lucide lucide-menu dark:stroke-light"
                            >
                                <line x1="4" x2="20" y1="12" y2="12" />
                                <line x1="4" x2="20" y1="6" y2="6" />
                                <line x1="4" x2="20" y1="18" y2="18" />
                            </svg>
                        </button>
                    </div>

                </div>

                <div
                    className={`fixed top-0 right-0 h-full overflow-hidden bg-background bg-opacity-90 shadow-lg transition-all duration-300 z-50 dark:bg-dark ${menuOpen ? 'w-[350px]' : 'w-0'
                        }`}
                >
                    <button
                        onClick={closeMenu}
                        className="text-red-500 absolute top-6 right-6 z-30"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="32"
                            height="32"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-x"
                        >
                            <path d="M18 6 6 18" />
                            <path d="m6 6 12 12" />
                        </svg>
                    </button>

                    <div className="w-full h-full px-8 py-16 relative !text-dark dark:!text-light">
                        <div className="w-full h-auto flex flex-col mt-1">
                            <div className="w-full h-auto flex items-center gap-x-4 text-partnership hover:text-gray-100 hover:bg-partnership rounded-md px-4 py-3 ease-out duration-500 cursor-pointer dark:text-light">
                                <Links
                                    href="#"
                                    title="How it Works"
                                    className="text-dark hover:bg-secondary hover:text-white rounded-md px-3 py-2 text-base font-medium"
                                    onClick={closeMenu}
                                />
                            </div>

                            <div className="w-full h-auto flex items-center gap-x-2 text-dark hover:text-gray-100 hover:bg-partnership rounded-md px-4 py-3 ease-out duration-500 cursor-pointer dark:text-light">
                                <Links
                                    href="#"
                                    title="Contact"
                                    className="text-dark hover:bg-secondary hover:text-white rounded-md px-3 py-2 text-base font-medium"
                                    onClick={closeMenu}
                                />
                            </div>

                            <div className="flex items-center space-x-4 mt-4 ml-4">
                                <Button text="Login" className="border border-primary hover:border-0 hover:text-white hover:bg-secondary text-base" />
                                <Button text="Sign Up" className="bg-primary text-white hover:bg-secondary text-base" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
