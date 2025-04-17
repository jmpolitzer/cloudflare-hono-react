import { Button } from "@/frontend/components/ui/button";
import { LoaderIcon } from "lucide-react";
import type { HTMLAttributes } from "react";

interface LoadingButtonProps {
	isLoading: boolean;
	label: string;
	type?: "button" | "submit" | "reset";
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

export default function LoadingButton({
	isLoading,
	label,
	onClick,
	type = "button",
	...rest
}: LoadingButtonProps & HTMLAttributes<HTMLButtonElement>) {
	return (
		<Button onClick={onClick} type={type} {...rest}>
			{isLoading ? <LoaderIcon className="animate-spin" /> : label}
		</Button>
	);
}
