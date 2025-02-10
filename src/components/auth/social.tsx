"use client";

import { Button } from "../ui/button";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const Social = () => {

    const onClick = (provider: "google" | "linkedin" | "github") => {
        signIn(provider, {
            callbackUrl: DEFAULT_LOGIN_REDIRECT
        })
    }

    return (
        <div className="w-full flex items-center gap-x-4">
            <Button
            size='lg'
            className="w-full"
            variant='outline'
            onClick={() => onClick('google')}
            >
                <FcGoogle className="h-5 w-5" />
            </Button>
            <Button
            size='lg'
            className="w-full"
            variant='outline'
            onClick={() => onClick('github')}
            >
                <FaGithub className="h-5 w-5" />
            </Button>
            <Button
            size='lg'
            className="w-full"
            variant='outline'
            onClick={() => onClick('linkedin')}
            >
                <FaLinkedin className="h-5 w-5" />
            </Button>
        </div>
    );
}