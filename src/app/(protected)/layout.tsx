import React from 'react';
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

interface ProtectedLayoutProps {
    children: React.ReactNode;
}

const ProtectedLayout = async({ children }: ProtectedLayoutProps) => {

    const session = await auth();

    return (
        <SessionProvider session={session}>
            <div className='w-full min-h-full h-full bg-gray-100 flex flex-col items-center'>
                {children}
            </div>
        </SessionProvider>
    );
}

export default ProtectedLayout;