"use client"

import { ThemeProvider } from "next-themes"
import type { ReactNode } from "react"
import { QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { getQueryClient } from "@/lib/query-client"

const ReactQueryClientProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const queryClient = getQueryClient()

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {!process.env.NEXT_PUBLIC_PROD && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}

export const Providers = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <ReactQueryClientProvider>{children}</ReactQueryClientProvider>
    </ThemeProvider>
  )
}
