import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export const Home: React.FC = () => {
    return (
        <div className="flex flex-col items-center">
            <section className="w-full py-20 text-center bg-gradient-to-b from-white to-gray-50 rounded-3xl mb-12">
                <h1 className="text-5xl font-extrabold tracking-tight text-secondary sm:text-6xl mb-6">
                    Find the <span className="text-primary">tools</span> you need, nearby.
                </h1>
                <p className="mt-4 text-xl text-gray-500 max-w-2xl mx-auto mb-10">
                    Borrow tools from your neighbors or lend your own. Save money, reduce waste, and build community with ToolPool.
                </p>
                <div className="flex justify-center gap-4">
                    <Link to="/tools">
                        <Button size="lg">Browse Tools</Button>
                    </Link>
                    <Link to="/add-item">
                        <Button variant="outline" size="lg">List a Tool</Button>
                    </Link>
                </div>
            </section>

            <section className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 px-4">
                <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                        🛠️
                    </div>
                    <h3 className="text-xl font-bold mb-2">Borrow</h3>
                    <p className="text-gray-600">Find the right tool for your project without buying it.</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                        🤝
                    </div>
                    <h3 className="text-xl font-bold mb-2">Lend</h3>
                    <p className="text-gray-600">Help your neighbors and earn some extra cash.</p>
                </div>
                <div className="text-center p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-primary text-2xl">
                        🌍
                    </div>
                    <h3 className="text-xl font-bold mb-2">Community</h3>
                    <p className="text-gray-600">Connect with people in your local area.</p>
                </div>
            </section>
        </div>
    );
};
