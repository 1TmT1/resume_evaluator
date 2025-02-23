"use client";

import { useRouter } from "next/navigation";

interface RegisterButtonProps {
    children: React.ReactNode;
    mode?: 'modal' | 'redirect';
    isChild?: boolean;
}

export const RegisterButton = ({
    children,
    mode = 'redirect',
}: RegisterButtonProps) => {
    const router = useRouter();
    const onClick = () => {
        router.push('/auth/register');
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