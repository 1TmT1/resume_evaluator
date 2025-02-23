"use client";

import { CardWrapper } from "./card-wrapper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import { Input } from "../ui/input";
import * as z from 'zod';
import { RegisterSchema } from "@/schemas";
import { Button } from "../ui/button";
import { FormError } from "../form-error";
import { FormSuccess } from "../form-success";
import { register } from "../../../actions/register";
import { useTransition, useState } from "react";

export const RegisterForm = () => {

    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            name: '',
            password: '',
        }
    });

    const [isPending, startTransition] = useTransition();

    const onSubmit = (values: z.infer<typeof RegisterSchema>) => {
        setError('');
        setSuccess('');

        startTransition(async () => {
            const res = await register(values);
            setError(res.error || '');
            setSuccess(res.success || '');
            form.setValue('email', values.email.toLowerCase());
            form.resetField('password');
        });
    }

    return (
        <CardWrapper
         header="Register Form"
         backButtonLabel="Already have an account"
         backButtonURL="/auth/login"
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
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input {...field} type="text" disabled={isPending} />
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
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <Button type="submit" className="w-full" disabled={isPending}>Create an account</Button>
                </form>
            </Form>
        </CardWrapper>
    );
}