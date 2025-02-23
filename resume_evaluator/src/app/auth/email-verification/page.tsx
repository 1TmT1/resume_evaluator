"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { PropagateLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { Suspense, useCallback, useEffect, useState } from "react";
import { emailVerification } from "../../../../actions/verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { useRouter } from "next/navigation"; 

const NewVerificationPage = () => {
    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    const [success, setSuccess] = useState<string | undefined>('');
    const [error, setError] = useState('');

    const router = useRouter();

    const onSubmit = useCallback(async () => {
        if (success || error) return;
        
        if (!token) {
            setError('Missing token');
            return;
        }
        try {
            const res = await emailVerification(token);
            if (res.error) {
                setError(res.error);
                return;
            }
            setSuccess(res.success);
            setError('');
        }
        catch {
            setError('There was an error...');
        }
    }, [token, success, error]);

    useEffect(() => {
        onSubmit();
        if (error || success) {
            const timer = setTimeout(() => {
                router.push('/auth/login');
            }, 5000);
         
            return () => clearTimeout(timer);
        }
    }, [onSubmit, router, error, success]);

    return (
        <CardWrapper header="Activating your account" backButtonLabel="Home Page" backButtonURL="/">
            <div className="flex w-full flex-col items-center justify-center gap-y-10">
                {error === '' && success === '' && <PropagateLoader />}
                <FormSuccess message={success} />
                {!success && (
                    <FormError message={error} />
                )}
            </div>
        </CardWrapper>
    );
};

const Page = () => {
    return (
        <Suspense>
            <NewVerificationPage />
        </Suspense>
    );
}

export default Page;