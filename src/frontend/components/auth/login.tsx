import { Button } from "@/frontend/components/ui/button";

export default function Login() {
	return (
		<div className="flex flex-col items-center gap-y-2">
			<p>You have to login or register</p>
			<Button asChild>
				<a href="/api/auth/login">Login</a>
			</Button>
			<Button asChild>
				<a href="/api/auth/register">Register</a>
			</Button>
		</div>
	);
}
