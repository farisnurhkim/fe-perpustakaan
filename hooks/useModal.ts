/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { IBuku } from "@/types/model";

export type ModalType = "bukuDipinjam" | "peminjamanPending" | "pengembalianPending" | "keterlambatan" | "createBuku" | "editBuku" | "deleteBuku" | "detailBuku" | "successPeminjaman" | "konfirmasiPeminjaman" | "konfirmasiPengembalian" | "strukPeminjaman" | "strukPengembalian" | "scanPeminjaman" | "scanPengembalian" | "ubahProfile" | "ubahAlamat";

export interface ModalData {
    peminjaman?: any;
    buku?: IBuku | any;
    peminjamanUser?: any;
}

interface Modal {
    isOpen: boolean;
    modalType: ModalType | null;
    onOpen: (type: ModalType, data?: ModalData) => void;
    onClose: () => void;
    data: ModalData;
}

export const useModal = create<Modal>((set) => ({
    modalType: null,
    isOpen: false,
    data: {},
    onOpen: (type: ModalType, data?: ModalData) => set({data, modalType: type, isOpen: true}),
    onClose: () => set({modalType: null, isOpen: false, data: {}})
}))