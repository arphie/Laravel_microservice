import { getIpList } from '@/lib/actions/ip';
import IpList from '@/component/IpList';

const DashboardPage = async () => {
	// Fetch data on the server before the page is rendered.
	const ipData = await getIpList();

	return (
		<div className="mx-auto p-4 md:p-8">
			<div className="flex justify-between items-center mb-6">
				<h1 className="text-2xl font-bold text-white-800">Dashboard</h1>
			</div>

			<h2 className="text-xl font-semibold text-white-700 mb-4">IP Management</h2>
			<IpList ips={ipData} />
		</div>
	);
};

export default DashboardPage;