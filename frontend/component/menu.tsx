import { cookies } from 'next/headers';
    
const mainmenu = async () => {
    const cookieStore = await cookies();
	const user_role = cookieStore.get('user_role')?.value;
    const user_name = cookieStore.get('user_name')?.value;

    return (
        <div className='grid grid-cols-2'>
            <div className=''>
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Hi {user_name}!</h1>
                </div>
            </div>
            <div className=''>
                <ul className='flex justify-end w-full gap-2'>
                    <li><a href="/dashboard" className="btn btn-neutral hover:btn-accent">Dashboard</a></li>
                    { (user_role === 'admin') && (
                        <li><a href="/audit" className="btn btn-neutral hover:btn-accent">Audit</a></li>
                    )}
                    <li className="btn btn-neutral hover:btn-error"><a href="/logout">Logout</a></li>
                </ul>
            </div>
        </div>
        
    )
}

export default mainmenu;