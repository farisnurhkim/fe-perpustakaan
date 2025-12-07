import { getCurrentUser } from '@/lib/currentUser'
import DashboardAdmin from './DashboardAdmin'

const Page = async () => {
    const user = await getCurrentUser();
    return (
        <>
            <DashboardAdmin user={user} />
        </>
    )
}

export default Page