"use client";

import { useSession, signOut } from "next-auth/react";

export default function Dashboard() {

    const session = useSession();

    const onClick = () => signOut();

    return (
        <div className="bg-white p-10">
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <h1>Dashboard</h1>
            <button onClick={onClick}>Sign Out</button>
        </div>
    );
}