import { cookies } from 'next/headers';
import Link from 'next/link';
import { fetchAuditLogs } from '@/lib/actions/audit';


const audit = async ({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) => {
    const cookieStore = await cookies();
    const user_name = cookieStore.get('user_name')?.value;

    const params = await searchParams;

    const page = (params.page as string) ?? '1';
    const perPage = '10'; // Or get from searchParams if you want it to be dynamic

    // Fetch data using the new library function
    const { auditLogs, meta } = await fetchAuditLogs(page, perPage);

    const currentPage = meta?.current_page ?? 1;
    const total_entry = auditLogs.length;

    console.log('currentPage -> '+currentPage);


    return (
        <div className="container mx-auto p-4 md:p-8">
			<div className='grid grid-cols-2'>
				<div className=''>
					<div className="flex justify-between items-center mb-6">
						<h1 className="text-2xl font-bold text-gray-800">Hi {user_name}!</h1>
					</div>
				</div>
				<div className=''>
					<ul className='flex justify-end w-full gap-2'>
						<li><Link href="/dashboard" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 no-underline">Dashboard</Link></li>
						<li><Link href="/audit" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 no-underline">Audit</Link></li>
					</ul>
				</div>
			</div>
            <div className="mt-8 bg-white shadow-md rounded-lg overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-600">
                    <thead className="text-xs text-gray-700 uppercase bg-gray-100">
                        <tr>
                            <th scope="col" className="px-6 py-3">User</th>
                            <th scope="col" className="px-6 py-3">Event</th>
                            <th scope="col" className="px-6 py-3">Auditable Type</th>
                            <th scope="col" className="px-6 py-3">Data</th>
                            <th scope="col" className="px-6 py-3">Timestamp</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auditLogs.length > 0 ? (
                            auditLogs.map((log) => (
                                <tr key={log.id} className="bg-white border-b hover:bg-gray-50">
                                    <td className="px-6 py-4">{log.user_id}</td>
                                    <td className="px-6 py-4">{log.action}</td>
                                    <td className="px-6 py-4">{log.method}</td>
                                    <td className="px-6 py-4 max-w-[300px]">
                                        <pre className="overflow-auto max-h-40 text-xs bg-gray-50 p-2 rounded border">
                                            {JSON.stringify(log.request_data, null, 2)}
                                        </pre>
                                    </td>
                                    <td className="px-6 py-4">{new Date(log.created_at).toLocaleString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="text-center py-8 text-gray-500">No audit logs found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* {meta && meta.total > meta.per_page && ( */}
                 <div className="flex justify-between items-center mt-6">
                    <div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Link href={`/audit?page=${currentPage > 1 ? currentPage - 1 : 1}`} className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Previous
                        </Link>
                        <Link href={`/audit?page=${currentPage >= 1 ? currentPage + 1 : 1}`} className={`px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 ${total_entry < parseInt(perPage) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Next
                        </Link>
                    </div>
                </div>
            {/* )} */}
		</div>
    );
};

export default audit;