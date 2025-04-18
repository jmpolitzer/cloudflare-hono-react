import LoadingButton from "@/frontend/components/buttons/loading-button";
import AlertError from "@/frontend/components/errors/alert-error";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/frontend/components/ui/form";
import { Input } from "@/frontend/components/ui/input";
import {
	RadioGroup,
	RadioGroupItem,
} from "@/frontend/components/ui/radio-group";
import {
	ToastOperation,
	ToastResult,
	toast,
} from "@/frontend/components/ui/sonner";
import { Textarea } from "@/frontend/components/ui/textarea";
import { useCreateContact } from "@/frontend/hooks/contact";
import type { ContactFormSchemaType } from "@/frontend/hooks/contact";
import { contactFormSchema } from "@/shared/validations/contact";
import { zodResolver } from "@hookform/resolvers/zod";
import { createLazyFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";

export const Route = createLazyFileRoute("/_unauthenticated/contact")({
	component: ContactRoute,
});

export default function ContactRoute() {
	const {
		mutateAsync: createContactMutation,
		error,
		isError,
	} = useCreateContact();

	const form = useForm<ContactFormSchemaType>({
		resolver: zodResolver(contactFormSchema),
		defaultValues: {
			name: "",
			email: "",
			phone: "",
			reason: "general",
			message: "",
		},
	});

	async function onSubmit(values: ContactFormSchemaType) {
		try {
			await createContactMutation(values);

			toast({
				entity: "Message sent! We'll get back to you as soon as possible.",
				operation: ToastOperation.Create,
				result: ToastResult.Info,
			});
			form.reset();
		} catch (error) {
			toast({
				entity: "contact request",
				operation: ToastOperation.Create,
				result: ToastResult.Failure,
			});
		}
	}

	return (
		<section className="w-full py-12 md:py-24 lg:py-32">
			<div className="container grid items-center gap-6 px-4 md:px-6 lg:grid-cols-2 lg:gap-10">
				<div className="space-y-4">
					<div className="space-y-2">
						<h1 className="font-bold text-3xl tracking-tighter sm:text-4xl md:text-5xl">
							Get in touch
						</h1>
						<p className="max-w-[600px] text-muted-foreground md:text-xl">
							We'd love to hear from you. Fill out the form and we'll get back
							to you as soon as possible.
						</p>
					</div>

					<div className="space-y-4 pt-4">
						<div className="flex items-start gap-4">
							<Mail className="h-6 w-6 text-primary" />
							<div>
								<h3 className="font-semibold">Email us</h3>
								<p className="text-muted-foreground text-sm">
									For general inquiries and support
								</p>
								<a
									href="mailto:hello@starterapp.com"
									className="text-sm hover:underline"
								>
									hello@starterapp.com
								</a>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<Phone className="h-6 w-6 text-primary" />
							<div>
								<h3 className="font-semibold">Call us</h3>
								<p className="text-muted-foreground text-sm">
									Mon-Fri from 8am to 5pm
								</p>
								<a href="tel:+1234567890" className="text-sm hover:underline">
									+1 (706) 867-5309
								</a>
							</div>
						</div>

						<div className="flex items-start gap-4">
							<MapPin className="h-6 w-6 text-primary" />
							<div>
								<h3 className="font-semibold">Visit us</h3>
								<p className="text-muted-foreground text-sm">
									Come say hello at our office
								</p>
								<address className="text-sm not-italic">
									123 Easy St
									<br />
									Athens, GA 30601
								</address>
							</div>
						</div>
					</div>
				</div>

				<div className="rounded-lg border bg-background p-6 shadow-sm">
					<Form {...form}>
						{isError && <AlertError message={error.message} />}
						<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
							<div className="grid gap-4 sm:grid-cols-2">
								<FormField
									control={form.control}
									name="name"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Name</FormLabel>
											<FormControl>
												<Input {...field} placeholder="Your name" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									control={form.control}
									name="email"
									render={({ field }) => (
										<FormItem>
											<FormLabel>Email</FormLabel>
											<FormControl>
												<Input {...field} placeholder="Your email" />
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>
							<FormField
								control={form.control}
								name="phone"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Phone (optional)</FormLabel>
										<FormControl>
											<Input {...field} placeholder="Your phone" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="reason"
								render={({ field }) => (
									<FormItem>
										<FormLabel>What can we help you with?</FormLabel>
										<FormControl>
											<RadioGroup
												value={field.value}
												onValueChange={field.onChange}
												className="flex flex-col space-y-1"
											>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="general" />
													</FormControl>
													<FormLabel className="font-normal">
														General Inquiry
													</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="sales" />
													</FormControl>
													<FormLabel className="font-normal">Sales</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="support" />
													</FormControl>
													<FormLabel className="font-normal">Support</FormLabel>
												</FormItem>
												<FormItem className="flex items-center space-x-3 space-y-0">
													<FormControl>
														<RadioGroupItem value="partnership" />
													</FormControl>
													<FormLabel className="font-normal">
														Partnership
													</FormLabel>
												</FormItem>
											</RadioGroup>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="message"
								render={({ field }) => (
									<FormItem>
										<FormLabel>Message</FormLabel>
										<FormControl>
											<Textarea {...field} placeholder="How can we help you?" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
							<LoadingButton
								className="w-full"
								label="Send Message"
								isLoading={form.formState.isSubmitting}
								type="submit"
							/>
							<p className="text-center text-muted-foreground text-xs">
								By submitting this form, you agree to our{" "}
								<a href="#terms" className="underline underline-offset-2">
									Terms of Service
								</a>{" "}
								and{" "}
								<a href="#privacy" className="underline underline-offset-2">
									Privacy Policy
								</a>
								.
							</p>
						</form>
					</Form>
				</div>
			</div>
		</section>
	);
}
