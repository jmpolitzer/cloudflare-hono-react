import { Resend } from "resend";
import InviteUserToOrgEmail from "./templates/invite-user-to-org";

import type { MiddlewareHandler } from "hono";

interface Variables {
	resendClient: Resend;
}

interface ResendBindings {
	RESEND_API_KEY: string;
}

const DEFAULT_EMAIL_SENDER = "Cloudflare-React-Hono <no-reply@pltzr.io>";

export const initResendEmailer: MiddlewareHandler<{
	Bindings: ResendBindings;
	Variables: Variables;
}> = async (c, next) => {
	const resendClient = new Resend(c.env.RESEND_API_KEY);

	c.set("resendClient", resendClient);
	await next();
};

export const sendInviteUserToOrgEmail = async (
	resendClient: Resend,
	email: string,
	invitedFirstName: string,
	orgLink: string,
	orgName: string,
) => {
	return await resendClient.emails.send({
		from: DEFAULT_EMAIL_SENDER,
		to: [email],
		subject: `You have been invited to join ${orgName}`,
		react: (
			<InviteUserToOrgEmail
				invitedFirstName={invitedFirstName}
				orgLink={orgLink}
				orgName={orgName}
			/>
		),
	});
};
