import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';

export interface TokenData {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
  private readonly TOKEN_KEY = 'loopi_auth_token';
  private readonly SECRET_KEY = 'loopi_app_secret_2024'; // En producción, esto debería venir del environment
  
  /**
   * Almacena un token de forma segura con encriptación
   */
  setToken(token: string, expiresIn?: number): void {
    const expiresAt = expiresIn 
      ? Date.now() + (expiresIn * 1000) 
      : Date.now() + (24 * 60 * 60 * 1000); // 24 horas por defecto

    const tokenData: TokenData = {
      token,
      expiresAt
    };

    const encrypted = this.encrypt(JSON.stringify(tokenData));
    localStorage.setItem(this.TOKEN_KEY, encrypted);
  }

  /**
   * Obtiene el token desencriptado si es válido
   */
  getToken(): string | null {
    try {
      const encrypted = localStorage.getItem(this.TOKEN_KEY);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      if (!decrypted) return null;

      const tokenData: TokenData = JSON.parse(decrypted);
      
      // Verificar si el token ha expirado
      if (Date.now() > tokenData.expiresAt) {
        this.clearToken();
        return null;
      }

      return tokenData.token;
    } catch (error) {
      console.error('Error al obtener token:', error);
      this.clearToken();
      return null;
    }
  }

  /**
   * Verifica si existe un token válido
   */
  hasValidToken(): boolean {
    return this.getToken() !== null;
  }

  /**
   * Obtiene el tiempo restante antes de que expire el token (en segundos)
   */
  getTokenExpirationTime(): number | null {
    try {
      const encrypted = localStorage.getItem(this.TOKEN_KEY);
      if (!encrypted) return null;

      const decrypted = this.decrypt(encrypted);
      if (!decrypted) return null;

      const tokenData: TokenData = JSON.parse(decrypted);
      const remainingTime = Math.max(0, Math.floor((tokenData.expiresAt - Date.now()) / 1000));
      
      return remainingTime;
    } catch (error) {
      return null;
    }
  }

  /**
   * Verifica si el token expirará pronto (dentro de 5 minutos)
   */
  isTokenExpiringSoon(): boolean {
    const expirationTime = this.getTokenExpirationTime();
    return expirationTime !== null && expirationTime < 300; // 5 minutos
  }

  /**
   * Limpia el token almacenado
   */
  clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
  }

  /**
   * Encripta un string usando AES
   */
  private encrypt(text: string): string {
    return CryptoJS.AES.encrypt(text, this.SECRET_KEY).toString();
  }

  /**
   * Desencripta un string usando AES
   */
  private decrypt(encryptedText: string): string | null {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedText, this.SECRET_KEY);
      return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
      console.error('Error al desencriptar:', error);
      return null;
    }
  }

  /**
   * Actualiza solo la fecha de expiración del token actual
   */
  refreshTokenExpiration(expiresIn: number): boolean {
    try {
      const encrypted = localStorage.getItem(this.TOKEN_KEY);
      if (!encrypted) return false;

      const decrypted = this.decrypt(encrypted);
      if (!decrypted) return false;

      const tokenData: TokenData = JSON.parse(decrypted);
      tokenData.expiresAt = Date.now() + (expiresIn * 1000);

      const newEncrypted = this.encrypt(JSON.stringify(tokenData));
      localStorage.setItem(this.TOKEN_KEY, newEncrypted);
      
      return true;
    } catch (error) {
      console.error('Error al refrescar expiración:', error);
      return false;
    }
  }
}
