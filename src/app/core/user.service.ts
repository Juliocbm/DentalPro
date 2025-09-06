import { Injectable, inject } from '@angular/core';
import { Observable, from, BehaviorSubject } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { UserProfile } from './auth.service';

export interface SystemUser {
  id: string;
  email: string;
  full_name: string;
  first_name: string;
  last_name: string;
  role: string;
  user_type: string;
  tenant_id: string;
  created_at: string;
  email_confirmed_at?: string;
  last_sign_in_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private supabase = inject(SupabaseService);
  private usersSubject = new BehaviorSubject<SystemUser[]>([]);
  
  users$ = this.usersSubject.asObservable();

  /**
   * Obtiene todos los usuarios del sistema desde la tabla profiles
   */
  async getAllUsers(): Promise<SystemUser[]> {
    console.log('👥 [UserService] Obteniendo todos los usuarios desde profiles...');
    
    try {
      const { data, error } = await this.supabase.client
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('❌ [UserService] Error obteniendo usuarios:', error);
        throw error;
      }

      const systemUsers: SystemUser[] = data.map(profile => ({
        id: profile.id,
        email: profile.email || '',
        full_name: profile.full_name || 'Sin nombre',
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        role: profile.role || 'usuario',
        user_type: profile.user_type || 'usuario_basico',
        tenant_id: profile.tenant_id || 'default',
        created_at: profile.created_at,
        email_confirmed_at: profile.email_confirmed_at || undefined,
        last_sign_in_at: profile.last_sign_in_at || undefined
      }));

      console.log('✅ [UserService] Usuarios obtenidos desde profiles:', systemUsers.length);
      this.usersSubject.next(systemUsers);
      
      return systemUsers;
    } catch (error) {
      console.error('❌ [UserService] Error en getAllUsers:', error);
      throw error;
    }
  }

  /**
   * Obtiene un usuario específico por ID
   */
  async getUserById(userId: string): Promise<SystemUser | null> {
    console.log('👤 [UserService] Obteniendo usuario por ID:', userId);
    
    try {
      const { data, error } = await this.supabase.auth.admin.getUserById(userId);
      
      if (error) {
        console.error('❌ [UserService] Error obteniendo usuario:', error);
        throw error;
      }

      if (!data.user) {
        return null;
      }

      const user = data.user;
      const systemUser: SystemUser = {
        id: user.id,
        email: user.email || '',
        full_name: `${user.user_metadata?.['first_name'] || ''} ${user.user_metadata?.['last_name'] || ''}`.trim() || 'Sin nombre',
        first_name: user.user_metadata?.['first_name'] || '',
        last_name: user.user_metadata?.['last_name'] || '',
        role: user.user_metadata?.['user_type'] === 'administrador' ? 'administrador' : 'usuario',
        user_type: user.user_metadata?.['user_type'] || 'usuario_basico',
        tenant_id: user.user_metadata?.['tenant_id'] || 'default',
        created_at: user.created_at,
        email_confirmed_at: user.email_confirmed_at || undefined,
        last_sign_in_at: user.last_sign_in_at || undefined
      };

      console.log('✅ [UserService] Usuario obtenido:', systemUser);
      return systemUser;
    } catch (error) {
      console.error('❌ [UserService] Error en getUserById:', error);
      throw error;
    }
  }

  /**
   * Actualiza los metadatos de un usuario
   */
  async updateUserMetadata(userId: string, metadata: any): Promise<void> {
    console.log('📝 [UserService] Actualizando metadatos del usuario:', userId);
    
    try {
      const { error } = await this.supabase.auth.admin.updateUserById(userId, {
        user_metadata: metadata
      });
      
      if (error) {
        console.error('❌ [UserService] Error actualizando usuario:', error);
        throw error;
      }

      console.log('✅ [UserService] Usuario actualizado exitosamente');
      // Refrescar la lista de usuarios
      await this.getAllUsers();
    } catch (error) {
      console.error('❌ [UserService] Error en updateUserMetadata:', error);
      throw error;
    }
  }

  /**
   * Elimina un usuario del sistema
   */
  async deleteUser(userId: string): Promise<void> {
    console.log('🗑️ [UserService] Eliminando usuario:', userId);
    
    try {
      const { error } = await this.supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        console.error('❌ [UserService] Error eliminando usuario:', error);
        throw error;
      }

      console.log('✅ [UserService] Usuario eliminado exitosamente');
      // Refrescar la lista de usuarios
      await this.getAllUsers();
    } catch (error) {
      console.error('❌ [UserService] Error en deleteUser:', error);
      throw error;
    }
  }
}
