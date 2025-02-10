"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import * as z from 'zod';
import { LoginSchema } from "@/schemas";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { login } from "../../../actions/login";
import { useTransition, useState } from "react";
import { useSearchParams } from "next/navigation";

export const LoginForm = () => {
    const searchParams = useSearchParams();
    const urlError = searchParams.get('error') === "OAuthAccountNotLinked" 
    ? "Email already used by different provider":
    "";

    const [success, setSuccess] = useState<string>('');
    const [error, setError] = useState<string>('');

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        }
    });

    const [isPending, startTransition] = useTransition();

    const onSubmit = (values: z.infer<typeof LoginSchema>) => {
        setError('');
        setSuccess('');

        startTransition(async () => {
            const res = await login(values);
            setError(res?.error || '');
            setSuccess(res?.success || '');
        });
    }

    return (
        <CardWrapper
         header="Login Form"
         backButtonLabel="Create an account"
         backButtonURL="/auth/register"
         showSocial
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
                        <FormField 
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input {...field} type="password" disabled={isPending} />
                                </FormControl>
                                <FormMessage className="font-semibold" />
                            </FormItem>
                        )}/>
                    </div>
                    <FormError message={error || urlError} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full" disabled={isPending}>Login</Button>
                </form>
            </Form>
        </CardWrapper>
    );
}