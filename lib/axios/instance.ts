import environment from "@/config/environment"
import { SessionExtended } from "@/types/auth";
import axios from "axios"
import { getSession } from "next-auth/react";

const headers = {
    "Content-Type": "application/json",
}

const instance = axios.create({
    baseURL: environment.API_URL,
    headers,
    timeout: 60 * 1000
});

instance.interceptors.request.use(
    async (request) => {
        if (typeof window === "undefined") {
            // Jika di server, JANGAN panggil getSession().
            // Langsung kembalikan request apa adanya.
            // (Token harus di-inject manual saat pemanggilan di auth.ts)
            return request;
        }
        const session: SessionExtended | null = await getSession();
        if (session && session.accessToken) {
            request.headers.Authorization = `Bearer ${session.accessToken}`;
        }

        return request;
    },
    (error) => Promise.reject(error)
)

instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error)
);

export default instance;