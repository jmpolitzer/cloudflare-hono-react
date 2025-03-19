import { AlertCircle } from "lucide-react";

import {
	Alert,
	AlertDescription,
	AlertTitle,
} from "@/frontend/components/ui/alert";

interface AlertErrorProps {
	className?: string;
	message?: string;
}

export default function AlertError({ className, message }: AlertErrorProps) {
	return (
		<Alert className={className} variant="destructive">
			<AlertCircle className="h-4 w-4" />
			<AlertTitle>Error</AlertTitle>
			<AlertDescription>
				{message || "Something went wrong. Please try again."}
			</AlertDescription>
		</Alert>
	);
}
