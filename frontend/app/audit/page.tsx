import { cookies } from 'next/headers';
import Link from 'next/link';
import { fetchAuditLogs } from '@/lib/actions/audit';
import Menu from '@/component/menu';


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
			<Menu />
            <div className='pt-3' >
                <ul className="list bg-base-100 rounded-box shadow-md">
                    {auditLogs.length > 0 ? (
                        auditLogs.map((log) => (
                            <li className="list-row" key={log.id}>
                                <div className="text-4xl font-thin opacity-30 tabular-nums">
                                    {(log.user_id == null) ? (
                                        <div>X</div>
                                    ) : (
                                        <div>{log.user_id}</div>
                                    )}
                                    
                                </div>
                                <div>
                                    <div><span className='badge badge-soft badge-info'>{log.action}</span> | <span className='badge badge-soft badge-warning'>{log.method}</span> | <span className='badge badge-soft badge-neutral'>{new Date(log.created_at).toLocaleString()}</span></div>
                                    <div className="text-xs uppercase font-semibold opacity-60 pt-2">{JSON.stringify(log.request_data, null, 2)}</div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="p-4 pb-2 text-xs opacity-60 tracking-wide">No audit logs found.</li>
                    )}
                    
                </ul>
            </div>

            <div className="flex justify-between items-center mt-6">
                <div>&nbsp;</div>
                <div className="flex items-center gap-2">
                    <Link href={`/audit?page=${currentPage > 1 ? currentPage - 1 : 1}`} className={`btn btn-accent ${currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        Previous
                    </Link>
                    {(!(total_entry < parseInt(perPage))) && (
                        <Link href={`/audit?page=${currentPage >= 1 ? currentPage + 1 : 1}`} className={`btn btn-accent ${total_entry < parseInt(perPage) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            Next
                        </Link>
                    )}
                    
                </div>
            </div>
		</div>
    );
};

export default audit;