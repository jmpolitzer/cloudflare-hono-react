interface InviteUserToOrgEmailProps {
	invitedFirstName: string;
	orgLink: string;
	orgName: string;
}

export default function InviteUserToOrgEmail({
	invitedFirstName,
	orgLink,
	orgName,
}: InviteUserToOrgEmailProps) {
	return (
		<div className="mx-auto max-w-[600px] overflow-hidden rounded-lg bg-white font-sans shadow-lg">
			{/* Header */}
			<div className="bg-gradient-to-r from-slate-800 to-slate-900 p-8 text-center">
				<h1 className="font-light text-2xl text-white tracking-wide">
					<span className="font-bold">Join</span> {orgName}
				</h1>
			</div>

			{/* Body */}
			<div className="space-y-6 bg-white p-8">
				<p className="font-light text-lg text-slate-700">
					Hello <span className="font-medium">{invitedFirstName}</span>,
				</p>

				<p className="text-slate-600 leading-relaxed">
					You've been invited to join the{" "}
					<span className="font-medium text-slate-800">{orgName}</span>{" "}
					workspace. Accept this invitation to start collaborating with your
					team.
				</p>

				<div className="flex justify-center pt-6">
					<a
						href={orgLink}
						className="inline-block rounded-full bg-slate-800 px-8 py-3 text-center font-medium text-white shadow-sm transition-all duration-200 hover:bg-slate-900 hover:shadow-md"
					>
						Accept Invitation
					</a>
				</div>

				<div className="pt-6 text-center">
					<p className="text-slate-500 text-sm">
						Having trouble? Paste this link in your browser:
					</p>
					<p className="mt-1 break-all rounded-md bg-slate-50 p-2 font-mono text-slate-600 text-sm">
						{orgLink}
					</p>
				</div>
			</div>

			{/* Footer */}
			<div className="border-slate-100 border-t bg-slate-50 p-6 text-center">
				<p className="text-slate-500 text-sm">
					If you didn't expect this invitation, you can safely ignore this
					email.
				</p>
				<p className="mt-2 text-slate-400 text-xs">
					&copy; {new Date().getFullYear()} {orgName}
				</p>
			</div>
		</div>
	);
}
