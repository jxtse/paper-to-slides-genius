
// import { useTheme } from "next-themes" // Temporarily comment out or remove if not configured
import { Toaster as SonnerPrimitive, toast } from "sonner" // Renamed to avoid conflict

type ToasterProps = React.ComponentProps<typeof SonnerPrimitive>

const SonnerToaster = ({ ...props }: ToasterProps) => { // Renamed component
  // const { theme = "system" } = useTheme() // Temporarily comment out

  return (
    <SonnerPrimitive
      // theme={theme as ToasterProps["theme"]} // Temporarily comment out
      theme="light" // Set a default theme or make it configurable
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground",
        },
      }}
      {...props}
    />
  )
}

export { SonnerToaster as Sonner, toast } // Export renamed component
