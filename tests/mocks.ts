export const mockUser = {
	id: "mock-user-id",
	email: "mockuser@example.com",
	given_name: "Mock",
	family_name: "User",
	picture: "mock-picture",
};

export const mockCurrentOrg = {
	currentOrg: "mock-org",
};

export const mockPermissions = {
	orgCode: "mock-org",
	permissions: ["manage:org"],
};

export const mockCurrentUser = {
	...mockUser,
	...mockCurrentOrg,
	permissions: mockPermissions.permissions,
};
