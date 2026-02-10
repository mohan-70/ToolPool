import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../contexts/AuthContext';
import { ToolCard } from '../components/ToolCard';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

interface Request {
    id: string;
    toolName: string;
    borrowerEmail: string;
    status: string;
    // ... other fields
}

export const Profile: React.FC = () => {
    const { currentUser } = useAuth();
    const [myTools, setMyTools] = useState<any[]>([]);
    const [incomingRequests, setIncomingRequests] = useState<Request[]>([]);
    const [outgoingRequests, setOutgoingRequests] = useState<Request[]>([]);

    useEffect(() => {
        if (!currentUser) return;

        // Fetch My Tools
        const toolsQuery = query(collection(db, 'tools'), where('ownerId', '==', currentUser.uid));
        const unsubscribeTools = onSnapshot(toolsQuery, (snapshot) => {
            setMyTools(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        // Fetch Incoming Requests (people requesting my tools)
        const incomingQuery = query(collection(db, 'requests'), where('ownerId', '==', currentUser.uid));
        const unsubscribeIncoming = onSnapshot(incomingQuery, (snapshot) => {
            setIncomingRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request)));
        });

        // Fetch Outgoing Requests (tools I requested)
        const outgoingQuery = query(collection(db, 'requests'), where('borrowerId', '==', currentUser.uid));
        const unsubscribeOutgoing = onSnapshot(outgoingQuery, (snapshot) => {
            setOutgoingRequests(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Request)));
        });

        return () => {
            unsubscribeTools();
            unsubscribeIncoming();
            unsubscribeOutgoing();
        };
    }, [currentUser]);

    if (!currentUser) return <div>Please login.</div>;

    return (
        <div className="container mx-auto px-4 py-8 space-y-8">
            <h1 className="text-3xl font-bold mb-4">My Profile</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader><CardTitle>Incoming Requests</CardTitle></CardHeader>
                    <CardContent>
                        {incomingRequests.length === 0 ? (
                            <p className="text-gray-500">No requests yet.</p>
                        ) : (
                            <ul className="space-y-4">
                                {incomingRequests.map(req => (
                                    <li key={req.id} className="border-b pb-2">
                                        <p><strong>{req.borrowerEmail}</strong> requested <strong>{req.toolName}</strong></p>
                                        <div className="text-sm text-gray-500">Status: {req.status}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader><CardTitle>My Borrow Requests</CardTitle></CardHeader>
                    <CardContent>
                        {outgoingRequests.length === 0 ? (
                            <p className="text-gray-500">You haven't requested any tools.</p>
                        ) : (
                            <ul className="space-y-4">
                                {outgoingRequests.map(req => (
                                    <li key={req.id} className="border-b pb-2">
                                        <p>Result for <strong>{req.toolName}</strong></p>
                                        <div className="text-sm text-gray-500">Status: {req.status}</div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </CardContent>
                </Card>
            </div>

            <h2 className="text-2xl font-bold mt-8 mb-4">My Tools</h2>
            {myTools.length === 0 ? (
                <p className="text-gray-500">You haven't listed any tools yet.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myTools.map(tool => (
                        <ToolCard key={tool.id} tool={tool} isOwner={true} />
                    ))}
                </div>
            )}
        </div>
    );
};
