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
import { useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function LoginForm() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleSubmit = () => {
        const url = 'http://localhost:8080/api/login';
        const data = { email, password };
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
            throw new Error('Login failed');
        }).then((data) => {
            console.log('Login:', JSON.stringify(data));
            toast.success('You are now logged in!');
            localStorage.setItem('token', data.jwt);
            localStorage.setItem('email', data.user.email);
            router.push('/dashboard');
        }).catch((error) => {
            console.error('Error:', error);
            toast.error('Login failed');
        });
    };
    return (
        <Card className="w-full max-w-sm">
            <CardHeader>
                <CardTitle className="text-2xl text-center">Welcome back!</CardTitle>
                <CardDescription className="text-center">
                    Enter your email below to login to your account.
                </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email"
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="m@example.com" required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input id="password"
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="********"
                        type="password" required />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="w-full" onClick={handleSubmit}>
                    Log in
                </Button>
            </CardFooter>
            <div className="text-center pb-4 pt-1">
                Don&apos;t have an account?{' '}
                <Link href="/signup" className="underline">
                    Sign up
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