"use client";

import { useState } from "react";

import { useRouter } from 'next/navigation'
import React from 'react'
import { signIn } from 'next-auth/react'

const RegisterPage = () => {
    const router = useRouter()  

    const [email, setEmail] = useState(""); 
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [error, setError] = useState("");
    

    const handleRegister = async () => {
        try {
            
        
            const response = await fetch("/api/register",{
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                email: email,
                name: name,
                password: password,
            }),
        });

            if (response.ok) {
                signIn();
                router.push("/");
            }else{
                console.log("Failed to sign up");
            }
        } catch (error) {
            console.error("An unexpected error happened:", error);
            setError("An unexpected error happened");
        }
    };


    return (
        <div>
            <h1>Sign Up</h1>
            <input
                className="text-black"

                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />
            <input
                className="text-black"

                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                className="text-black"

                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegister}>Sign Up</button>
            {error && <p>{error}</p>}
        </div>
    )
}

export default RegisterPage;