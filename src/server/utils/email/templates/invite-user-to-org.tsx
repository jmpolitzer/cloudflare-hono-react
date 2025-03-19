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
		<div>
			<h1>Welcome {invitedFirstName}!</h1>
			<p>
				You have been invited to join the organization{" "}
				<strong>{orgName}</strong>.
			</p>
			<p>
				Please click this
				<span>
					{" "}
					<a href={orgLink}>link</a>{" "}
				</span>
				to login.
			</p>
		</div>
	);
}
