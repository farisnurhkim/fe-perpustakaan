import instance from "@/lib/axios/instance";
import { ILogin, IRegister } from "@/types/auth";

export interface PayloadUbahProfile {
    nama?: string;
    email?: string;
    no_hp?: string;
    password?: string;
}

export interface PayloadUbahAlamat {
    nama_jalan?: string;
    kecamatan?: string;
    kelurahan?: string;
    kota?: string;
    no_rumah?: string;
}

const authServices = {
    register: (payload: IRegister) => instance.post(`/user/register`, payload),
    login: (payload: ILogin) => instance.post(`/user/login`, payload),
    getProfileWithToken: (token: string) => instance.get(`/user/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }),
    ubahProfile: (payload: PayloadUbahProfile, userId: string) => instance.patch(`/user/ubah/${userId}`, payload),
    ubahAlamat: (alamat: PayloadUbahAlamat, userId: string) => instance.patch(`/user/ubah-alamat/${userId}`, alamat),
};

export default authServices;