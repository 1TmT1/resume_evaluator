"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut } from 'next-auth/react';
import Username from './username';
import { IoLogOut } from "react-icons/io5";
import { MdQueryStats } from "react-icons/md";
import { GiCardExchange } from "react-icons/gi";

type NavbarProps = {
    isUserUploadedCV: boolean;
    setUploadedCV: Dispatch<SetStateAction<boolean>>;
    isLoading: boolean;
    firstCV: boolean;
    setFirstCV: Dispatch<SetStateAction<boolean>>;
};

export const Navbar = ({ isUserUploadedCV, setUploadedCV, isLoading, firstCV, setFirstCV }: NavbarProps) => {
    const [hasShadow, setHasShadow] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setHasShadow(true);
            } else {
                setHasShadow(false);
            }
        };

        window.addEventListener('scroll', handleScroll);

        const handleResize = () => {
            if (window.innerWidth <= 1024) {
                setIsMobile(true);
            }
        }

        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleResize);
        }
    }, [isLoading]);

    const onClickLogout = () => signOut();

    const onClickChangeCV = () => {
        if (isUserUploadedCV) {
            setFirstCV(false);
        }
        setUploadedCV(!isUserUploadedCV)
    };

    return (
        <nav className={`bg-white w-full gap-4 h-fit flex flex-row justify-between items-center p-4 sticky top-0 border-b-2 transition-shadow duration-300 z-50 ${hasShadow ? "shadow-lg" : "shadow-sm"}`}>
            <section className='flex flex-row items-center gap-x-8'>
                <Link href='/' className='transition duration-300 hover:opacity-80'>
                    <Image 
                    src="/logo.png"
                    width={75}
                    height={75}
                    alt="Resume Evaluator logo"
                    className='rounded-sm border-r-2 border-b-2 border-white duration-300 hover:border-black'
                    />
                </Link>
                <div className='select-none'>
                    <p>Resume Evaluator</p>
                    <Username />
                </div>
            </section>
            <Button disabled={isLoading || firstCV} onClick={onClickChangeCV} size='lg' className='bg-blue-800 hover:bg-blue-400 select-none'>{!firstCV && isUserUploadedCV ? (isMobile ? <GiCardExchange /> : "Change CV") : (isMobile ? <MdQueryStats /> : "Return to evaluation")}</Button>
            <Button onClick={onClickLogout} size='lg' className='bg-red-800 hover:bg-red-600 select-none'>{isMobile ? <IoLogOut /> : "Logout"}</Button>
        </nav>
    );
}

