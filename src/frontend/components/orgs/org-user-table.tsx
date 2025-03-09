import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/frontend/components/ui/table";
import { useOrgUsers } from "@/frontend/hooks/orgs";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { useMemo } from "react";
import OrgUserActionsMenu from "./org-user-actions-menu";
import OrgUserRoleSelect from "./org-user-role-select";

import type { UpdateOrgUserRoleSchemaType } from "@/frontend/hooks/orgs";

interface UserTableProps {
	currentUserId: string;
	orgId: string;
}

type OrgUser = {
	orgId: string; // perhaps this can be set as table context
	currentUserId: string; // perhaps this can be set as table context
	id: string;
	full_name: string;
	email: string;
	role: UpdateOrgUserRoleSchemaType["currentRoleId"];
};

const columnHelper = createColumnHelper<OrgUser>();
const columns = [
	columnHelper.accessor("full_name", {
		header: () => "Name",
	}),
	columnHelper.accessor("email", {
		header: () => "Email",
	}),
	columnHelper.accessor("role", {
		header: () => "Role",
		cell: ({ row }) => {
			return (
				<OrgUserRoleSelect
					currentUserId={row.original.currentUserId}
					orgId={row.original.orgId}
					role={row.original.role}
					userId={row.original.id}
				/>
			);
		},
	}),
	columnHelper.accessor("id", {
		header: () => "",
		cell: ({ row }) => {
			const user = row.original;

			return (
				<OrgUserActionsMenu
					currentUserId={user.currentUserId}
					orgId={user.orgId}
					userId={user.id}
				/>
			);
		},
	}),
];

// TODO: Rows are not in sync when new users are added or removed.
export default function OrgUserTable({ currentUserId, orgId }: UserTableProps) {
	const { isPending: orgUsersPending, data: orgUsers } = useOrgUsers(orgId);
	console.log("re-rendering");
	if (!orgUsers && !orgUsersPending) return null;

	const data = useMemo(
		() =>
			(orgUsers?.users.organization_users ?? []).map((user) => ({
				orgId,
				currentUserId,
				id: user.id ?? "",
				full_name: user.full_name ?? "",
				email: user.email ?? "",
				role: user.roles?.[0] as UpdateOrgUserRoleSchemaType["currentRoleId"],
			})),
		[currentUserId, orgId, orgUsers],
	);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<>
			{orgUsersPending ? (
				<div>Loading...</div>
			) : (
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id}>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow key={row.id}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			)}
		</>
	);
}
