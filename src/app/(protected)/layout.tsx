import React from 'react';
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import { Navbar } from './_components/navbar';

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = async ({ children }: ProtectedLayoutProps) => {

    const session = await auth();

    return (
        <SessionProvider session={session}>
            <div className='w-full h-full'>
                <Navbar />
                {children}
            </div>
        </SessionProvider>
    );
}

export default ProtectedLayout;