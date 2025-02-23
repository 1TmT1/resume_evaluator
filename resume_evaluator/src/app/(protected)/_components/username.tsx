'use client';
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function Username() {
    const {data: session} = useSession();
    const [username, setUsername] = useState('');
    useEffect(() => {
        setUsername(session?.user?.name?session?.user?.name:'user');
    }, [session])

    return (
        <p>Hello, { username }!</p>
    );
}