"use client";

import { useState, useEffect } from "react";
import Dropzone from "@/components/ui/dropzone";
import { Details } from "../_components/details";
import { evaluateCV } from "../../../../actions/evaluateCV";
import Loading from "@/components/ui/loading";
import { Navbar } from "../_components/navbar";

export default function Dashboard () {
    const [isUserUploadedCV, setUploadedCV] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);
    const [cvDetails, setCvDetails] = useState<string | null | undefined>(undefined);
    const [firstCV, setFirstCV] = useState(true);


    useEffect(() => {
        const fetchUserCV = async () => {
            try {
                setError(false);
                const res = await fetch('/api/find-user');
                if (!res.ok) {
                    throw new Error("Error fetching user details...");
                }

                const user = await res.json();
                if (user == null) throw new Error("Error fetching user details...");

                const fileCID = user.message;

                if (fileCID) {
                    setFirstCV(false);
                    setUploadedCV(true);
                    const evaluation = await evaluateCV(fileCID);
                    setCvDetails(evaluation);
                }
            } catch (err){
                console.log(err);
                setError(true);
            } finally {
                setIsLoading(false);
            }
        };

        if (isLoading) fetchUserCV();
    }, [isUserUploadedCV, isLoading]);

    return (
    <div className="h-fit w-full bg-gray-100">
        <Navbar isUserUploadedCV={isUserUploadedCV} setUploadedCV={setUploadedCV} isLoading={isLoading} firstCV={firstCV} setFirstCV={setFirstCV} />
        { error ? (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> 
                <p className="bg-white rounded-lg shadow-sm p-10 text-4xl text-red-500 text-center">There was an error<br/><br/>Try refreshing the page or login again</p>
            </div>
        ) : 
        (isLoading ?
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"> 
            <Loading />
        </div> 
        : 
        ( isUserUploadedCV && cvDetails ? (
            <div className="flex-1 p-8 bg-gray-100">
                {/* {!isUserUploadedCV && <Dropzone isUserUploadedCV={isUserUploadedCV} setIsUserUploadedCV={setUploadedCV} setIsLoading={setIsLoading} />} */}
                <Details cvDetails={cvDetails} setError={setError} />
            </div>
        ) : (
            <Dropzone isUserUploadedCV={isUserUploadedCV} setIsUserUploadedCV={setUploadedCV} setIsLoading={setIsLoading} />
        ))
        )}
    </div>
    );
};
