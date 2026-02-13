import { IpAddress } from '@/lib/actions/ip';

interface IpListProps {
	ips: IpAddress[];
}

const IpList = ({ ips }: IpListProps) => {
	if (ips.length === 0) {
		return <p className="text-gray-500">No IP addresses found.</p>;
	}

	return (
		<div className="overflow-x-auto rounded-lg border border-gray-200">
			<table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
				<thead className="text-left">
					<tr>
						<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">IP Address</th>
						<th className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">Label</th>
					</tr>
				</thead>
				<tbody className="divide-y divide-gray-200">
					{ips.map((ip) => (
						<tr key={ip.id}>
							<td className="whitespace-nowrap px-4 py-2 font-mono text-gray-700">{ip.address}</td>
							<td className="whitespace-nowrap px-4 py-2 text-gray-700">{ip.label}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default IpList;