import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export interface ApiError {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Beklenmeyen bir hata oluştu';
      
      if (error.error instanceof ErrorEvent) {
        // Client-side error
        errorMessage = error.error.message;
      } else {
        // Server-side error
        const apiError = error.error as ApiError;
        
        if (apiError?.message) {
          errorMessage = apiError.message;
        } else {
          switch (error.status) {
            case 400:
              errorMessage = 'Geçersiz istek';
              break;
            case 401:
              errorMessage = 'Oturum süreniz doldu, lütfen tekrar giriş yapın';
              break;
            case 403:
              errorMessage = 'Bu işlem için yetkiniz yok';
              break;
            case 404:
              errorMessage = 'İstenen kaynak bulunamadı';
              break;
            case 429:
              errorMessage = 'Çok fazla istek gönderildi, lütfen bekleyin';
              break;
            case 500:
              errorMessage = 'Sunucu hatası, lütfen daha sonra tekrar deneyin';
              break;
            case 0:
              errorMessage = 'Sunucuya bağlanılamıyor';
              break;
          }
        }
      }

      console.error('HTTP Error:', {
        status: error.status,
        message: errorMessage,
        url: req.url
      });

      return throwError(() => ({
        status: error.status,
        message: errorMessage,
        errors: (error.error as ApiError)?.errors
      }));
    })
  );
};
