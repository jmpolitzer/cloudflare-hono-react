import type { UserType } from "@kinde-oss/kinde-typescript-sdk";

export const mockUser: UserType = {
	id: "mock-user-id",
	email: "mockuser@example.com",
	given_name: "Mock",
	family_name: "User",
	picture: "mock-picture",
};

export const mockOrg: { orgCode: string | null } = {
	orgCode: "mock-org",
};

export const mockCurrentOrg = {
	currentOrg: "mock-org",
};

export const mockPermissions: {
	permissions: string[];
	orgCode: string | null;
} = {
	orgCode: "mock-org",
	permissions: ["manage:org"],
};

export const mockPermission: {
	orgCode: string | null;
	isGranted: boolean;
} = {
	orgCode: "mock-org",
	isGranted: true,
};

export const mockAdminUser = {
	...mockUser,
	...mockCurrentOrg,
	permissions: mockPermissions.permissions,
};
