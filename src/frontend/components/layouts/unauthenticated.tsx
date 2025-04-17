import { Button } from "@/frontend/components/ui/button";
import { Link } from "@tanstack/react-router";

interface LayoutProps {
	children: React.ReactNode;
}

export default function UnuthenticatedLayout({ children }: LayoutProps) {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Header */}
			<header className="border-b">
				<div className="container flex h-16 items-center justify-between px-4 md:px-6">
					<Link to="/" className="flex items-center gap-2 font-bold">
						<div className="h-6 w-6 rounded-full bg-primary" />
						<span>StarterApp</span>
					</Link>
					<nav className="hidden gap-6 md:flex">
						<a
							href="/#features"
							className="font-medium text-sm underline-offset-4 hover:underline"
						>
							Features
						</a>
						<a
							href="/#testimonials"
							className="font-medium text-sm underline-offset-4 hover:underline"
						>
							Testimonials
						</a>
						<a
							href="/#pricing"
							className="font-medium text-sm underline-offset-4 hover:underline"
						>
							Pricing
						</a>
					</nav>
					<div className="flex items-center gap-4">
						<Link
							to="/login"
							className="font-medium text-sm underline-offset-4 hover:underline"
						>
							Login
						</Link>
						<Button asChild>
							<a href="/#pricing">Get Started</a>
						</Button>
					</div>
				</div>
			</header>

			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32">{children}</section>
			</main>

			{/* Footer */}
			<footer className="border-t py-6 md:py-8">
				<div className="container flex flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
					<div className="flex flex-col gap-2">
						<Link to="/" className="flex items-center gap-2 font-bold">
							<div className="h-6 w-6 rounded-full bg-primary" />
							<span>StarterApp</span>
						</Link>
						<p className="text-muted-foreground text-sm">
							&copy; {new Date().getFullYear()} StarterApp. All rights reserved.
						</p>
					</div>
					<nav className="flex gap-4 sm:gap-6">
						<a
							href="#terms"
							className="text-sm underline-offset-4 hover:underline"
						>
							Terms
						</a>
						<a
							href="#privacy"
							className="text-sm underline-offset-4 hover:underline"
						>
							Privacy
						</a>
						<Link
							to="/contact"
							className="text-sm underline-offset-4 hover:underline"
						>
							Contact
						</Link>
					</nav>
				</div>
			</footer>
		</div>
	);
}
