import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, Home, RefreshCw } from "lucide-react";

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/frontend/components/ui/alert";
import { Button } from "@/frontend/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
} from "@/frontend/components/ui/card";

interface ErrorComponentProps {
	error?: Error;
	resetErrorBoundary?: () => void;
	title?: string;
	description?: string;
}

export function FullScreenError({
	error,
	resetErrorBoundary,
	title = "Something went wrong",
	description = "An error occurred while loading this page.",
}: ErrorComponentProps) {
	// Create a navigate function that works even if router isn't available
	let navigate: (path: string) => void;

	try {
		const routerNavigate = useNavigate();

		navigate = (path: string) => routerNavigate({ to: path });
	} catch (e) {
		// Fallback if useNavigate fails
		navigate = (path: string) => {
			window.location.href = path;
		};
	}

	const handleRetry = () => {
		if (resetErrorBoundary) {
			resetErrorBoundary();
		} else {
			window.location.reload();
		}
	};

	const handleGoHome = () => {
		navigate("/");
	};

	return (
		<div className="flex min-h-[50vh] items-center justify-center p-4">
			<Card className="w-full max-w-md shadow-lg">
				<CardHeader className="pb-2">
					<div className="mb-2 flex items-center gap-2 text-destructive">
						<AlertCircle className="h-5 w-5" />
						<h2 className="font-semibold text-xl">{title}</h2>
					</div>
					<p className="text-muted-foreground">{description}</p>
				</CardHeader>
				<CardContent>
					{error && (
						<Alert variant="destructive" className="mt-4">
							<AlertTitle>Error Details</AlertTitle>
							<AlertDescription className="mt-2 break-all font-mono text-sm">
								{error.message || "Unknown error"}
							</AlertDescription>
						</Alert>
					)}
				</CardContent>
				<CardFooter className="flex justify-end gap-2">
					<Button variant="outline" onClick={handleGoHome}>
						<Home className="mr-2 h-4 w-4" />
						Home
					</Button>
					<Button onClick={handleRetry}>
						<RefreshCw className="mr-2 h-4 w-4" />
						Retry
					</Button>
				</CardFooter>
			</Card>
		</div>
	);
}
