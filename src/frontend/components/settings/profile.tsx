import { ModeToggle } from "@/frontend/components/theme/mode-toggle";
import { CardContent } from "@/frontend/components/ui/card";
import { Label } from "@/frontend/components/ui/label";
import { Separator } from "@/frontend/components/ui/separator";
import EditUser from "@/frontend/components/users/edit-user";
import type { CurrentUser } from "@/frontend/hooks/users";
import { Mail, User } from "lucide-react";

interface ProfileSectionProps {
	currentUser: NonNullable<CurrentUser>;
}

export default function ProfileSection({ currentUser }: ProfileSectionProps) {
	return (
		<CardContent className="space-y-6">
			{/* Personal Information Section */}
			<div>
				<div className="flex justify-between">
					<h3 className="mb-4 font-medium text-lg">Personal Information</h3>
					<EditUser currentUser={currentUser} />
				</div>
				<div className="space-y-4">
					<div className="flex space-x-8">
						<div className="grid gap-2">
							<Label htmlFor="email" className="flex items-center gap-2">
								<Mail className="h-4 w-4" />
								Email Address
							</Label>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">
									{currentUser.email}
								</span>
							</div>
						</div>
						<div className="grid gap-2">
							<Label htmlFor="email" className="flex items-center gap-2">
								<User className="h-4 w-4" />
								Name
							</Label>
							<div className="flex items-center justify-between">
								<span className="text-muted-foreground text-sm">
									{`${currentUser.given_name} ${currentUser.family_name}`}
								</span>
							</div>
						</div>
					</div>
				</div>
			</div>
			<Separator />
			{/* Appearance Section */}
			<div>
				<h3 className="mb-4 font-medium text-lg">Appearance</h3>
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<Label>Theme</Label>
							<p className="text-muted-foreground text-sm">
								Select your preferred theme mode
							</p>
						</div>
						<ModeToggle />
					</div>
				</div>
			</div>
			<Separator />
			{/* Additional Settings Section */}
			<div>
				<h3 className="mb-4 font-medium text-lg">Preferences</h3>
				<div className="space-y-4">
					<p className="text-muted-foreground text-sm">
						Additional user preferences would go here
					</p>
				</div>
			</div>
		</CardContent>
	);
}
