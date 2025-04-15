import { Button } from "@/frontend/components/ui/button";
import { LoaderIcon } from "lucide-react";

interface LoadingButtonProps {
	isLoading: boolean;
	label: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	type?: "button" | "submit" | "reset";
}

export default function LoadingButton({
	isLoading,
	label,
	onClick,
	type = "button",
	...rest
}: LoadingButtonProps) {
	return (
		<Button onClick={onClick} type={type} {...rest}>
			{isLoading ? <LoaderIcon className="animate-spin" /> : label}
		</Button>
	);
}
