import { useQuery } from "@tanstack/react-query";
import { Book, Terminal, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { apiClient } from "@/lib/api";
import { NavLink } from "react-router";

export default function Home() {
    const query = useQuery({
        queryKey: ["agents"],
        queryFn: () => apiClient.getAgents(),
        refetchInterval: 5_000
    });

    const agents = query?.data?.agents;
    const contractAddress = "DHsFSANzm3eBSAbTQX4MTJrJG8JZJTRcaXFjgp7dpump";

    return (
        <div className="flex flex-col items-center min-h-screen gradient-bg p-4">
            {/* Header Section */}
            <div className="text-center mb-12 mt-16">
                <h1 className="text-5xl font-bold mb-8 text-primary purple-glow">
                    Nayari AI Assistant
                </h1>
                <div className="mb-12">
                    <h2 className="text-xl mb-2 text-muted-foreground">Contract Address</h2>
                    <code className="bg-card px-6 py-3 rounded-lg text-sm font-mono">
                        {contractAddress}
                    </code>
                </div>
            </div>

            {/* Main Actions */}
            <div className="flex flex-col md:flex-row gap-4 w-full max-w-3xl justify-center mb-16">
                <NavLink to="/docs" className="w-full md:w-auto">
                    <Button
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-3 text-lg"
                        size="lg"
                    >
                        <Book className="w-6 h-6" />
                        Documentation
                    </Button>
                </NavLink>

                <NavLink to="/terminal" className="w-full md:w-auto">
                    <Button
                        className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-3 text-lg"
                        size="lg"
                    >
                        <Terminal className="w-6 h-6" />
                        Open Terminal
                    </Button>
                </NavLink>

                {agents && agents[0] && (
                    <NavLink to={`/chat/${agents[0].id}`} className="w-full md:w-auto">
                        <Button
                            className="w-full h-16 bg-primary hover:bg-primary/90 text-primary-foreground flex items-center gap-3 text-lg"
                            size="lg"
                        >
                            <MessageSquare className="w-6 h-6" />
                            Chat with AI
                        </Button>
                    </NavLink>
                )}
            </div>

            {/* Status Section */}
            <div className="text-center mb-8">
                <p className="text-muted-foreground">
                    {agents ?
                        `Connected to ${agents.length} AI agent${agents.length !== 1 ? 's' : ''}` :
                        'Connecting to AI agents...'}
                </p>
            </div>
        </div>
    );
}
