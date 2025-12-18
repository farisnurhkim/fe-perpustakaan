import Header from '@/components/Header'
import Navigation from '@/components/Navigation';
import { ReactQueryProvider } from '@/components/provider/ReactQueryProvider';
import { getCurrentUser } from '@/lib/currentUser';
import { SessionProvider } from 'next-auth/react';
import React from 'react'

const MemberLayout = async ({ children }: { children: React.ReactNode }) => {
    const user = await getCurrentUser();

    return (
        <>
            <Header user={user} />
            <div className="container bg-slate-950 min-h-screen">
                <div className="mt-8">
                    <Navigation type="member" />

                    <main className="mt-5">
                        <ReactQueryProvider>
                            <SessionProvider>
                                {children}
                            </SessionProvider>
                        </ReactQueryProvider>
                    </main>
                </div>
            </div>
        </>
    )
}

export default MemberLayout