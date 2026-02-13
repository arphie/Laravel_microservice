import { cookies } from 'next/headers';

const audit = async () => {
    const cookieStore = await cookies();
    const user_name = cookieStore.get('user_name')?.value;

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
						<li><a href="/dashboard" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 no-underline">Dashboard</a></li>
						<li><a href="/audit" className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200 no-underline">Audit</a></li>
					</ul>
				</div>
			</div>
            show audit
		</div>
    );
};

export default audit;