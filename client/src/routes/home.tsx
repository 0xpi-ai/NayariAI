import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { Terminal as TerminalIcon, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { apiClient } from "@/lib/api";
import { Link } from "react-router-dom";
import Chat from "@/components/chat";
import { UUID } from "@elizaos/core";

interface AgentResponse {
    agents: Array<{
        id: UUID;
        character?: {
            name: string;
        };
    }>;
}

export default function Home() {
    const [showMenu, setShowMenu] = React.useState({ terminal: false, wallet: false });
    const query = useQuery<AgentResponse>({
        queryKey: ["agents"],
        queryFn: async () => {
            console.log("Fetching agents...");
            const result = await apiClient.getAgents();
            console.log("Agents result:", result);
            return result;
        },
        refetchInterval: 5000,
        retry: 3,
        retryDelay: 1000,
        initialData: { agents: [] }
    });

    React.useEffect(() => {
        console.log("Query state:", {
            isLoading: query.isLoading,
            isError: query.isError,
            isSuccess: query.isSuccess,
            data: query.data
        });
    }, [query.data, query.isLoading, query.isError, query.isSuccess]);

    React.useEffect(() => {
        if (query.data?.agents?.length > 0) {
            console.log("Agents loaded:", {
                firstAgent: query.data.agents[0],
                totalAgents: query.data.agents.length
            });
        }
    }, [query.data?.agents]);

    const agents = query.data?.agents || [];

    return (
        <div className="h-screen flex flex-col overflow-hidden bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900 via-black to-purple-900">
            {/* Header */}
            <div className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-black/50 to-transparent">
                <div className="container mx-auto px-4">
                    <h1 className="text-2xl font-bold text-white py-4">Nayari AI</h1>
                </div>
            </div>

            <div className="container mx-auto px-4 relative flex flex-col flex-1 max-h-[calc(100vh-4rem)]">
                {/* Floating Navigation - aligned with container */}
                <nav className="absolute top-4 right-0 z-50">
                    <div className="bg-white/5 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10">
                        <div className="flex items-center space-x-8">
                            <Link to="/" className="text-white/80 hover:text-white transition-colors">Overview</Link>
                            <Link to="/settings" className="text-white/60 hover:text-white transition-colors">Settings</Link>
                            <button
                                onClick={() => setShowMenu(prev => ({ ...prev, terminal: !prev.terminal }))}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <TerminalIcon className="w-5 h-5" />
                            </button>
                            <button
                                onClick={() => setShowMenu(prev => ({ ...prev, wallet: !prev.wallet }))}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <Wallet className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Terminal Popup */}
                    {showMenu.terminal && (
                        <div className="absolute top-16 right-0 w-[600px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg">
                            <div className="bg-card rounded-lg p-4 font-mono text-sm h-[400px] overflow-y-auto">
                                <div className="mb-4 text-blue-500 font-semibold">
                                    Nayari AI Terminal v1.0.0
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Wallet Popup */}
                    {showMenu.wallet && (
                        <div className="absolute top-16 right-0 w-[400px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-lg p-4">
                            <Card className="bg-black/40 border-white/10 backdrop-blur-sm">
                                <CardHeader className="border-b border-white/10">
                                    <div className="flex items-center space-x-2">
                                        <Wallet className="w-4 h-4 text-white/70" />
                                        <CardTitle className="text-white text-sm">Connect Wallet</CardTitle>
                                    </div>
                                </CardHeader>
                                <CardContent className="p-6">
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="aspect-square w-32 rounded-lg bg-black/20 flex items-center justify-center border border-white/10 mb-4">
                                            {/* QR Code Placeholder */}
                                            <div className="w-24 h-24 bg-white/5 rounded-lg"></div>
                                        </div>
                                        <Button className="w-full bg-blue-500 hover:bg-blue-600">
                                            Connect Wallet
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    )}
                </nav>

                <div className="flex-1 pt-24 pb-6 flex flex-col">
                    {/* Main Section */}
                    <div className="grid grid-cols-12 gap-6 h-[600px]">
                        {/* Left Column - AI Image */}
                        <div className="col-span-4">
                            <Card className="bg-black/40 border-white/10 backdrop-blur-sm h-full">
                                <CardContent className="p-6 flex flex-col h-full">
                                    <div className="flex-1 aspect-auto rounded-lg overflow-hidden mb-6">
                                        <img
                                            src="/website_nayari.jpg"
                                            alt="Nayari AI"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <div className={`w-2 h-2 rounded-full ${agents.length ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                                            <span className="text-white/70">
                                                {agents.length ? 'Online and Ready' : 'Connecting...'}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="text-sm text-white/60">System Status</div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <div
                                                    className="h-2 bg-blue-500 rounded-full transition-all duration-500 ease-out"
                                                    style={{ width: agents.length ? "100%" : "0%" }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Right Column - Chat */}
                        <div className="col-span-8">
                            <Card className="bg-black/40 border-white/10 backdrop-blur-sm h-full flex flex-col">
                                <CardHeader className="border-b border-white/10 flex-none">
                                    <CardTitle className="text-white">Start a Conversation</CardTitle>
                                </CardHeader>
                                <CardContent className="flex-1 min-h-0 p-0 overflow-hidden">
                                    <div className="h-full flex flex-col [&>div]:h-full [&>div]:!p-0 [&_.bg-card]:!bg-black/40 [&_form]:!bg-black/40 [&_form]:!border-white/10 [&_.ChatInput]:!bg-transparent [&_.ChatInput]:!border-none [&_.ChatInput]:!text-white [&_.ChatInput]:placeholder:!text-white/40 [&_.ChatBubble]:!bg-black/40 [&_.ChatBubble]:!border-white/10 [&_button]:!bg-blue-500 [&_button]:hover:!bg-blue-600 [&_button.ghost]:!bg-transparent">
                                        {(() => {
                                            console.log("Rendering chat container with state:", {
                                                isError: query.isError,
                                                hasData: !!query.data,
                                                agentsLength: agents.length,
                                                firstAgentId: agents[0]?.id
                                            });

                                            if (query.isError) {
                                                return (
                                                    <div className="flex items-center justify-center h-full text-white/60">
                                                        Error connecting to AI agent. Please try again.
                                                    </div>
                                                );
                                            }

                                            if (!query.data || !agents.length) {
                                                return (
                                                    <div className="flex items-center justify-center h-full text-white/60">
                                                        Connecting to AI agent...
                                                    </div>
                                                );
                                            }

                                            console.log("Mounting Chat component with agentId:", agents[0].id);
                                            return (
                                                <div className="flex-1 min-h-0 overflow-hidden">
                                                    <Chat
                                                        key={agents[0].id}
                                                        agentId={agents[0].id}
                                                    />
                                                </div>
                                            );
                                        })()}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}