import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

export const Layout: React.FC = () => {
    const { currentUser } = useAuth();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <Link to="/" className="flex-shrink-0 flex items-center">
                                <span className="text-2xl font-bold text-primary">ToolPool</span>
                            </Link>
                        </div>
                        <div className="flex items-center space-x-4">
                            <Link to="/tools">
                                <Button variant="ghost">Browse Tools</Button>
                            </Link>
                            {currentUser ? (
                                <>
                                    <Link to="/add-item">
                                        <Button>List a Tool</Button>
                                    </Link>
                                    <Link to="/profile">
                                        <Button variant="outline">Profile</Button>
                                    </Link>
                                </>
                            ) : (
                                <>
                                    <Link to="/login">
                                        <Button variant="ghost">Login</Button>
                                    </Link>
                                    <Link to="/register">
                                        <Button>Sign Up</Button>
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>

            <footer className="bg-white border-t border-gray-200 py-8">
                <div className="max-w-7xl mx-auto px-4 text-center text-gray-500">
                    <p>&copy; {new Date().getFullYear()} ToolPool. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};
