import { UserAdd01Icon, Upload01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

interface Props {
  totalElements?: number;
  onAdd: () => void;
  onImport: () => void;
}

export function ContactsHeader({ totalElements, onAdd, onImport }: Props) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-3">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Contacts</h1>
        <p className="text-sm text-muted-foreground">
          {totalElements !== undefined ? `${totalElements} total` : "Loading…"}
        </p>
      </div>
      <div className="flex gap-2">
        <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
          <Button variant="outline" onClick={onImport}>
            <HugeiconsIcon icon={Upload01Icon} size={15} />
            Import CSV
          </Button>
        </motion.div>
        <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
          <Button onClick={onAdd}>
            <HugeiconsIcon icon={UserAdd01Icon} size={15} />
            Add contact
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
