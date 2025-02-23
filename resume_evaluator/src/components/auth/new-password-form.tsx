"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import * as z from 'zod';
import { NewPasswordSchema } from "@/schemas";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { newPassword } from "../../../actions/newPassword";
import { useTransition, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export const NewPasswordForm = () => {
    const router = useRouter();

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    

    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        }
    });

    const [isPending, startTransition] = useTransition();

    const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
        setError('');
        setSuccess('');

        startTransition(async () => {
            const res = await newPassword(values, token);
            setError(res?.error || '');
            setSuccess(res?.success || '');
        });
    }

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                router.push('/auth/login');
            }, 3000);
            
            return () => clearTimeout(timer);
        }
    }, [router, error, success]);

    return (
        <CardWrapper
         header="Enter a new password"
         backButtonLabel="Login Page"
         backButtonURL="/auth/login"
        >
            <Form {...form}>
                <form action="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField 
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>New Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" disabled={isPending} />
                                </FormControl>
                                <FormMessage className="font-semibold" />
                            </FormItem>
                        )}/>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full" disabled={isPending}>Reset Your Password</Button>
                </form>
            </Form>
        </CardWrapper>
    );
}