'use client';

import { ReactNode, MouseEvent } from 'react';

interface ModalProps {
	isOpen: boolean;
	onClose: () => void;
	children: ReactNode;
}

const Modal = ({ isOpen, onClose, children }: ModalProps) => {
	if (!isOpen) return null;

	const handleBackdropClick = (e: MouseEvent<HTMLDivElement>) => {
		// Close modal only if the backdrop itself is clicked, not content inside
		if (e.target === e.currentTarget) {
			onClose();
		}
	};

	return (
		<div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 transition-opacity"
			onClick={handleBackdropClick}
		>
			<div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">{children}</div>
		</div>
	);
};

export default Modal;