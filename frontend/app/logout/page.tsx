// app/logout/page.tsx
import { logoutAction } from '@/lib/actions/auth';

export default function LogoutPage() {
	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-base-100">
			<div className="p-8 shadow-xl bg-base-200 rounded-2xl text-center">
				<h1 className="text-2xl font-bold mb-4">Are you sure you want to logout?</h1>
				<p className="mb-6 text-base-content/70">
					You will need to login again to access the Audit Log Dashboard.
				</p>
				
				<div className="flex gap-4 justify-center">
					{/* Cancel Button */}
					<a href="/dashboard" className="btn btn-ghost">
						Cancel
					</a>

					{/* Logout Button inside a form to trigger Server Action */}
					<form action={logoutAction}>
						<button type="submit" className="btn btn-error">
							Yes, Logout
						</button>
					</form>
				</div>
			</div>
		</div>
	);
}