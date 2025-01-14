import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/frontend/components/ui/breadcrumb";
import { Link, isMatch, useMatches } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";

export default function Breadcrumbs() {
	const matches = useMatches();

	if (matches.some((match) => match.status === "pending")) return null;

	const matchesWithCrumbs = matches.filter((match) =>
		isMatch(match, "loaderData.crumb"),
	);

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{matchesWithCrumbs.map((match, i) => (
					<Fragment key={`${match}`}>
						<BreadcrumbItem>
							{i + 1 < matchesWithCrumbs.length ? (
								<BreadcrumbLink asChild className="hidden md:block">
									<Link from={match.fullPath}>{match.loaderData?.crumb}</Link>
								</BreadcrumbLink>
							) : (
								<BreadcrumbPage>{match.loaderData?.crumb}</BreadcrumbPage>
							)}
						</BreadcrumbItem>
						{i + 1 < matchesWithCrumbs.length ? (
							<BreadcrumbSeparator className="hidden md:block" />
						) : null}
					</Fragment>
				))}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
