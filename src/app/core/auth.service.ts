import { Injectable } from '@angular/core';
import { Observable, from, BehaviorSubject, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

export interface UserProfile {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  tenant_id: string;
  user_type: string;
  role: string;
}

/**
 * Servicio de autenticación integrado con Supabase.
 * Maneja login, logout, registro y gestión de perfiles.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<UserProfile | null>(null);
  private currentUser: User | null = null;
  private initialized = false;

  constructor(private supabase: SupabaseService) {
    console.log('[AuthService] Initializing with Supabase integration');
    
    // Inicializar inmediatamente sin bloqueos
    this.userSubject.next(null);
    this.initialized = true;
    
    // Configurar listener de cambios de autenticación inmediatamente
    this.setupAuthListener();
    
    console.log('[AuthService] Initialization complete');
  }

  private setupAuthListener() {
    try {
      this.supabase.auth.onAuthStateChange((event, session) => {
        console.log('[AuthService] Auth state change:', event, session?.user?.email);
        console.log('🔍 [AuthService] Session object:', session);
        console.log('🔍 [AuthService] User object:', session?.user);
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('✅ [AuthService] Procesando SIGNED_IN:', event);
          this.currentUser = session.user;
          console.log('🔄 [AuthService] Llamando a loadUserProfile...');
          this.loadUserProfile(session.user.id);
        } else if (event === 'INITIAL_SESSION' && session?.user) {
          console.log('✅ [AuthService] Procesando INITIAL_SESSION:', event);
          this.currentUser = session.user;
          console.log('🔄 [AuthService] Llamando a loadUserProfile...');
          this.loadUserProfile(session.user.id);
        } else {
          // Para cualquier otro evento (SIGNED_OUT, etc.)
          console.log('❌ [AuthService] Condición no cumplida - event:', event, 'user:', !!session?.user);
          this.currentUser = null;
          this.userSubject.next(null);
        }
      });
      
      // Verificar sesión inicial inmediatamente
      console.log('🔄 [AuthService] Verificando sesión inicial...');
      this.checkActiveSession();
    } catch (error) {
      console.error('[AuthService] Error setting up auth listener:', error);
      // En caso de error, asegurar que emitimos null
      this.userSubject.next(null);
    }
  }

  private async checkActiveSession() {
    try {
      console.log('🔍 [AuthService] Obteniendo sesión actual...');
      const { data: { session } } = await this.supabase.auth.getSession();
      console.log('🔍 [AuthService] Sesión obtenida:', session);
      
      if (session?.user) {
        console.log('✅ [AuthService] Sesión activa encontrada, cargando perfil...');
        this.currentUser = session.user;
        this.loadUserProfile(session.user.id);
      } else {
        console.log('❌ [AuthService] No hay sesión activa');
        // No hay sesión activa, emitir null para indicar que no hay usuario
        this.userSubject.next(null);
      }
    } catch (error) {
      console.error('Error checking session:', error);
      this.userSubject.next(null);
    } finally {
      this.initialized = true;
    }
  }

  private async loadUserProfile(userId: string) {
    console.log('🔄 [AuthService] loadUserProfile llamado para userId:', userId);
    console.log('👤 [AuthService] currentUser data:', this.currentUser);
    
    try {
      // Crear perfil básico con datos de Supabase Auth
      const userProfile: UserProfile = {
        id: userId,
        email: this.currentUser?.email || '',
        first_name: this.currentUser?.user_metadata?.['first_name'] || 'Usuario',
        last_name: this.currentUser?.user_metadata?.['last_name'] || '',
        full_name: `${this.currentUser?.user_metadata?.['first_name'] || 'Usuario'} ${this.currentUser?.user_metadata?.['last_name'] || ''}`.trim(),
        tenant_id: this.currentUser?.user_metadata?.['tenant_id'] || 'default',
        user_type: this.currentUser?.user_metadata?.['user_type'] || 'usuario_basico',
        role: this.currentUser?.user_metadata?.['user_type'] === 'administrador' ? 'administrador' : 'usuario'
      };
      
      console.log('[AuthService] User profile created from auth data:', userProfile);
      console.log('📤 [AuthService] Emitiendo usuario al BehaviorSubject');
      this.userSubject.next(userProfile);
    } catch (error) {
      console.error('Error creating user profile:', error);
      // En caso de error, crear perfil mínimo
      const minimalProfile: UserProfile = {
        id: userId,
        email: this.currentUser?.email || '',
        first_name: 'Usuario',
        last_name: '',
        full_name: 'Usuario',
        tenant_id: 'default',
        user_type: 'usuario_basico',
        role: 'usuario'
      };
      this.userSubject.next(minimalProfile);
    }
  }

  /**
   * Realiza el login del usuario con Supabase.
   * @param credentials Objeto con email y password.
   * @returns Observable con el resultado del login.
   */
  async login(credentials: { username: string; password: string }): Promise<any> {
    console.log('[AuthService] Login attempt for:', credentials.username);
    
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email: credentials.username,
        password: credentials.password
      });

      if (error) {
        console.error('[AuthService] Login error:', error);
        throw error;
      }

      console.log('[AuthService] Login successful:', data);
      
      // Load user profile after successful login
      if (data.user) {
        await this.loadUserProfile(data.user.id);
      }
      
      return { token: data.session?.access_token, user: data.user };
    } catch (error) {
      console.error('[AuthService] Login exception:', error);
      throw error;
    }
  }

  /**
   * Registra un nuevo usuario con Supabase.
   * @param data Datos del usuario a registrar
   * @returns Observable con resultado del registro
   */
  register(data: { 
    nombre: string, 
    email: string, 
    password: string, 
    rol: string,
    tenant_id: string,
    apellido?: string 
  }): Observable<any> {
    const userData = {
      tenant_id: data.tenant_id,
      user_type: data.rol === 'administrador' ? 'administrador' : 'usuario_basico',
      first_name: data.nombre,
      last_name: data.apellido || ''
    };

    return from(this.supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: userData
      }
    })).pipe(
      map(({ data: authData, error }) => {
        if (error) {
          throw error;
        }
        return { 
          message: 'Usuario registrado correctamente',
          user: authData.user 
        };
      }),
      catchError((error) => {
        console.error('Register error:', error);
        throw error;
      })
    );
  }

  /**
   * Solicita recuperación de contraseña con Supabase.
   * @param email Email del usuario
   * @returns Observable con mensaje
   */
  forgotPassword(email: string): Observable<any> {
    return from(this.supabase.auth.resetPasswordForEmail(email)).pipe(
      map(({ error }) => {
        if (error) {
          throw error;
        }
        return { message: 'Se ha enviado un correo para restablecer la contraseña' };
      }),
      catchError((error) => {
        console.error('Forgot password error:', error);
        throw error;
      })
    );
  }

  /**
   * Restablece la contraseña usando Supabase.
   * @param newPassword Nueva contraseña
   * @returns Observable con mensaje
   */
  resetPassword(newPassword: string): Observable<any> {
    return from(this.supabase.auth.updateUser({
      password: newPassword
    })).pipe(
      map(({ error }) => {
        if (error) {
          throw error;
        }
        return { message: 'Contraseña restablecida correctamente' };
      }),
      catchError((error) => {
        console.error('Reset password error:', error);
        throw error;
      })
    );
  }

  /**
   * Reenvía el email de confirmación para un usuario.
   * @param email Email del usuario
   * @returns Promise con resultado
   */
  async resendConfirmationEmail(email: string): Promise<any> {
    console.log('📧 [AuthService] Reenviando email de confirmación para:', email);
    try {
      const { error } = await this.supabase.auth.resend({
        type: 'signup',
        email: email
      });

      if (error) {
        console.error('❌ [AuthService] Error reenviando email:', error);
        throw error;
      }

      console.log('✅ [AuthService] Email de confirmación reenviado exitosamente');
      return { message: 'Email de confirmación enviado correctamente' };
    } catch (error) {
      console.error('❌ [AuthService] Error en resendConfirmationEmail:', error);
      throw error;
    }
  }

  /**
   * Cierra la sesión del usuario con Supabase.
   */
  async logout(): Promise<any> {
    console.log('🚪 [AuthService] Iniciando logout...');
    try {
      // Usar signOut con scope 'global' para eliminar sesión de todos los tabs
      const { error } = await this.supabase.auth.signOut({ scope: 'global' });
      
      if (error) {
        console.error('❌ [AuthService] Error en signOut:', error);
        // Continuar con limpieza local incluso si hay error
      }
      
      // Limpiar estado local inmediatamente
      console.log('🧹 [AuthService] Limpiando estado local...');
      this.currentUser = null;
      this.userSubject.next(null);
      
      // Limpiar almacenamiento local manualmente como respaldo
      console.log('🗑️ [AuthService] Limpiando localStorage y sessionStorage...');
      try {
        // Limpiar claves específicas de Supabase
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-')) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
        
        // También limpiar sessionStorage
        const sessionKeysToRemove: string[] = [];
        for (let i = 0; i < sessionStorage.length; i++) {
          const key = sessionStorage.key(i);
          if (key && key.startsWith('sb-')) {
            sessionKeysToRemove.push(key);
          }
        }
        sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
        
        console.log('✅ [AuthService] Storage limpiado exitosamente');
      } catch (storageError) {
        console.error('⚠️ [AuthService] Error limpiando storage:', storageError);
      }
      
      console.log('✅ [AuthService] Logout completado exitosamente');
      return { message: 'Sesión cerrada correctamente' };
    } catch (error) {
      console.error('❌ [AuthService] Error durante logout:', error);
      // Limpiar estado local aunque haya error
      console.log('🧹 [AuthService] Forzando limpieza de estado...');
      this.currentUser = null;
      this.userSubject.next(null);
      throw error;
    }
  }

  /**
   * Obtiene el token JWT de la sesión actual de Supabase.
   * @returns Promise con el token JWT o null si no existe.
   */
  async getToken(): Promise<string | null> {
    const { data: { session } } = await this.supabase.auth.getSession();
    return session?.access_token || null;
  }

  /**
   * Indica si hay un usuario autenticado actualmente.
   * @returns true si hay usuario autenticado, false en caso contrario.
   */
  isLoggedIn(): boolean {
    return !!this.userSubject.value && !!this.currentUser;
  }

  /**
   * Verifica si el usuario tiene un rol específico.
   * @param role Rol a verificar
   * @returns true si el usuario tiene el rol, false en caso contrario.
   */
  hasRole(role: string): boolean {
    return this.userSubject.value?.role === role;
  }

  /**
   * Obtiene el perfil del usuario actual.
   * @returns Perfil del usuario o null si no está autenticado.
   */
  getUser(): UserProfile | null {
    return this.userSubject.value;
  }

  /**
   * Observable del perfil del usuario actual.
   * @returns Observable del perfil del usuario.
   */
  getUser$(): Observable<UserProfile | null> {
    return this.userSubject.asObservable();
  }

  /**
   * Verifica si el servicio ha terminado de inicializar.
   * @returns true si ya se verificó la sesión inicial.
   */
  isInitialized(): boolean {
    return this.initialized;
  }

  /**
   * Obtiene el usuario de Supabase Auth.
   * @returns Usuario de Supabase o null.
   */
  getCurrentSupabaseUser(): User | null {
    return this.currentUser;
  }

  /**
   * Refresca el perfil del usuario actual.
   */
  refreshProfile(): void {
    if (this.currentUser) {
      this.loadUserProfile(this.currentUser.id);
    }
  }

  /**
   * Observable del usuario actual.
   * @returns Observable con el perfil del usuario o null.
   */
  get user$(): Observable<UserProfile | null> {
    return this.userSubject.asObservable();
  }
}
