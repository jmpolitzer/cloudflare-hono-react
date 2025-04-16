import { Button } from "@/frontend/components/ui/button";
import { Link, createLazyFileRoute } from "@tanstack/react-router";
// import Link from "next/link";
// import Image from "next/image";
import { ArrowRight, CheckCircle, Star } from "lucide-react";

export const Route = createLazyFileRoute("/")({
	component: MarketingPage,
});

function MarketingPage() {
	return (
		<div className="flex min-h-screen flex-col">
			{/* Header */}
			<header className="border-b">
				<div className="flex h-16 w-full items-center justify-between px-4 md:px-6">
					<Link to="/" className="flex items-center gap-2 font-bold">
						<div className="h-6 w-6 rounded-full bg-primary" />
						<span>AppStarter</span>
					</Link>
					<nav className="hidden gap-6 md:flex">
						<a
							href="#features"
							className="font-medium text-sm underline-offset-4 hover:underline"
						>
							Features
						</a>
						<a
							href="#testimonials"
							className="font-medium text-sm underline-offset-4 hover:underline"
						>
							Testimonials
						</a>
						<a
							href="#pricing"
							className="font-medium text-sm underline-offset-4 hover:underline"
						>
							Pricing
						</a>
					</nav>
					<div className="flex items-center gap-4">
						<a
							href="/login"
							className="font-medium text-sm underline-offset-4 hover:underline"
						>
							Login
						</a>
						<Button asChild>
							<a href="#pricing">Get Started</a>
						</Button>
					</div>
				</div>
			</header>

			<main className="flex-1">
				{/* Hero Section */}
				<section className="w-full py-12 md:py-24 lg:py-32">
					<div className="w-full px-4 md:px-6">
						<div className="grid gap-6 lg:grid-cols-2 lg:gap-12">
							<div className="flex flex-col justify-center space-y-4">
								<div className="space-y-2">
									<h1 className="font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
										Simplify your workflow, amplify your results
									</h1>
									<p className="max-w-[600px] text-muted-foreground md:text-xl">
										Our platform helps teams work smarter, not harder.
										Streamline your processes and boost productivity.
									</p>
								</div>
								<div className="flex flex-col gap-2 min-[400px]:flex-row">
									<Button size="lg" asChild>
										<a href="#pricing">Start Free Trial</a>
									</Button>
									<Button size="lg" variant="outline" asChild>
										<a href="#demo">Watch Demo</a>
									</Button>
								</div>
								<div className="flex items-center gap-2 text-sm">
									<div className="flex gap-1">
										{Array(5)
											.fill(null)
											.map((_, i) => (
												<Star
													// biome-ignore lint/suspicious/noArrayIndexKey: Marketing page
													key={i}
													className="h-4 w-4 fill-primary text-primary"
												/>
											))}
									</div>
									<span className="text-muted-foreground">
										<strong>4.8/5</strong> from over 1,000 reviews
									</span>
								</div>
							</div>
							<div className="flex items-center justify-center">
								<img
									src="/placeholder.svg?height=550&width=550"
									width={550}
									height={550}
									alt="Product screenshot"
									className="rounded-lg object-cover shadow-lg"
								/>
							</div>
						</div>
					</div>
				</section>

				{/* Logos Section */}
				<section className="w-full border-y bg-muted/40 py-8">
					<div className="w-full px-4 md:px-6">
						<div className="flex flex-col items-center justify-center gap-4 text-center">
							<h2 className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
								Trusted by companies worldwide
							</h2>
							<div className="flex flex-wrap items-center justify-center gap-8">
								{[
									"Company A",
									"Company B",
									"Company C",
									"Company D",
									"Company E",
								].map((company) => (
									<div
										key={company}
										className="font-semibold text-lg text-muted-foreground"
									>
										{company}
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Features Section */}
				<section id="features" className="w-full py-12 md:py-24 lg:py-32">
					<div className="w-full px-4 md:px-6">
						<div className="flex flex-col items-center justify-center gap-4 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl tracking-tighter md:text-4xl/tight">
									Everything you need to succeed
								</h2>
								<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
									Our platform provides all the tools you need to streamline
									your workflow and boost productivity.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
							{[
								{
									title: "Seamless Integration",
									description:
										"Connect with the tools you already use and love without any hassle.",
								},
								{
									title: "Advanced Analytics",
									description:
										"Gain valuable insights with our powerful analytics dashboard.",
								},
								{
									title: "Team Collaboration",
									description:
										"Work together efficiently with real-time collaboration features.",
								},
								{
									title: "Automated Workflows",
									description:
										"Save time with intelligent automation for repetitive tasks.",
								},
								{
									title: "Secure & Reliable",
									description:
										"Enterprise-grade security to keep your data safe and accessible.",
								},
								{
									title: "24/7 Support",
									description:
										"Our dedicated team is always ready to help when you need it.",
								},
							].map((feature, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: Marketing page
									key={i}
									className="flex flex-col gap-2 rounded-lg border p-6"
								>
									<div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
										<CheckCircle className="h-5 w-5 text-primary" />
									</div>
									<h3 className="font-bold text-xl">{feature.title}</h3>
									<p className="text-muted-foreground">{feature.description}</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Testimonials Section */}
				<section
					id="testimonials"
					className="w-full border-t bg-muted/30 py-12 md:py-24 lg:py-32"
				>
					<div className="w-full px-4 md:px-6">
						<div className="flex flex-col items-center justify-center gap-4 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl tracking-tighter md:text-4xl/tight">
									Loved by businesses worldwide
								</h2>
								<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
									Don't just take our word for it. Here's what our customers
									have to say.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
							{[
								{
									quote:
										"This platform has completely transformed how our team works. We've seen a 40% increase in productivity.",
									author: "Sarah Johnson",
									role: "Product Manager, TechCorp",
								},
								{
									quote:
										"The integration capabilities are outstanding. It works seamlessly with all our existing tools.",
									author: "Michael Chen",
									role: "CTO, StartupX",
								},
								{
									quote:
										"Customer support is exceptional. Any issues we've had were resolved quickly and professionally.",
									author: "Emma Rodriguez",
									role: "Operations Director, GrowthCo",
								},
							].map((testimonial, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: Marketing page
									key={i}
									className="flex flex-col gap-4 rounded-lg border bg-background p-6"
								>
									<div className="flex gap-1">
										{Array(5)
											.fill(null)
											.map((_, i) => (
												<Star
													// biome-ignore lint/suspicious/noArrayIndexKey: Marketing page
													key={i}
													className="h-4 w-4 fill-primary text-primary"
												/>
											))}
									</div>
									<p className="flex-1 text-muted-foreground">
										"{testimonial.quote}"
									</p>
									<div>
										<p className="font-semibold">{testimonial.author}</p>
										<p className="text-muted-foreground text-sm">
											{testimonial.role}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Pricing Section */}
				<section id="pricing" className="w-full py-12 md:py-24 lg:py-32">
					<div className="w-full px-4 md:px-6">
						<div className="flex flex-col items-center justify-center gap-4 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl tracking-tighter md:text-4xl/tight">
									Simple, transparent pricing
								</h2>
								<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
									Choose the plan that's right for your business. All plans
									include a 14-day free trial.
								</p>
							</div>
						</div>
						<div className="mx-auto grid max-w-5xl gap-6 py-12 md:grid-cols-3">
							{[
								{
									name: "Starter",
									price: "$29",
									description: "Perfect for small teams just getting started.",
									features: [
										"Up to 5 team members",
										"Basic analytics",
										"24/7 email support",
										"10GB storage",
									],
								},
								{
									name: "Professional",
									price: "$79",
									description: "Ideal for growing teams that need more power.",
									features: [
										"Up to 20 team members",
										"Advanced analytics",
										"Priority support",
										"50GB storage",
										"Custom integrations",
									],
								},
								{
									name: "Enterprise",
									price: "$149",
									description: "For large organizations with advanced needs.",
									features: [
										"Unlimited team members",
										"Enterprise analytics",
										"Dedicated account manager",
										"Unlimited storage",
										"Advanced security",
										"Custom branding",
									],
								},
							].map((plan, i) => (
								<div
									// biome-ignore lint/suspicious/noArrayIndexKey: Marketing page
									key={i}
									className={`flex flex-col rounded-lg border p-6 ${i === 1 ? "border-primary ring-1 ring-primary" : ""}`}
								>
									<div className="mb-4 flex flex-col gap-1">
										<h3 className="font-bold text-lg">{plan.name}</h3>
										<div className="flex items-baseline gap-1">
											<span className="font-bold text-3xl">{plan.price}</span>
											<span className="text-muted-foreground">/month</span>
										</div>
										<p className="text-muted-foreground text-sm">
											{plan.description}
										</p>
									</div>
									<ul className="mb-6 flex flex-1 flex-col gap-2">
										{plan.features.map((feature, j) => (
											// biome-ignore lint/suspicious/noArrayIndexKey: Marketing page
											<li key={j} className="flex items-center gap-2 text-sm">
												<CheckCircle className="h-4 w-4 text-primary" />
												{feature}
											</li>
										))}
									</ul>
									<Button
										variant={i === 1 ? "default" : "outline"}
										className="w-full"
									>
										Get Started
									</Button>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA Section */}
				<section className="w-full border-t bg-muted/30 py-12 md:py-24 lg:py-32">
					<div className="w-full px-4 md:px-6">
						<div className="flex flex-col items-center justify-center gap-4 text-center">
							<div className="space-y-2">
								<h2 className="font-bold text-3xl tracking-tighter md:text-4xl/tight">
									Ready to transform your workflow?
								</h2>
								<p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
									Join thousands of satisfied customers who have improved their
									productivity with our platform.
								</p>
							</div>
							<div className="flex flex-col gap-2 min-[400px]:flex-row">
								<Button size="lg" asChild>
									<a href="#pricing">
										Start Your Free Trial{" "}
										<ArrowRight className="ml-2 h-4 w-4" />
									</a>
								</Button>
								<Button size="lg" variant="outline" asChild>
									<a href="/contact">Contact Sales</a>
								</Button>
							</div>
							<p className="text-muted-foreground text-sm">
								No credit card required. 14-day free trial.
							</p>
						</div>
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t py-6 md:py-8">
				<div className="flex w-full flex-col gap-6 px-4 md:flex-row md:items-center md:justify-between md:px-6">
					<div className="flex flex-col gap-2">
						<Link to="/" className="flex items-center gap-2 font-bold">
							<div className="h-6 w-6 rounded-full bg-primary" />
							<span>Acme Inc</span>
						</Link>
						<p className="text-muted-foreground text-sm">
							&copy; {new Date().getFullYear()} Acme Inc. All rights reserved.
						</p>
					</div>
					{/* <nav className="flex gap-4 sm:gap-6">
						<Link
							to="/terms"
							className="text-sm hover:underline underline-offset-4"
						>
							Terms
						</Link>
						<Link
							to="/privacy"
							className="text-sm hover:underline underline-offset-4"
						>
							Privacy
						</Link>
						<Link
							to="/contact"
							className="text-sm hover:underline underline-offset-4"
						>
							Contact
						</Link>
					</nav> */}
				</div>
			</footer>
		</div>
	);
}
