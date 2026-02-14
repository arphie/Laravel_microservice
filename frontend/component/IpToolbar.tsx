'use client';

import { useState, useEffect, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { addIpAction } from '@/lib/actions/ip';
import Modal from './Modal';

const initialState = {
	message: '',
};

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="btn btn-info"
		>
			{pending ? 'Adding...' : 'Add IP Address'}
		</button>
	);
}

const IpToolbar = () => {
	const [isModalOpen, setModalOpen] = useState(false);
	const [state, formAction] = useActionState(addIpAction, initialState);

	useEffect(() => {
		// Close the modal on successful submission
		if (state.message === 'success') {
			setModalOpen(false);
		}
	}, [state]);

	return (
		<>
			<div className="grid grid-cols-2 mb-4">
				<div className="d-left-info">
					<h2 className="text-xl font-semibold text-gray-700 mb-4">IP Management</h2>
				</div>
				<div className="d-right-info flex justify-end w-full">
					<button
						onClick={() => setModalOpen(true)}
						className="btn"
					>
						Add new IP
					</button>
				</div>
			</div>

			<Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
				<h3 className="text-lg font-bold mb-4">Add New IP Address</h3>
				<form action={formAction} className="space-y-4">
					<div>
						<label htmlFor="address" className="block text-sm font-medium text-gray-700">IP Address</label>
						<input type="text" id="address" name="address" required className="input input-bordered input-neutral w-full" />
					</div>
					<div>
						<label htmlFor="label" className="block text-sm font-medium text-gray-700">Label</label>
						<input type="text" id="label" name="label" required className="input input-bordered input-neutral w-full" />
					</div>
					<div>
						<label htmlFor="comment" className="block text-sm font-medium text-gray-700">Comment</label>
						<textarea id="comment" name="comment" rows={3} className="input input-bordered input-neutral w-full"></textarea>
					</div>
					<div className='flex justify-end'>
						<SubmitButton />
					</div>
					
					{state?.message && state.message !== 'success' && (
						<p className="text-sm text-red-600 mt-2">{state.message}</p>
					)}
				</form>
			</Modal>
		</>
	);
};

export default IpToolbar;