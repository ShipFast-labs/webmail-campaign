import { useState } from "react";
import { ViewIcon, ViewOffIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { AnimatePresence, motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = Omit<React.ComponentProps<"input">, "type">;

export function PasswordInput({ className, ...props }: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input type={visible ? "text" : "password"} className={`pr-10 ${className ?? ""}`} {...props} />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="absolute right-0 top-0 h-full w-10 rounded-r-2xl text-muted-foreground hover:text-foreground"
        onClick={() => setVisible((v) => !v)}
        tabIndex={-1}
        aria-label={visible ? "Hide password" : "Show password"}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={visible ? "off" : "on"}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.12 }}
            className="flex"
          >
            <HugeiconsIcon icon={visible ? ViewOffIcon : ViewIcon} size={15} />
          </motion.span>
        </AnimatePresence>
      </Button>
    </div>
  );
}
