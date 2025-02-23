import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Link from "next/link";

const font = Poppins({
    subsets: ['latin'],
    weight: ['600'],
});

interface HeaderProps {
    label: string;
}

export const Header = ({ label }:HeaderProps) => {
    return (
        <div className='w-full flex flex-col items-center gap-y-6'>
            <Link href='/'>
            <h1 className={cn('text-6xl text-center select-none cursor-pointer transition-opacity duration-300 hover:opacity-60', font.className)}>
                Resume Evaluator
            </h1>
            </Link>
            <p className="text-muted-foreground text-2xl select-none">
                {label}
            </p>
        </div>
    );
}