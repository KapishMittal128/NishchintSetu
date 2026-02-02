'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Shield, LogOut, Bot, Settings, Activity, Send, User, Loader2, MessageSquareWarning } from 'lucide-react';
import { useAppState } from '@/hooks/use-app-state';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { GuidedAssistanceManager } from '@/components/app/guided-assistance-manager';
import { LanguageToggle } from '@/components/app/language-toggle';
import { ThemeToggle } from '@/components/app/theme-toggle';
import { chat, ChatInput } from '@/ai/flows/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { SmsListener } from '@/components/app/sms-listener';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export default function ChatbotPage() {
    const { signOut } = useAppState();
    const router = useRouter();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: "Hello! I'm Nishchint, your personal safety assistant. How can I help you stay safe today?"
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSignOut = () => {
        signOut();
        router.push('/landing');
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const chatInput: ChatInput = {
                history: messages,
                message: input,
            };
            const result = await chat(chatInput);
            const modelMessage: Message = { role: 'model', content: result.response };
            setMessages(prev => [...prev, modelMessage]);
        } catch (error) {
            console.error('Error calling chatbot flow:', error);
            const errorMessage: Message = { role: 'model', content: "I'm sorry, I'm having trouble connecting right now. Please try again later." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };
    
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTo({
                top: scrollAreaRef.current.scrollHeight,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    return (
        <div className="flex min-h-screen">
            <SmsListener />
            <GuidedAssistanceManager />
            <aside className="w-60 bg-background/80 border-r p-4 flex flex-col">
                <h1 className="text-2xl font-semibold mb-8">Nishchint Setu</h1>
                <nav className="flex-1 space-y-2">
                    <Link href="/dashboard" passHref>
                        <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-dashboard">
                            <Home className="mr-2 h-5 w-5" />
                            Dashboard
                        </Button>
                    </Link>
                    <Link href="/monitoring" passHref>
                        <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-monitoring">
                            <Shield className="mr-2 h-5 w-5" />
                            Monitoring
                        </Button>
                    </Link>
                    <Link href="/activity" passHref>
                        <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-activity">
                            <Activity className="mr-2 h-5 w-5" />
                            Activity Log
                        </Button>
                    </Link>
                    <Link href="/sms-safety" passHref>
                        <Button variant="ghost" className="w-full justify-start text-base" data-trackable-id="nav-sms-safety">
                            <MessageSquareWarning className="mr-2 h-5 w-5" />
                            SMS Safety
                        </Button>
                    </Link>
                    <Link href="/chatbot" passHref>
                        <Button variant="secondary" className="w-full justify-start text-base" data-trackable-id="nav-chatbot">
                            <Bot className="mr-2 h-5 w-5" />
                            AI Chatbot
                        </Button>
                    </Link>
                </nav>
                <div className="space-y-2">
                    <Link href="/user/profile" passHref>
                        <Button variant="outline" className="w-full justify-start text-base" data-trackable-id="nav-profile-settings">
                            <Settings className="mr-2 h-5 w-5" />
                            Profile Settings
                        </Button>
                    </Link>
                    <Button variant="outline" className="w-full justify-start text-base" onClick={handleSignOut} data-trackable-id="nav-signout">
                        <LogOut className="mr-2 h-5 w-5" />
                        Sign Out
                    </Button>
                </div>
            </aside>
            <main className="flex-1 flex flex-col overflow-hidden bg-muted/20">
                <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 border-b bg-background/80 px-4 md:px-6 backdrop-blur-xl">
                    <h1 className="text-2xl font-semibold">AI Safety Chatbot</h1>
                    <div className="flex items-center gap-2">
                        <LanguageToggle />
                        <ThemeToggle />
                    </div>
                </header>
                <div className="flex-1 flex flex-col p-6 gap-6">
                    <Card className="flex-1 flex flex-col animate-in fade-in-0">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Bot /> Nishchint Assistant</CardTitle>
                            <CardDescription>Your personal AI assistant to help you with scam prevention.</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 flex flex-col gap-4">
                            <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
                                <div className="space-y-6">
                                    {messages.map((message, index) => (
                                        <div key={index} className={`flex items-start gap-4 ${message.role === 'user' ? 'justify-end' : ''}`}>
                                            {message.role === 'model' && (
                                                <Avatar className="h-9 w-9 border-2 border-primary">
                                                    <AvatarFallback><Bot size={20}/></AvatarFallback>
                                                </Avatar>
                                            )}
                                            <div className={`max-w-md rounded-xl p-4 ${message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'}`}>
                                                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                                            </div>
                                             {message.role === 'user' && (
                                                <Avatar className="h-9 w-9">
                                                     <AvatarFallback><User size={20} /></AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    ))}
                                    {isLoading && (
                                         <div className="flex items-start gap-4">
                                            <Avatar className="h-9 w-9 border-2 border-primary">
                                                <AvatarFallback><Bot size={20}/></AvatarFallback>
                                            </Avatar>
                                            <div className="max-w-md rounded-xl p-4 bg-secondary flex items-center">
                                                <Loader2 className="h-5 w-5 animate-spin"/>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </ScrollArea>
                            <form onSubmit={handleSendMessage} className="flex items-center gap-4 pt-4 border-t">
                                <Input 
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    placeholder="Ask about a scam or for safety tips..." 
                                    className="flex-1" 
                                    disabled={isLoading}
                                />
                                <Button type="submit" disabled={isLoading || !input.trim()} data-trackable-id="send-chat-message">
                                    <Send className="h-5 w-5" />
                                    <span className="sr-only">Send</span>
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
