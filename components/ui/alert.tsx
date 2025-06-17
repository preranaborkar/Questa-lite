// components/ui/alert.tsx
import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertTriangle, Info, CheckCircle2, XCircle } from "lucide-react";

const variantIcons = {
  default: Info,
  destructive: XCircle,
  warning: AlertTriangle,
  success: CheckCircle2,
};

type AlertProps = React.HTMLAttributes<HTMLDivElement> & {
  variant?: "default" | "destructive" | "warning" | "success";
};

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const Icon = variantIcons[variant] ?? Info;

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative w-full rounded-lg border p-4 flex items-start space-x-3",
          variant === "default" && "bg-blue-50 text-blue-900 border-blue-200",
          variant === "destructive" && "bg-red-50 text-red-900 border-red-200",
          variant === "warning" && "bg-yellow-50 text-yellow-900 border-yellow-200",
          variant === "success" && "bg-green-50 text-green-900 border-green-200",
          className
        )}
        {...props}
      >
        <Icon className="h-5 w-5 mt-0.5 flex-shrink-0" />
        <div>{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
AlertDescription.displayName = "AlertDescription";

export { Alert, AlertDescription };
