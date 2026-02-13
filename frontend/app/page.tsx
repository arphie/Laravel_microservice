'use client';

import React, { useState, FormEvent, useActionState } from 'react';
import toast from 'react-hot-toast';
import { loginAction } from '@/lib/actions/auth';

export default function LoginPage() {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	const [state, formAction, isPending] = useActionState(loginAction, null);

	return (
	<div className="font-condensed flex min-h-screen items-center justify-center bg-base-200">
		<div className="hero min-h-screen bg-base-200">
			<div className="hero-content flex-col lg:flex-row-reverse">
				<div className="text-center lg:text-left">
				<h1 className="text-5xl font-bold">Login now!</h1>
				<p className="py-6">
					Access your dashboard and manage your services. Our microservice
					architecture ensures a fast and reliable experience.
				</p>
				</div>
				<div className="card w-full max-w-sm shrink-0 bg-base-100 shadow-2xl">
					<form className="card-body" action={formAction}>
						<div className="form-control">
						<label className="label">
							<span className="label-text">Email</span>
						</label>
						<input
							type="email"
							placeholder="your@email.com"
							className="input input-bordered"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							name="email"
							required
						/>
						</div>
						<div className="form-control">
						<label className="label">
							<span className="label-text">Password</span>
						</label>
						<input
							type="password"
							name="password"
							placeholder="your password"
							className="input input-bordered"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							required
						/>
						</div>
						{state?.error && <p className="text-error">{state.error}</p>}
						<div className="form-control mt-6">
						<button className="btn btn-primary" disabled={isPending}>
							{isLoading ? (
							<span className="loading loading-spinner"></span>
							) : (
							'Login'
							)}
						</button>
						</div>
					</form>
				</div>
			</div>
		</div>
	</div>
	);
}