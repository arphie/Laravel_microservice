'use client';

import { useState } from 'react';
import { useFormStatus } from 'react-dom';
import { deleteIpAction } from '@/lib/actions/ip';
import { IpAddress } from '@/lib/actions/ip';
import EditIpModal from '@/component/EditIpModal';

interface IpListProps {
	ips: IpAddress[];
	userRole?: 'admin' | 'user' | undefined;
}

function DeleteButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="btn btn-secondary"
		>
			{pending ? 'Deleting...' : 'Delete'}
		</button>
	);
}

const IpList = ({ ips, userRole }: IpListProps) => {
	const [isEditModalOpen, setEditModalOpen] = useState(false);
	const [selectedIp, setSelectedIp] = useState<IpAddress | null>(null);

	if (ips.length === 0) {
		return <p className="text-gray-500">No IP addresses found.</p>;
	}

	return (
		<div className="grid grid-cols-4 gap-4 overflow-x-auto">
			{ips.map((ip, index) => (
				<div className="card bg-base-100 shadow-sm" key={index}>
					<div className="card-body items-center text-center">
						<h2 className="card-title">{ip.label}</h2>
						<span className="badge badge-xs badge-warning">{ip.label}</span>
						<p className='pt-3'>{ip.comment}</p>
						<div className="card-actions justify-end pt-4">
							<button
								onClick={() => {
									setSelectedIp(ip);
									setEditModalOpen(true);
								}}
								className="btn btn-primary mr-2"
							>
								Edit
							</button>
							{userRole === 'admin' && (
								<form
									action={deleteIpAction}
									onSubmit={(e) => {
										if (!confirm(`Are you sure you want to delete IP: ${ip.address}?`)) {
											e.preventDefault();
										}
									}}
								>
									<input type="hidden" name="id" value={ip.id} />
									<DeleteButton />
								</form>
							)}
						</div>
					</div>
				</div>
				// <div className='bg-white shadow-md rounded-lg p-4 mb-4' key={index}>
				// 	<div className='grid grid-cols-3 gap-4'>
				// 		<div className='text-gray-900'>{ip.label}</div>
				// 		<div className='text-gray-900 font-mono'>{ip.address}</div>
				// 		<div className='text-gray-900'>{ip.created_at}</div>
				// 	</div>
				// 	<div className='d-ip-comment text-gray-900 grid grid-cols-2 gap-4'>
				// 		<div className=''>{ip.comment}</div>
						// <div className='flex justify-end w-full'>
						// 	<button
						// 		onClick={() => {
						// 			setSelectedIp(ip);
						// 			setEditModalOpen(true);
						// 		}}
						// 		className="btn btn-primary mr-2"
						// 	>
						// 		Edit
						// 	</button>
						// 	{userRole === 'admin' && (
						// 		<form
						// 			action={deleteIpAction}
						// 			onSubmit={(e) => {
						// 				if (!confirm(`Are you sure you want to delete IP: ${ip.address}?`)) {
						// 					e.preventDefault();
						// 				}
						// 			}}
						// 		>
						// 			<input type="hidden" name="id" value={ip.id} />
						// 			<DeleteButton />
						// 		</form>
						// 	)}
						// </div>
				// 	</div>
				// </div>
			))}
			<EditIpModal ip={selectedIp} isOpen={isEditModalOpen} onClose={() => setEditModalOpen(false)} />
		</div>
	);
};

export default IpList;