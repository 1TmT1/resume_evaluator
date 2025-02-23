"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import * as z from 'zod';
import { ResetPasswordSchema } from "@/schemas";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { resetPassword } from "../../../actions/resetPassword";
import { useTransition, useState } from "react";

export const ForgotPasswordForm = () => {
    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: '',
        }
    });

    const [isPending, startTransition] = useTransition();

    const onSubmit = (values: z.infer<typeof ResetPasswordSchema>) => {
        setError('');
        setSuccess('');

        startTransition(async () => {
            const res = await resetPassword(values);
            setError(res?.error || '');
            setSuccess(res?.success || '');
        });
    }

    return (
        <CardWrapper
         header="Forgot my password"
         backButtonLabel="Login Page"
         backButtonURL="/auth/login"
        >
            <Form {...form}>
                <form action="POST" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <FormField 
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input {...field} type="email" disabled={isPending} />
                                </FormControl>
                                <FormMessage className="font-semibold" />
                            </FormItem>
                        )}/>
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full" disabled={isPending}>Get password reset link</Button>
                </form>
            </Form>
        </CardWrapper>
    );
}