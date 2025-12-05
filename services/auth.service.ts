import instance from "@/lib/axios/instance";
import { ILogin, IRegister } from "@/types/auth";

const authServices = {
    register: (payload: IRegister) => instance.post(`/user/register`, payload),
    login: (payload: ILogin) => instance.post(`/user/login`, payload),
    getProfileWithToken: (token: string) => instance.get(`/user/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
};

export default authServices;