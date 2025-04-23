import React from "react";
import { useNavigate } from "react-router-dom";

const RootPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative min-h-screen flex flex-col">
            {/* Background Slideshow */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <div className="slideshow-container absolute w-full h-full">
                    
                    <div className="slideshow-item bg-[url('https://images.pexels.com/photos/126271/pexels-photo-126271.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]"></div>
                    <div className="slideshow-item bg-[url('https://images.pexels.com/photos/208321/pexels-photo-208321.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]"></div>
                    <div className="slideshow-item bg-[url('https://images.pexels.com/photos/620337/pexels-photo-620337.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]"></div>
                    <div className="slideshow-item bg-[url('https://images.pexels.com/photos/206359/pexels-photo-206359.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]"></div>
                </div>
                
                <div className="absolute inset-0 bg-cyan-900/40 z-10"></div>
            </div>

            {/* Main Content */}
            <header className="relative z-20 flex-1 flex flex-col items-center justify-center text-center px-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
                    Welcome to Your Travel Stories
                </h1>
                <p className="text-lg md:text-xl text-white/90 max-w-xl mb-8">
                    Relive your cherished memories, share your adventures, and explore the
                    world through stories.
                </p>
                <button
                    onClick={() => navigate("/login")}
                    className="px-6 py-3 bg-black text-white text-lg font-semibold rounded-lg shadow-md hover:bg-black focus:outline-none focus:ring-4 focus:ring-cyan-300 transition-transform transform hover:scale-105"
                >
                    Proceed to Login
                </button>
            </header>

            {/* Footer */}
            <footer className="relative z-20 text-white text-center py-6">
                <div className="container mx-auto px-4">
                    <p className="text-sm md:text-base">
                        © {new Date().getFullYear()} Travel Stories. All rights reserved.
                    </p>
                    <p className="mt-2">
                        Built with ❤️ by Your Team |{" Rithik Madhav , Ronith H U , Rakshith Mahesh "}
                        <a
                            href="https://github.com"
                            className="underline hover:text-cyan-200"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            GitHub
                        </a>
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default RootPage;