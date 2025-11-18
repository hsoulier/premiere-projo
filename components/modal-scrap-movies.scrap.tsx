"use client"

import { Button } from "@/components/ui/button"
import type { ComponentProps } from "react"

export const ScrapProviderButton = (props: ComponentProps<typeof Button>) => {
  // const router = useRouter()
  // const supabase = useSupabaseBrowser()

  return <Button variant="outline" {...props} />
}
