import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase!: SupabaseClient;

  constructor() {
    console.log('[SupabaseService] Deferred initialization');
    // No inicializar Supabase inmediatamente para evitar bloqueos
  }

  private initializeSupabase() {
    if (!this.supabase) {
      try {
        console.log('[SupabaseService] Creating client...');
        this.supabase = createClient(
          environment.supabase.url,
          environment.supabase.anonKey
        );
        console.log('[SupabaseService] Client created successfully');
      } catch (error) {
        console.error('[SupabaseService] Client creation error:', error);
        throw error;
      }
    }
  }

  get client() {
    this.initializeSupabase();
    return this.supabase;
  }

  // Auth methods
  get auth() {
    this.initializeSupabase();
    return this.supabase.auth;
  }

  // Database methods
  get db() {
    this.initializeSupabase();
    return this.supabase;
  }
}
