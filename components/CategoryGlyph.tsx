import type { LucideProps } from "lucide-react";
import {
  Beef,
  Bike,
  Car,
  ChefHat,
  LayoutGrid,
  Package,
  Scissors,
  Shield,
  ShoppingBag,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react";

import { cn } from "@/lib/cn";
import type { JobCategory } from "@/lib/categories";

export function CategoryGlyph({
  category,
  className,
}: {
  category: JobCategory | "all";
  className?: string;
}) {
  const props: LucideProps = {
    className: cn("shrink-0", className),
    strokeWidth: 2,
    "aria-hidden": true,
  };

  if (category === "all") {
    return <LayoutGrid {...props} />;
  }

  switch (category) {
    case "Barber":
      return <Scissors {...props} />;
    case "Waiter":
    case "Busboy":
      return <UtensilsCrossed {...props} />;
    case "Cleaner":
      return <Sparkles {...props} />;
    case "Delivery Driver":
      return <Bike {...props} />;
    case "Security Guard":
      return <Shield {...props} />;
    case "Cook":
      return <ChefHat {...props} />;
    case "Butcher":
      return <Beef {...props} />;
    case "Driver":
      return <Car {...props} />;
    case "Shop Assistant":
      return <ShoppingBag {...props} />;
    default:
      return <Package {...props} />;
  }
}
