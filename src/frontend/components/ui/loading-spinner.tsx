import { cn } from "@/frontend/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
	size?: number;
	className?: string;
	text?: string;
}

export default function LoadingSpinner({
	size = 40,
	className,
	text = "Loading, please wait...",
}: LoadingSpinnerProps) {
	return (
		<div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
			<Loader2
				className={cn("animate-spin text-primary", className)}
				size={size}
			/>
			{text && (
				<p className="mt-4 font-medium text-muted-foreground text-sm">{text}</p>
			)}
		</div>
	);
}
