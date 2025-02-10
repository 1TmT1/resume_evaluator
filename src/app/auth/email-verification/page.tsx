"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";
import { PropagateLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { emailVerification } from "../../../../actions/verification";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

const NewVerificationPage = () => {
    const searchParams = useSearchParams();

    const token = searchParams.get('token');

    const [success, setSuccess] = useState<string | undefined>('');
    const [error, setError] = useState('');

    const onSubmit = useCallback(async () => {
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
        }
        catch {
            setError('There was an error...');
        }
    }, [token]);

    useEffect(() => {
        onSubmit();
    }, []);

    return (
        <CardWrapper header="Activating your account" backButtonLabel="Home Page" backButtonURL="/">
            <div className="flex w-full flex-col items-center justify-center gap-y-10">
                {error === '' && success === '' && <PropagateLoader />}
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </CardWrapper>
    );
};

export default NewVerificationPage;