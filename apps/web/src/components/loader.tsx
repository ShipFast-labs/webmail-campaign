import { Leapfrog } from "ldrs/react";
import "ldrs/react/Leapfrog.css";

export default function Loader() {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Leapfrog size="40" speed="1.5" color="black" />
    </div>
  );
}
