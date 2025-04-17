import { Button } from "@/frontend/components/ui/button";
import { Edit } from "lucide-react";
import type { Ref } from "react";

interface EditButtonProps {
	label?: string;
	onClick?: React.MouseEventHandler<HTMLButtonElement>;
	ref?: Ref<HTMLButtonElement>;
}

export default function EditButton({
	label = "Edit",
	onClick,
	ref,
	...rest
}: EditButtonProps) {
	return (
		<Button
			{...rest}
			size="sm"
			variant="ghost"
			className="h-8 px-2"
			onClick={onClick}
			ref={ref}
			type="button"
		>
			<Edit className="mr-1 h-3.5 w-3.5" />
			{label}
		</Button>
	);
}
