// src/components/Chatbot.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { Button } from '../ui/button';

interface Message {
    user: string;
    text: string;
}

const Analyser: React.FC = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [query, setQuery] = useState<string>('');

    const handleSend = async () => {
        if (query.trim() === '') return;

        const newMessage: Message = { user: 'User', text: query };
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        const formData = new FormData();

        try {
            formData.append('query', query);
            formData.append('userId', localStorage.getItem('userId') || '');
            const response = await axios.post('http://localhost:8000/analyser-bot', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            const botMessage: Message = { user: 'Bot', text: response.data.response };
            setMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error:', error);
            const errorMessage: Message = { user: 'Bot', text: 'Sorry, something went wrong.' };
            setMessages((prevMessages) => [...prevMessages, errorMessage]);
        }

        setQuery('');
    };

    return (
        <div className="flex flex-col items-center justify-center pt-10 mx-8">
            <div className="w-full bg-shadow-lg rounded-lg">
                <div className="h-96 overflow-y-auto border border-gray-300 p-4 rounded-lg bg-gray-50 mb-5">
                    {messages.map((message, index) => (
                        <div key={index} className={`mb-3 flex ${message.user === 'User' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`inline-block px-4 py-2 rounded-lg ${message.user === 'User' ? 'bg-black text-white' : 'bg-gray-300 text-gray-800'}`}>
                                {message.text}
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex items-center">
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 mr-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                    />
                    <Button
                        onClick={handleSend}
                        className="text-white px-4 py-3 rounded-lg hover:bg-gray-500 focus:outline-none focus:ring-2"
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default Analyser;
