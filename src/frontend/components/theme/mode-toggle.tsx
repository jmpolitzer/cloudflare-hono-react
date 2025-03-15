import { Laptop, Moon, Sun } from "lucide-react";

import { useTheme } from "@/frontend/components/theme/provider";
import { Button } from "@/frontend/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/frontend/components/ui/dropdown-menu";

export function ModeToggle() {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="outline"
					size="sm"
					className="w-[140px] justify-between"
				>
					{theme === "light" ? (
						<>
							<Sun className="mr-1 h-[1.2rem] w-[1.2rem]" />
							Light
						</>
					) : theme === "dark" ? (
						<>
							<Moon className="mr-1 h-[1.2rem] w-[1.2rem]" />
							Dark
						</>
					) : (
						<>
							<Laptop className="mr-1 h-[1.2rem] w-[1.2rem]" />
							System
						</>
					)}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<Sun className="mr-2 h-4 w-4" />
					Light
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<Moon className="mr-2 h-4 w-4" />
					Dark
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<Laptop className="mr-2 h-4 w-4" />
					System
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
