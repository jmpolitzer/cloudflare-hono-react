import { Button } from "@/frontend/components/ui/button";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, MapPin } from "lucide-react";

export default function NotFound() {
	return (
		<div className="flex min-h-screen flex-col items-center justify-center p-4">
			<div className="mx-auto max-w-md text-center">
				<div className="mb-8 flex justify-center">
					<div className="relative">
						<MapPin
							className="h-24 w-24 text-muted-foreground"
							strokeWidth={1.5}
						/>
						<div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 transform text-4xl">
							?
						</div>
					</div>
				</div>

				<h1 className="mb-2 font-bold text-4xl tracking-tight">
					Page not found
				</h1>
				<p className="mb-8 text-muted-foreground">
					Looks like you've ventured off the map. The page you're looking for
					has either moved or never existed.
				</p>

				<div className="flex flex-col items-center justify-center space-y-4">
					<Button asChild>
						<Link to="/dashboard" className="flex items-center gap-2">
							<ArrowLeft className="h-4 w-4" />
							Back to home
						</Link>
					</Button>

					<p className="text-muted-foreground text-sm">
						If you think this is a mistake, please{" "}
						<Link
							to="/contact"
							className="underline underline-offset-4 hover:text-primary"
						>
							contact support
						</Link>
						.
					</p>
				</div>
			</div>
		</div>
	);
}
