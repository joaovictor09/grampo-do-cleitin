import { useState } from "react";
import { Check, Clipboard } from "lucide-react";
import { cn } from "#/lib/utils";
import { Button, buttonVariants } from "#/components/ui/button";
import type { VariantProps } from "class-variance-authority";

interface CopyButtonProps extends VariantProps<typeof buttonVariants> {
  value: string
  className?: string
}

export function CopyButton({ value, className, size = "icon-xs", variant = "ghost" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(value)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Button
      size={size}
      variant={variant}
      onClick={handleCopy}
      className={cn("shrink-0", className)}
    >
      {copied ? <Check className="text-emerald-400" /> : <Clipboard />}
    </Button>
  )
}
