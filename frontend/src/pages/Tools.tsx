import React, { useEffect, useState } from 'react';
import { collection, query, onSnapshot, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { ToolCard } from '../components/ToolCard';
import { Input } from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Tool {
    id: string;
    name: string;
    description: string;
    pricePerDay: number;
    imageUrl?: string;
    category: string;
    ownerId: string;
}

export const Tools: React.FC = () => {
    const [tools, setTools] = useState<Tool[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [category, setCategory] = useState('all');
    const { currentUser } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        // Only show available tools
        // Note: You might need to add logic to only show 'available' tools if you implement status
        const q = query(collection(db, 'tools'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const toolsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as Tool[];
            setTools(toolsData);
            setLoading(false);
        }, (error) => {
            console.error("Error fetching tools:", error);
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const handleBorrow = async (tool: Tool) => {
        if (!currentUser) {
            alert("Please login to borrow tools.");
            navigate('/login');
            return;
        }

        if (currentUser.uid === tool.ownerId) {
            alert("You cannot borrow your own tool.");
            return;
        }

        try {
            await addDoc(collection(db, 'requests'), {
                toolId: tool.id,
                toolName: tool.name,
                ownerId: tool.ownerId,
                borrowerId: currentUser.uid,
                borrowerEmail: currentUser.email,
                status: 'pending',
                timestamp: serverTimestamp()
            });
            alert('Request sent successfully!');
        } catch (error) {
            console.error("Error creating request:", error);
            alert('Failed to send request.');
        }
    };

    const filteredTools = tools.filter(tool => {
        const matchesSearch = tool.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tool.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = category === 'all' || tool.category === category;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-secondary">Browse Tools</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1">
                    <Input
                        placeholder="Search tools..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full"
                    />
                </div>
                <select
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="all">All Categories</option>
                    <option value="power-tools">Power Tools</option>
                    <option value="gardening">Gardening</option>
                    <option value="cleaning">Cleaning</option>
                    <option value="other">Other</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading tools...</div>
            ) : filteredTools.length === 0 ? (
                <div className="text-center py-12 text-gray-500">No tools found matching your criteria.</div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredTools.map(tool => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                            onBorrow={handleBorrow}
                            isOwner={currentUser?.uid === tool.ownerId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
