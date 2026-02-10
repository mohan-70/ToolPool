import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

export const AddItem: React.FC = () => {
    const { currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: 'power-tools',
        pricePerDay: '',
        imageUrl: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser) return;

        setLoading(true);
        try {
            await addDoc(collection(db, 'tools'), {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                pricePerDay: Number(formData.pricePerDay),
                imageUrl: formData.imageUrl,
                ownerId: currentUser.uid,
                ownerEmail: currentUser.email,
                status: 'available',
                createdAt: serverTimestamp()
            });
            alert('Tool listed successfully!');
            navigate('/tools');
        } catch (error) {
            console.error("Error adding document: ", error);
            alert('Failed to list tool.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-8">
            <Card>
                <CardHeader>
                    <CardTitle>List a New Tool</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Tool Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Cordless Drill"
                        />

                        <div className="flex flex-col gap-1.5">
                            <label className="text-sm font-medium">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                placeholder="Describe the condition and features..."
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium">Category</label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                >
                                    <option value="power-tools">Power Tools</option>
                                    <option value="gardening">Gardening</option>
                                    <option value="cleaning">Cleaning</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <Input
                                label="Price per Day ($)"
                                name="pricePerDay"
                                type="number"
                                min="0"
                                step="0.01"
                                value={formData.pricePerDay}
                                onChange={handleChange}
                                required
                                placeholder="0.00"
                            />
                        </div>

                        <Input
                            label="Image URL (Optional)"
                            name="imageUrl"
                            value={formData.imageUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                        />

                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Listing...' : 'List Tool'}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};
