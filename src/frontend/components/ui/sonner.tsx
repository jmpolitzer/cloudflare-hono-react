import { useTheme } from "next-themes";
import { Toaster as Sonner, toast as sonnerToast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

enum ToastResult {
	Failure = "fail",
	Info = "info",
	Success = "success",
}

enum ToastOperation {
	Change = "change",
	Create = "create",
	Delete = "delete",
	Invite = "invite",
	Update = "update",
}

interface ToastConfig {
	entity: string;
	result: ToastResult;
	operation: ToastOperation;
}

function toast({ entity, operation, result }: ToastConfig) {
	switch (result) {
		case ToastResult.Failure:
			sonnerToast.error(
				`${ToastResult.Failure}d to ${operation} ${entity.toUpperCase()}.`,
			);
			break;
		case ToastResult.Success:
			sonnerToast.success(
				`${entity.toUpperCase()} ${operation}d successfully.`,
			);
			break;
		default:
			sonnerToast.info(entity);
	}
}

const Toaster = ({ ...props }: ToasterProps) => {
	const { theme = "system" } = useTheme();

	return (
		<Sonner
			theme={theme as ToasterProps["theme"]}
			className="toaster group"
			toastOptions={{
				classNames: {
					toast:
						"group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
					description: "group-[.toast]:text-muted-foreground",
					actionButton:
						"group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
					cancelButton:
						"group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
				},
			}}
			{...props}
		/>
	);
};

export { toast, Toaster, ToastOperation, ToastResult };
