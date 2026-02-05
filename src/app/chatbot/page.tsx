'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Bot, Send, User, Loader2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { chat, ChatInput } from '@/ai/flows/chatbot';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/context/translation-context';
import { UserLayout } from '@/components/app/user-layout';

type Message = {
    role: 'user' | 'model';
    content: string;
};

export default function ChatbotPage() {
    const { t } = useTranslation();
    const [messages, setMessages] = useState<Message[]>([
        {
            role: 'model',
            content: t('chatbot.initialMessage')
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMessages([{ role: 'model', content: t('chatbot.initialMessage') }]);
    }, [t]);

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
            const errorMessage: Message = { role: 'model', content: t('chatbot.errorMessage') };
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
        <UserLayout title={t('chatbot.title')}>
            <div className="flex-1 flex flex-col h-[calc(100vh-10rem)]">
                <Card className="flex-1 flex flex-col animate-in fade-in-0">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Bot /> {t('chatbot.cardTitle')}</CardTitle>
                        <CardDescription>{t('chatbot.cardDescription')}</CardDescription>
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
                                placeholder={t('chatbot.inputPlaceholder')}
                                className="flex-1" 
                                disabled={isLoading}
                            />
                            <Button type="submit" disabled={isLoading || !input.trim()} data-trackable-id="send-chat-message">
                                <Send className="h-5 w-5" />
                                <span className="sr-only">{t('chatbot.send')}</span>
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </UserLayout>
    );
}
