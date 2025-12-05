/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import authServices from "@/services/auth.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";

const RegisterSchema = z.object({
    nama: z.string().min(1, "Fullname wajib diisi"),
    email: z.string().email("Invalid email").min(1, "Email wajib diisi"),
    password: z.string().min(8, "Minimal 8 Characters"),
    confirmPassword: z.string().min(1, "Confirm Password wajib diisi"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Paasword tidak sesuai",
    path: ["confirmPassword"],
});

type RegisterInput = z.infer<typeof RegisterSchema>;

const useRegister = () => {
    const [visiblePassword, setVisiblePassword] = useState({
        password: false,
        confirmPassword: false,
    });

    const handleVisiblePassword = (key: "password" | "confirmPassword") => {
        setVisiblePassword({
            ...visiblePassword,
            [key]: !visiblePassword[key],
        })
    }

    const form = useForm<RegisterInput>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            nama: "",
            email: "",
            password: "",
            confirmPassword: "",
        }
    });

    const { setError, reset } = form;

    const registerService = async (data: RegisterInput) => {
        const result = await authServices.register(data);
        return result;
    }

    const { mutate, isPending } = useMutation({
        mutationFn: registerService,
        onError(error: any) {
            const message = error.response?.data?.message || error.message ||  "Terjadi kesalahan";            
            setError("root", {
                message,
            });
            toast.error(message);
        },
        onSuccess(data) {
            reset();
            toast.success(data.data.message || "Registrasi berhasil! Silahkan login.");
        }
    })

    const onSubmit = (data: RegisterInput) => mutate(data);

    return {
        handleVisiblePassword,
        visiblePassword,
        form,
        onSubmit,
        isPending,
    }
}

export default useRegister;