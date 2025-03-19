interface CanProps {
	action: string;
	permissions: string[];
	children: React.ReactNode;
}

export default function Can({ action, permissions, children }: CanProps) {
	if (permissions.includes(action)) {
		return <>{children}</>;
	}

	return null;
}
