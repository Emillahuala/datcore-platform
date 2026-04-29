// Generado por Supabase CLI — no editar a mano
// npx supabase gen types typescript --project-id <id> > src/types/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  dbasesorias: {
    Tables: {
      mae_empresa: {
        Row: {
          id: string
          nombre: string
          sector: string | null
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          sector?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          sector?: string | null
          created_at?: string
        }
      }
      mae_usuario: {
        Row: {
          id: string
          auth_user_id: string
          nombre: string
          id_mae_empresa: string
          created_at: string
        }
        Insert: {
          id?: string
          auth_user_id: string
          nombre: string
          id_mae_empresa: string
          created_at?: string
        }
        Update: {
          id?: string
          auth_user_id?: string
          nombre?: string
          id_mae_empresa?: string
          created_at?: string
        }
      }
      mae_proyecto: {
        Row: {
          id: string
          nombre: string
          id_mae_empresa: string
          id_mae_usuario_po: string
          created_at: string
        }
        Insert: {
          id?: string
          nombre: string
          id_mae_empresa: string
          id_mae_usuario_po: string
          created_at?: string
        }
        Update: {
          id?: string
          nombre?: string
          id_mae_empresa?: string
          id_mae_usuario_po?: string
          created_at?: string
        }
      }
      movusuariorol: {
        Row: {
          id: string
          id_mae_usuario: string
          rol: string
          id_mae_empresa: string | null
          id_mae_proyecto: string | null
          id_area: string | null
          created_at: string
        }
        Insert: {
          id?: string
          id_mae_usuario: string
          rol: string
          id_mae_empresa?: string | null
          id_mae_proyecto?: string | null
          id_area?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          id_mae_usuario?: string
          rol?: string
          id_mae_empresa?: string | null
          id_mae_proyecto?: string | null
          id_area?: string | null
          created_at?: string
        }
      }
    }
  }
}
