import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const alertVariants = cva("w-full rounded-lg border px-4 py-3 text-sm", {
  variants: {
    variant: {
      default: "border-slate-200 bg-slate-50 text-slate-700",
      success: "border-green-200 bg-green-50 text-green-700",
      error: "border-red-200 bg-red-50 text-red-700",
      info: "border-sky-200 bg-sky-50 text-sky-700",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

function Alert({ className, variant, ...props }: AlertProps) {
  return <div role="alert" className={cn(alertVariants({ variant }), className)} {...props} />;
}

export { Alert };
