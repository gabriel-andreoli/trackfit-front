
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingProps {
  className?: string;
  size?: number;
  text?: string;
}

export function Loading({ className, size = 24, text }: LoadingProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <Loader2 
        className="animate-spin text-muted-foreground" 
        size={size}
      />
      {text && (
        <p className="text-muted-foreground mt-2 text-sm">{text}</p>
      )}
    </div>
  );
}
