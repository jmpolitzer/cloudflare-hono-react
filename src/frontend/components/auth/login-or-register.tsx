import LoadingButton from "@/frontend/components/buttons/loading-button";
import AlertError from "@/frontend/components/errors/alert-error";
import { Button } from "@/frontend/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/frontend/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/frontend/components/ui/form";
import { Input } from "@/frontend/components/ui/input";
import { Separator } from "@/frontend/components/ui/separator";
import { useLoginUser, useRegisterUser } from "@/frontend/hooks/users";
import {
	loginUserSchema,
	registerUserSchema,
} from "@/shared/validations/users";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertTriangle, ArrowLeft, LogIn, UserPlus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import type {
	CurrentUser,
	LoginUserSchemaType,
	RegisterUserSchemaType,
} from "@/frontend/hooks/users";

type AuthView = "main" | "login" | "register";

export default function LoginOrRegister({
	currentUser,
}: { currentUser?: CurrentUser }) {
	const [view, setView] = useState<AuthView>("main");

	return (
		<div className="flex min-h-[50vh] items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="space-y-1">
					<CardTitle className="font-bold text-2xl">
						{view === "main"
							? currentUser
								? "Access Required"
								: "Welcome Back"
							: view === "login"
								? "Login to your account"
								: "Create a new account"}
					</CardTitle>
					<CardDescription>
						{view === "main"
							? currentUser
								? "You need to re-register to regain access"
								: "Sign in to your account or create a new one"
							: view === "login"
								? "Enter your credentials to sign in"
								: "Fill in your details to create an account"}
					</CardDescription>
				</CardHeader>

				<CardContent className="grid gap-4">
					{currentUser && view === "main" && (
						<div className="flex items-start gap-2 rounded-lg border bg-amber-50 p-3 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
							<AlertTriangle className="mt-0.5 h-5 w-5 flex-shrink-0" />
							<div className="text-sm">
								It looks like you have lost organization access. Please
								re-register to continue.
							</div>
						</div>
					)}

					{view === "main" && (
						<>
							{!currentUser && (
								<div className="grid gap-2">
									<Button
										className="w-full"
										data-testid="login-button"
										onClick={() => setView("login")}
									>
										<div className="flex items-center justify-center gap-2">
											<LogIn className="h-4 w-4" />
											<span>Login to your account</span>
										</div>
									</Button>
								</div>
							)}

							{!currentUser && (
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
								variant={currentUser ? "default" : "outline"}
								className="w-full"
								data-testid="register-button"
								onClick={() => setView("register")}
							>
								<div className="flex items-center justify-center gap-2">
									<UserPlus className="h-4 w-4" />
									<span>
										{currentUser
											? "Register to regain access"
											: "Create a new account"}
									</span>
								</div>
							</Button>
						</>
					)}

					{view === "login" && <LoginForm onBack={() => setView("main")} />}

					{view === "register" && (
						<RegisterForm
							currentUser={currentUser}
							onBack={() => setView("main")}
						/>
					)}
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

interface FormProps {
	currentUser?: CurrentUser;
	onBack: () => void;
}

function LoginForm({ onBack }: FormProps) {
	const { mutateAsync: loginUserMutation, error, isError } = useLoginUser();

	const form = useForm<LoginUserSchemaType>({
		resolver: zodResolver(loginUserSchema),
		defaultValues: {
			email: "",
		},
	});

	async function onSubmit(values: LoginUserSchemaType) {
		const data = await loginUserMutation(values);

		window.location.href = data.redirectUrl;
	}

	return (
		<Form {...form}>
			{isError && <AlertError message={error.message} />}
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input {...field} data-testId="login-email" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-between text-sm">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="px-0"
						onClick={onBack}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
				</div>
				<LoadingButton
					label="Sign In"
					isLoading={form.formState.isSubmitting}
					type="submit"
				/>
			</form>
		</Form>
	);
}

function RegisterForm({ currentUser, onBack }: FormProps) {
	const readOnlyClasses = "read-only:cursor-not-allowed read-only:opacity-50";

	const {
		error,
		isError,
		mutateAsync: registerUserMutation,
	} = useRegisterUser();

	const form = useForm<RegisterUserSchemaType>({
		resolver: zodResolver(registerUserSchema),
		defaultValues: {
			email: currentUser ? currentUser.email : "",
			firstName: currentUser ? currentUser.given_name : "",
			lastName: currentUser ? currentUser.family_name : "",
		},
	});

	async function onSubmit(values: RegisterUserSchemaType) {
		const data = await registerUserMutation(values);

		window.location.href = data.redirectUrl;
	}

	return (
		<Form {...form}>
			{isError && <AlertError message={error.message} />}
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="email"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Email</FormLabel>
							<FormControl>
								<Input
									{...field}
									className={currentUser ? readOnlyClasses : ""}
									data-testId="register-email"
									readOnly={Boolean(currentUser)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="firstName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>First Name</FormLabel>
							<FormControl>
								<Input
									{...field}
									className={currentUser ? readOnlyClasses : ""}
									data-testId="register-first-name"
									readOnly={Boolean(currentUser)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name="lastName"
					render={({ field }) => (
						<FormItem>
							<FormLabel>Last Name</FormLabel>
							<FormControl>
								<Input
									{...field}
									className={currentUser ? readOnlyClasses : ""}
									data-testId="register-last-name"
									readOnly={Boolean(currentUser)}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
				<div className="flex justify-between text-sm">
					<Button
						type="button"
						variant="ghost"
						size="sm"
						className="px-0"
						onClick={onBack}
					>
						<ArrowLeft className="mr-2 h-4 w-4" />
						Back
					</Button>
					{currentUser && (
						<Button
							type="button"
							variant="ghost"
							size="sm"
							className="px-0"
							asChild
						>
							<a href="/api/auth/logout">Register as a different user</a>
						</Button>
					)}
				</div>
				<LoadingButton
					label="Create Account"
					isLoading={form.formState.isSubmitting}
					type="submit"
				/>
			</form>
		</Form>
	);
}
