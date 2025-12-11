/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCurrentUser } from '@/lib/currentUser'
import DashboardAdmin from './DashboardAdmin'
import { getStatsDashboard } from '@/lib/getStatsDashboard';

export const dynamic = "force-dynamic";

const Page = async () => {
    const user = await getCurrentUser();
    const stats = await getStatsDashboard(user);

    return (
        <>
            <DashboardAdmin stats={stats} />
        </>
    )
}

export default Page