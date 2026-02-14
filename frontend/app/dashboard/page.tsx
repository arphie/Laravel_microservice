import { getIpList } from '@/lib/actions/ip';
import IpList from '@/component/IpList';
import IpToolbar from '@/component/IpToolbar';
import Menu from '@/component/menu';

import { cookies } from 'next/headers';

const DashboardPage = async () => {
	// Fetch data on the server before the page is rendered.
	const [ipData] = await Promise.all([getIpList()]);

	const cookieStore = await cookies();
	const user_role = cookieStore.get('user_role')?.value;
	const user_name = cookieStore.get('user_name')?.value;

	const userRole = user_role as "admin" | "user" | undefined;
	console.log('User role from cookie:', user_role);

	return (
		<div className="container mx-auto p-4 md:p-8">
			<Menu />
			
			<IpToolbar />
			<IpList ips={ipData} userRole={userRole} />
		</div>
	);
};

export default DashboardPage;