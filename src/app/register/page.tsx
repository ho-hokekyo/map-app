'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Page() {
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string>('');
    const router = useRouter();
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(email, password);

        const res = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        if (res.ok) {
            console.log('login response', res.body);
            router.push('/login');
        } else {
            console.log('error', res.body);
            setError('Invalid credentials');
        }
    };

    return (
        <div className="flex h-screen items-center justify-center bg-violet-950">
            <div className="w-full max-w-md bg-violet-900 p-8 shadow-lg rounded-lg">
                <h2 className="text-2xl font-bold text-center mb-6 text-gray-100">Signin</h2>

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-100">Username</label>
                        <input
                            type="text"
                            className="w-full bg-gray-900 text-gray-100 border border-violet-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
                            value={userName}
                            placeholder="John"
                            onChange={(e) => setUserName(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-100">Email</label>
                        <input
                            type="email"
                            className="w-full bg-gray-900 text-gray-100 border border-violet-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-violet-500 placeholder-gray-400"
                            value={email}
                            placeholder="John@email.com"
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-100">Password</label>
                        <input
                            type="password"
                            className="w-full bg-gray-900 text-gray-100 border border-violet-700 rounded p-2 focus:outline-none focus:ring-2 focus:ring-violet-500"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-violet-700 text-white p-2 rounded hover:bg-violet-600 active:bg-violet-500 active:scale-105"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    );
}
