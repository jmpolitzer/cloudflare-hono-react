import { Button } from "../ui/button";

export default function SubmitButton({
	canSubmit,
	isSubmitting,
	label,
}: {
	canSubmit: boolean;
	isSubmitting: boolean;
	label?: string;
}) {
	return (
		<Button type="submit" disabled={!canSubmit}>
			{isSubmitting ? "Submitting..." : (label ?? "Submit")}
		</Button>
	);
}
