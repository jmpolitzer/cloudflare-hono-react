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
		<>
			{label && <label htmlFor={field.name}>{label}</label>}
			<input
				id={field.name}
				name={field.name}
				value={field.state.value}
				onBlur={field.handleBlur}
				onChange={(e) => field.handleChange(e.target.value)}
			/>
			<FieldInfo field={field} />
		</>
	);
}
