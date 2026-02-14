'use client';

import { useActionState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { updateIpAction } from '@/lib/actions/ip';
import { IpAddress } from '@/lib/actions/ip';
import Modal from '@/component/Modal';

const initialState = {
	message: '',
};

interface EditIpModalProps {
	ip: IpAddress | null;
	isOpen: boolean;
	onClose: () => void;
}

function SubmitButton() {
	const { pending } = useFormStatus();
	return (
		<button
			type="submit"
			disabled={pending}
			className="btn btn-info"
		>
			{pending ? 'Saving...' : 'Save Changes'}
		</button>
	);
}

const EditIpModal = ({ ip, isOpen, onClose }: EditIpModalProps) => {
	const [state, formAction] = useActionState(updateIpAction, initialState);

	useEffect(() => {
		if (state.message === 'success') {
			onClose();
		}
	}, [state, onClose]);

	if (!ip) return null;

	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<h3 className="text-lg font-bold mb-4">Edit IP Address</h3>
			<form action={formAction} className="space-y-4">
				<input type="hidden" name="id" value={ip.id} />
				<div>
					<label htmlFor="address" className="block text-sm font-medium text-gray-700">
						IP Address
					</label>
					<input type="text" id="address" name="address" required defaultValue={ip.address} className="input input-bordered input-neutral w-full" />
				</div>
				<div>
					<label htmlFor="label" className="block text-sm font-medium text-gray-700">
						Label
					</label>
					<input type="text" id="label" name="label" required defaultValue={ip.label} className="input input-bordered input-neutral w-full" />
				</div>
				<div>
					<label htmlFor="comment" className="block text-sm font-medium text-gray-700">
						Comment
					</label>
					<textarea id="comment" name="comment" rows={3} defaultValue={ip.comment || ''} className="input input-bordered input-neutral w-full"></textarea>
				</div>
				<div className='flex justify-end'>
					<SubmitButton />
				</div>
				
				{state?.message && state.message !== 'success' && (
					<p className="text-sm text-red-600 mt-2">{state.message}</p>
				)}
			</form>
		</Modal>
	);
};

export default EditIpModal;