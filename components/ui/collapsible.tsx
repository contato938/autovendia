"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const Collapsible = React.forwardRef<
  HTMLDivElement,
  {
    open?: boolean
    onOpenChange?: (open: boolean) => void
    defaultOpen?: boolean
    asChild?: boolean
    className?: string
    children: React.ReactNode
  } & React.HTMLAttributes<HTMLDivElement>
>(({ open: controlledOpen, onOpenChange, defaultOpen, className, children, ...props }, ref) => {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(defaultOpen || false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen

  const handleOpenChange = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  // Provide context for children
  return (
    <CollapsibleContext.Provider value={{ open, onOpenChange: handleOpenChange }}>
      <div
        ref={ref}
        data-state={open ? "open" : "closed"}
        className={className}
        {...props}
      >
        {children}
      </div>
    </CollapsibleContext.Provider>
  )
})
Collapsible.displayName = "Collapsible"

const CollapsibleContext = React.createContext<{
  open?: boolean
  onOpenChange?: (open: boolean) => void
}>({})

const CollapsibleTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: boolean }
>(({ className, children, onClick, asChild, ...props }, ref) => {
  const { open, onOpenChange } = React.useContext(CollapsibleContext)
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    onClick?.(e)
    onOpenChange?.(!open)
  }

  const Comp = asChild ? React.Slot : "button" as any

  if (asChild) {
     return (
        <div onClick={handleClick as any}>
            {children}
        </div>
     )
  }

  return (
    <button
      ref={ref}
      type="button"
      onClick={handleClick}
      data-state={open ? "open" : "closed"}
      className={className}
      {...props}
    >
      {children}
    </button>
  )
})
CollapsibleTrigger.displayName = "CollapsibleTrigger"

const CollapsibleContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => {
  const { open } = React.useContext(CollapsibleContext)
  
  if (!open) return null

  return (
    <div
      ref={ref}
      data-state="open"
      className={cn("overflow-hidden data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down", className)}
      {...props}
    >
      {children}
    </div>
  )
})
CollapsibleContent.displayName = "CollapsibleContent"

export { Collapsible, CollapsibleTrigger, CollapsibleContent }
