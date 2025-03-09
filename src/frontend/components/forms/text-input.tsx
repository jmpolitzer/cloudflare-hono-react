import { Input } from "@/frontend/components/ui/input";
import { Label } from "@/frontend/components/ui/label";
import type { FieldApi } from "@tanstack/react-form";
import FieldInfo from "./field-info";

export default function TextInput({
	field,
	label,
}: {
	// biome-ignore lint/suspicious/noExplicitAny: Generic types are inferred
	field: FieldApi<any, any, any, any>;
	label?: string;
}) {
	return (
		<div className="grid grid-cols-4 items-center gap-4">
			{label && (
				<Label htmlFor={field.name} className="text-right">
					{label}
				</Label>
			)}
			<Input
				className="col-span-3"
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			<FieldInfo field={field} />
		</div>
	);
}
