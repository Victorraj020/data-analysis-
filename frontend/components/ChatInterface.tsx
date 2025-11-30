"use client"

import { useState, useRef, useEffect } from "react"
import { Send, Bot, User, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"

interface Message {
    role: 'user' | 'assistant'
    content: string
}

interface ChatInterfaceProps {
    context: any
}

export function ChatInterface({ context }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Hello! I analyzed your data. Ask me anything about it.' }
    ])
    const [input, setInput] = useState("")
    const [loading, setLoading] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" })
        }
    }, [messages])

    const handleSend = async () => {
        if (!input.trim()) return

        const userMessage = input
        setInput("")
        setMessages(prev => [...prev, { role: 'user', content: userMessage }])
        setLoading(true)

        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"
            const response = await axios.post(`${apiUrl}/chat/`, {
                message: userMessage,
                context: context
            })

            setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }])
        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error processing your request." }])
        } finally {
            setLoading(false)
        }
    }

    return (
        <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3 border-b">
                <CardTitle className="flex items-center text-lg">
                    <Bot className="mr-2 h-5 w-5 text-primary" />
                    Data Assistant
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
                <ScrollArea className="flex-1 p-4">
                    <div className="space-y-4">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`flex items-start max-w-[80%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                                        }`}
                                >
                                    <div
                                        className={`h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.role === 'user' ? 'bg-primary text-primary-foreground ml-2' : 'bg-muted mr-2'
                                            }`}
                                    >
                                        {msg.role === 'user' ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
                                    </div>
                                    <div
                                        className={`p-3 rounded-lg text-sm ${msg.role === 'user'
                                            ? 'bg-primary text-primary-foreground'
                                            : 'bg-muted'
                                            }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="flex items-center space-x-2 bg-muted p-3 rounded-lg ml-10">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                    <span className="text-xs">Thinking...</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>
                <div className="p-4 border-t bg-background">
                    <form
                        onSubmit={(e) => {
                            e.preventDefault()
                            handleSend()
                        }}
                        className="flex space-x-2"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about trends, outliers, or summary..."
                            disabled={loading}
                            className="flex-1"
                        />
                        <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                            <Send className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </CardContent>
        </Card>
    )
}
