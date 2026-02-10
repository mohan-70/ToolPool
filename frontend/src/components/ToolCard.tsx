import React from 'react';
import { Button } from './ui/Button';
import { Card, CardContent } from './ui/Card';

interface Tool {
    id: string;
    name: string;
    description: string;
    pricePerDay: number;
    imageUrl?: string;
    category: string;
    ownerId: string;
}

interface ToolCardProps {
    tool: Tool;
    onBorrow?: (tool: Tool) => void;
    isOwner?: boolean;
}

export const ToolCard: React.FC<ToolCardProps> = ({ tool, onBorrow, isOwner }) => {
    return (
        <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="aspect-video w-full overflow-hidden bg-gray-100 relative">
                <img
                    src={tool.imageUrl || 'https://via.placeholder.com/400x300?text=No+Image'}
                    alt={tool.name}
                    className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-primary shadow-sm">
                    ${tool.pricePerDay}/day
                </div>
            </div>
            <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="font-bold text-lg leading-tight truncate">{tool.name}</h3>
                        <span className="text-xs text-gray-500 capitalize">{tool.category}</span>
                    </div>
                </div>
                <p className="text-gray-600 text-sm line-clamp-2 mb-4 h-10">
                    {tool.description || "No description available."}
                </p>

                {isOwner ? (
                    <div className="text-center w-full py-2 bg-gray-100 text-gray-600 text-sm rounded cursor-default border border-gray-200">
                        Your Listing
                    </div>
                ) : (
                    <Button
                        className="w-full"
                        onClick={() => onBorrow && onBorrow(tool)}
                        variant="secondary"
                    >
                        Borrow Request
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};
