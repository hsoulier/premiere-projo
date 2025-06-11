import { useTheme } from "next-themes"
import type { ComponentProps } from "react"

export const GrandRexIcon = ({
  special = false,
  ...props
}: ComponentProps<"img"> & { special?: boolean }) => {
  const { theme } = useTheme()

  if (theme !== "dark" && special) {
    return (
      <img {...props} src="/grand-rex-black.png" alt="Grand Rex Dark Icon" />
    )
  }

  if (special) {
    return <img {...props} src="/grand-rex.png" alt="Grand Rex Icon" />
  }
  return <img {...props} src="/grand-rex.png" alt="Grand Rex" />
}
