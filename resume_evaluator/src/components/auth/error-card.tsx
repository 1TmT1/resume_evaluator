import { Header } from "./header";
import { BackButton } from "./back-button";
import { Card, CardHeader, CardFooter } from "../ui/card";
import React from "react";

export const ErrorCard = () => {
    return (
        <Card className="shadow-md">
            <CardHeader>
                <Header label="An error occurred" />
            </CardHeader>
            <CardFooter className="flex justify-center items-center">
                <BackButton label="Login Page" href="/auth/login" />
            </CardFooter>
        </Card>
    );
}