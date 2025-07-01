import { useTheme } from "next-themes"
import type { ComponentProps } from "react"

export const LouxorIcon = ({
  special = false,
  ...props
}: ComponentProps<"img"> & { special?: boolean }) => {
  const { resolvedTheme } = useTheme()

  if (resolvedTheme === "light" && special) {
    return <img {...props} src="/louxor-black.png" alt="Louxor Dark Icon" />
  }

  if (special) {
    return <img {...props} src="/louxor.png" alt="Louxor Icon" />
  }
  return <img {...props} src="/louxor.png" alt="Louxor" />
}
