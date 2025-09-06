import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';

export interface Profile {
  id: string;
  tenant_id: string;
  user_type_id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone?: string;
  birth_date?: string;
  hire_date?: string;
  avatar_url?: string;
  is_active: boolean;
  metadata: any;
  created_at: string;
  updated_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  constructor(private supabase: SupabaseService) {}

  /**
   * Obtiene el perfil del usuario actual
   */
  getMyProfile(): Observable<Profile | null> {
    return from(this.supabase.client.rpc('get_my_profile')).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data && data.length > 0 ? data[0] : null;
      }),
      catchError((error) => {
        console.error('Error getting profile:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene todos los perfiles (solo para administradores)
   */
  getAllProfiles(): Observable<Profile[]> {
    return from(this.supabase.client
      .from('profiles')
      .select('*')
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data || [];
      }),
      catchError((error) => {
        console.error('Error getting all profiles:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza el perfil del usuario actual
   */
  updateMyProfile(updates: Partial<Profile>): Observable<Profile> {
    return from(this.supabase.client
      .from('profiles')
      .update(updates)
      .eq('id', updates.id)
      .select()
      .single()
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data;
      }),
      catchError((error) => {
        console.error('Error updating profile:', error);
        throw error;
      })
    );
  }

  /**
   * Obtiene perfiles con información relacionada
   */
  getProfilesWithDetails(): Observable<any[]> {
    return from(this.supabase.client
      .from('profiles')
      .select(`
        *,
        user_types(name, code),
        tenants(name)
      `)
    ).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data || [];
      }),
      catchError((error) => {
        console.error('Error getting profiles with details:', error);
        throw error;
      })
    );
  }
}
