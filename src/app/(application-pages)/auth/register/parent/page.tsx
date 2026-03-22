'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterInput } from '@/src/lib/validation/authSchema';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from '@/src/components/ui/button';
import { Input } from '@/src/components/ui/input';
import { Label } from '@/src/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/src/components/ui/card';
import { Checkbox } from '@/src/components/ui/checkbox';
import Link from 'next/link';

export default function ParentRegisterPage() {
    const router = useRouter();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
        formState: { errors, isSubmitting }
    } = useForm<RegisterInput>({
        resolver: zodResolver(registerSchema) as any,
        defaultValues: { fullname: '', email: '', password: '', role: 'PARENT', phoneNumber: '', agreeTerms: false }
    });

    const [file, setFile] = React.useState<File | null>(null);
    const [photoFile, setPhotoFile] = React.useState<File | null>(null);

    const onSubmit = async (data: RegisterInput) => {
        try {
            const formData = new FormData();
            formData.append('fullname', data.fullname);
            formData.append('email', data.email);
            formData.append('password', data.password);
            formData.append('phoneNumber', data.phoneNumber);
            formData.append('role', 'PARENT');
            if (photoFile) {
                formData.append('profilePhoto', photoFile);
            }
            if (file) {
                formData.append('verificationDocument', file);
            }

            const response = await axios.post('/api/auth/register', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            console.log("User created successfully:", response.data);
            router.push(`/auth/login/parent`);
        } catch (error: unknown) {
            console.error("Registration failed:", error);
            const err = error as any;
            console.error("Registration failed:", err?.response?.data?.message || err?.message || "Registration failed due to server error.");
            // alert(error?.response?.data?.message || error?.message || "Registration failed due to server error.");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Parent Registration</CardTitle>
                    <CardDescription>Create an account to manage your children&apos;s learning</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                        <div className="space-y-2">
                            <Label htmlFor="fullname">Full Name</Label>
                            <Input id="fullname" placeholder="John Doe" {...register('fullname')} />
                            {errors.fullname && <p className="text-red-500 text-sm">{errors.fullname.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="m@example.com" {...register('email')} />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Phone Number</Label>
                            <Input id="phoneNumber" type="tel" placeholder="+91 9876543210" {...register('phoneNumber')} />
                            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="profilePhoto">Profile Photo (Optional)</Label>
                            <Input
                                id="profilePhoto"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setPhotoFile(e.target.files?.[0] || null)}
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" type="password" placeholder="********" {...register('password')} />
                            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="document">Identity Proof (Optional)</Label>
                            <Input
                                id="document"
                                type="file"
                                accept="image/*,.pdf"
                                onChange={(e) => setFile(e.target.files?.[0] || null)}
                            />
                            <p className="text-xs text-muted-foreground">Upload a valid ID (Aadhaar, PAN, etc.)</p>
                        </div>

                        <div className="flex items-center space-x-2 pt-2">
                           <Checkbox 
                               id="terms" 
                               checked={watch('agreeTerms')} 
                               onCheckedChange={(checked) => setValue('agreeTerms', checked as boolean, { shouldValidate: true })}
                           />
                           <label htmlFor="terms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                               I agree to the <Link href="/terms" className="text-primary hover:underline" target="_blank">Terms & Conditions</Link> and <Link href="/privacy" className="text-primary hover:underline" target="_blank">Privacy Policy</Link>.
                           </label>
                        </div>
                        {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms.message}</p>}

                        <Button type="submit" className="w-full" disabled={isSubmitting || !watch('agreeTerms')}>
                            {isSubmitting ? ((photoFile || file) ? 'Uploading...' : 'Registering...') : 'Register as Parent'}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-center flex-col gap-2">
                    <p className="text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/auth/login/parent" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                    <Link href="/auth/register" className="text-sm text-muted-foreground hover:underline">
                        Back to Register Options
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
