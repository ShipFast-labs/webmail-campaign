import { Button } from "@/components/ui/button";
import { useTheme } from "@/provider/theme-provider";
import { Moon02Icon, Sun02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

export function ModeToggle() {
  const { setTheme, theme } = useTheme();

  const handelOnClick = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Button variant="outline" size="icon" onClick={handelOnClick}>
      <HugeiconsIcon
        icon={Moon02Icon}
        className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90"
      />
      <HugeiconsIcon
        icon={Sun02Icon}
        className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0"
      />
    </Button>
  );
}
