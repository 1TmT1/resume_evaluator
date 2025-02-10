"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export const Navbar = () => {
    const [hasShadow, setHasShadow] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                setHasShadow(true);
            } else {
                setHasShadow(false);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={`bg-white flex flex-row justify-between items-center p-4 sticky top-0 border-b-2 transition-shadow duration-300 z-50 ${hasShadow ? "shadow-lg" : "shadow-sm"}`}>
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
                <p>Hello Tal</p>
            </section>
            <Link href='/' className='transition duration-300 hover:opacity-80'>
                <Button size='lg' className='bg-red-800 hover:bg-red-600'>Logout</Button>
            </Link>
        </nav>
    );
}