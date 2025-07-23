import useSupabaseBrowser from "@/hooks/use-supabase-browser"
import type { User } from "@supabase/supabase-js"
import * as React from "react"

export function useAuth() {
  const [user, setUser] = React.useState<User>()

  const supabase = useSupabaseBrowser()

  React.useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange(async (_, session) => {
      const user = session?.user

      setUser(user)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  return user
}
