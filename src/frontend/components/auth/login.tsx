// import { Link } from "@tanstack/react-router";
import { AlertTriangle, LogIn, UserPlus } from "lucide-react";

import { Button } from "@/frontend/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/frontend/components/ui/card";
import { Separator } from "@/frontend/components/ui/separator";

export default function Login({ orgless = false }: { orgless?: boolean }) {
	return (
		<div className="flex min-h-[50vh] items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="font-bold text-2xl">
						{orgless ? "Access Required" : "Welcome Back"}
					</CardTitle>
					<CardDescription>
						{orgless
							? "You need to re-register to regain access"
							: "Sign in to your account or create a new one"}
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-4">
					{orgless && (
						<div className="flex items-start gap-2 rounded-lg border bg-amber-50 p-3 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
							<AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
							<div className="text-sm">
								It looks like you have lost organization access. Please
								re-register to continue.
							</div>
						</div>
					)}

					{!orgless && (
						<div className="grid gap-2">
							<Button className="w-full" asChild data-testid="login-button">
								<a
									href="/api/auth/login"
									className="flex items-center justify-center gap-2"
								>
									<LogIn className="h-4 w-4" />
									<span>Login to your account</span>
								</a>
							</Button>
						</div>
					)}

					{!orgless && (
						<div className="relative">
							<div className="absolute inset-0 flex items-center">
								<Separator className="w-full" />
							</div>
							<div className="relative flex justify-center text-xs uppercase">
								<span className="bg-background px-2 text-muted-foreground">
									Or
								</span>
							</div>
						</div>
					)}

					<Button
						variant={orgless ? "default" : "outline"}
						className="w-full"
						asChild
						data-testid="register-button"
					>
						<a
							href="/api/auth/register"
							className="flex items-center justify-center gap-2"
						>
							<UserPlus className="h-4 w-4" />
							<span>
								{orgless ? "Register to regain access" : "Create a new account"}
							</span>
						</a>
					</Button>
				</CardContent>

				<CardFooter className="flex flex-col space-y-2 text-center text-muted-foreground text-sm">
					<div>
						By continuing, you agree to our Terms of Service and Privacy Policy.
					</div>
					{/* <div>
						Need help?{" "}
						<Link
							to="/support"
							className="underline underline-offset-4 hover:text-primary"
						>
							Contact support
						</Link>
					</div> */}
				</CardFooter>
			</Card>
		</div>
	);
}
