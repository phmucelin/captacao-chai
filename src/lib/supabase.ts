import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      contacts: {
        Row: {
          id: string
          name: string
          phone: string
          status: 'pending' | 'sent' | 'error'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          phone: string
          status?: 'pending' | 'sent' | 'error'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          phone?: string
          status?: 'pending' | 'sent' | 'error'
          created_at?: string
          updated_at?: string
        }
      }
      default_message: {
        Row: {
          id: string
          message: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          message: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          message?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
