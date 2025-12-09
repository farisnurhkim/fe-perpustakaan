import Header from '@/components/Header'
import Navigation from '@/components/Navigation';
import { getCurrentUser } from '@/lib/currentUser';
import React from 'react'

const AdminLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getCurrentUser();

    return (
        <>
            <Header user={user} />
            <div className="container bg-slate-950 min-h-screen">
                <div className="mt-8">
                    <Navigation type="admin" />

                    <main className="mt-5">
                        {children}
                    </main>
                </div>
            </div>
        </>
    )
}

export default AdminLayout