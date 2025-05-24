export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      clothes: {
        Row: {
          id: string
          created_at: string
          user_id: string
          name: string
          category: string
          season: string[]
          tags: string[]
          image_url: string
          description: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          name: string
          category: string
          season: string[]
          tags: string[]
          image_url: string
          description?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          name?: string
          category?: string
          season?: string[]
          tags?: string[]
          image_url?: string
          description?: string | null
        }
      }
    }
  }
}
