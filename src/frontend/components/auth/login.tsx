import { Button } from "@/frontend/components/ui/button";

export default function Login({ orgless = false }: { orgless?: boolean }) {
	return (
		<div className="flex flex-col items-center gap-y-2">
			{!orgless ? (
				<p>You have to login or register</p>
			) : (
				<p>
					It looks like you have lost org access. Please re-register to
					continue.
				</p>
			)}
			{!orgless && (
				<Button asChild>
					<a href="/api/auth/login">Login</a>
				</Button>
			)}
			<Button asChild>
				<a href="/api/auth/register">Register</a>
			</Button>
		</div>
	);
}
