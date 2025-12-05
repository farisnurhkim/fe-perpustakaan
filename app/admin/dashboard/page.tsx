import DashboardAdmin from './DashboardAdmin'
import { SessionProvider } from "next-auth/react"

const Page = () => {
    return (
        <>
            <SessionProvider>
                <DashboardAdmin />
            </SessionProvider>
        </>
    )
}

export default Page