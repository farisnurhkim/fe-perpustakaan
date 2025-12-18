/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand'
import { IBuku } from "@/types/model";


export interface CartItems {
    buku: IBuku;
    qty: number;
}

interface Cart {
    items: CartItems[];
    addToCart: (book: IBuku) => void;
    removeFromCart: (id: string) => void;
    increment: (id: string) => void;
    decrement: (id: string) => void;
    clear: () => void;
}

export const useCart = create<Cart>((set) => ({
    items: [],
    addToCart: (book: IBuku) => set((state) => {
        const existingItem = state.items.find(item => item.buku._id === book._id);
        if (existingItem) {
            return {
                items: state.items.map(item => item.buku._id === book._id ? {...item, qty: item.qty + 1} : item)
            }
        }

        return {
            items: [...state.items, {buku: book, qty: 1}]
        }
    }),
    removeFromCart: (id: string) => set((state) => {
        const newData = state.items.filter(item => item.buku._id !== id);
        return {
            items: newData  
        }
    }),
    increment: (id: string) => set((state) => {
        const newData = state.items.map(item => {
            if (item.buku._id === id) {
                return {...item, qty: item.qty + 1}
            }

            return item
        })

        return {
            items: newData
        }
    }),
    decrement: (id: string) => set((state) => {
        const newData = state.items.map(item => {
            if (item.buku._id === id) {
                return {...item, qty: item.qty - 1}
            }

            return item
        }).filter((item) => item.qty > 0)

         return {
            items: newData
        }
    }),
    clear: () => set({
        items: []
    })
}))