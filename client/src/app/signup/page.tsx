'use client';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { toast } from 'sonner';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isInvestor, setIsInvestor] = useState(false);
    const [name, setName] = useState('');
    const router = useRouter();

    const handleSubmit = () => {
        const url = 'http://localhost:8080/api/signup';
        const data = { name, email, password };
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        }).then((response) => {
            if (response.ok) {
                return response.json();
            }
            throw new Error('Signup failed');
        }).then((data) => {
            console.log('Signup:', JSON.stringify(data));
            toast.success('You are now signed up!');
            localStorage.setItem('email', email);
            router.push('/login');
        }).catch((error) => {
            console.error('Error:', error);
            toast.error('Signup failed');
        });
    };
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl text-center">
                    Welcome to{' '}
                    <Link href="/" className="underline">
                        FinGenius
                    </Link>
                </CardTitle>
                <CardDescription className="text-center">
                    Enter your details below to create an account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" type="name"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password" type="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleSubmit}>
                    Sign up
                </Button>
            </CardFooter>
            <div className="text-center pb-4 pt-1">
                Already have an account?{' '}
                <Link href="/login" className="underline">
                    Log in
                </Link>
            </div>
        </Card>
    );
}

export default function LoginPage() {
    return (
        <div className="flex items-center justify-center w-full min-h-screen">
            <LoginForm />
        </div>
    );
}