import { SupabaseClient } from "@supabase/supabase-js"

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      cinemas: {
        Row: {
          address: string | null
          arrondissement: number | null
          id: string
          link: string | null
          name: string | null
          slug: string | null
          source: string | null
        }
        Insert: {
          address?: string | null
          arrondissement?: number | null
          id: string
          link?: string | null
          name?: string | null
          slug?: string | null
          source?: string | null
        }
        Update: {
          address?: string | null
          arrondissement?: number | null
          id?: string
          link?: string | null
          name?: string | null
          slug?: string | null
          source?: string | null
        }
        Relationships: []
      }
      movies: {
        Row: {
          director: string | null
          duration: number | null
          id: number
          imdbId: string | null
          poster: string | null
          posterThumb: string | null
          release: string | null
          synopsis: string | null
          title: string | null
          hide: boolean | null
        }
        Insert: {
          director?: string | null
          duration?: number | null
          id: number
          imdbId?: string | null
          hide?: boolean | null
          poster?: string | null
          posterThumb?: string | null
          release?: string | null
          synopsis?: string | null
          title?: string | null
        }
        Update: {
          director?: string | null
          duration?: number | null
          id?: number
          imdbId?: string | null
          hide?: boolean | null
          poster?: string | null
          posterThumb?: string | null
          release?: string | null
          synopsis?: string | null
          title?: string | null
        }
        Relationships: []
      }
      shows: {
        Row: {
          avpType: string | null
          cinemaId: string
          date: string | null
          id: string
          language: string | null
          linkMovie: string | null
          linkShow: string | null
          movieId: number
        }
        Insert: {
          avpType?: string | null
          cinemaId: string
          date?: string | null
          id: string
          language?: string | null
          linkMovie?: string | null
          linkShow?: string | null
          movieId: number
        }
        Update: {
          avpType?: string | null
          cinemaId?: string
          date?: string | null
          id?: string
          language?: string | null
          linkMovie?: string | null
          linkShow?: string | null
          movieId?: number
        }
        Relationships: [
          {
            foreignKeyName: "shows_cinemaId_fkey"
            columns: ["cinemaId"]
            isOneToOne: false
            referencedRelation: "cinemas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shows_movieId_fkey"
            columns: ["movieId"]
            isOneToOne: false
            referencedRelation: "movies"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      multiplex: "pathe" | "ugc" | "mk2"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
      PublicSchema["Views"])
  ? (PublicSchema["Tables"] &
      PublicSchema["Views"])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
  ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
  ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
  ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never

export type TypedSupabaseClient = SupabaseClient<Database>
