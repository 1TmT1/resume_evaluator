"use client";

import { Card, CardHeader, CardContent, CardFooter } from "../ui/card";
import { Header } from "./header"; 
import { Social } from "./social";
import { BackButton } from "./back-button";

interface CardWrapperProps {
    children: React.ReactNode;
    header: string;
    backButtonLabel: string;
    backButtonURL: string;
    showSocial?: boolean;
}

export const CardWrapper = ({
    children,
    header,
    backButtonLabel,
    backButtonURL,
    showSocial
}: CardWrapperProps) => {
    return (
        <Card className="shadow-md bg-gray-50 max-w-[80vw]">
            <CardHeader>
                <Header label={header} />
            </CardHeader>
            <CardContent>
                {children}
            </CardContent>
            {showSocial && (
                <CardFooter>
                    <Social />
                </CardFooter>
            )}
            <CardFooter className="w-full flex justify-center">
                <BackButton label={backButtonLabel} href={backButtonURL} />
            </CardFooter>
        </Card>
    )
}