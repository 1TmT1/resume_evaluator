"use client";

import { useRouter } from "next/navigation";

interface LoginButtonProps {
    children: React.ReactNode;
    mode?: 'modal' | 'redirect';
    isChild?: boolean;
}

export const LoginButton = ({
    children,
    mode = 'redirect',
}: LoginButtonProps) => {
    const router = useRouter();
    const onClick = () => {
        router.push('/auth/login');
    }

    if (mode === 'modal') {
        return (
            <span>
                Implement Modal
            </span>
        );
    }

    return (
        <span onClick={onClick} className="cursor-pointer block w-full">
            {children}
        </span>
    );
};