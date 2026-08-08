import { Loader2 } from "lucide-react";

import { Leapfrog } from "ldrs/react";
import "ldrs/react/Leapfrog.css";

export default function Loader() {
  return (
    <div className="flex h-full items-center justify-center pt-8">
      <Leapfrog size="40" speed="1.5" color="black" />
    </div>
  );
}
