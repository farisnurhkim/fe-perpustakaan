/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { ILogin } from "@/types/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod"

const LoginSchema = z.object({
    email: z.string().email("Invalid email").min(1, "Email wajib di isi!"),
    password: z.string().min(1, "Password wajib di isi!")
});

type LoginInput = z.infer<typeof LoginSchema>;

const useLogin = () => {
    const router = useRouter();
    const [visiblePassword, setVisiblePassword] = useState(false);

    const form = useForm<LoginInput>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const { setError, reset } = form;

    const loginService = async (payload: ILogin) => {
        const result = await signIn("credentials", {
            ...payload,
            redirect: false,
        });

        if (result?.error) {
            if (result.error === "CredentialsSignin") {
                 throw new Error("Email atau password salah!");
            }
            throw new Error(result.error); 
        }
        
        return result; 
    }

    const { mutate, isPending } = useMutation({
        mutationFn: loginService,
        onError(error: any) {
            const message = error?.response?.data?.message || error.message || "Terjadi Kesalahan";
            
            setError("root", {
                message
            });

            toast.error(message)
        },
        onSuccess(result: any) {
            toast.success("Berhasil login!");
            router.refresh();
            reset();
            router.replace("/")
        },
    });

    const onSubmit = (data: LoginInput) => mutate(data);

    return {
        setVisiblePassword,
        visiblePassword,
        form,
        onSubmit,
        isPending
    }
}


export default useLogin;