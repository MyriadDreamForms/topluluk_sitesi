import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true,
  pure: true
})
export class TimeAgoPipe implements PipeTransform {
  transform(value: Date | string | number | null | undefined): string {
    if (!value) {
      return '';
    }
    
    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (seconds < 0) {
      return this.formatFuture(Math.abs(seconds));
    }
    
    return this.formatPast(seconds);
  }
  
  private formatPast(seconds: number): string {
    const intervals: { [key: string]: number } = {
      yıl: 31536000,
      ay: 2592000,
      hafta: 604800,
      gün: 86400,
      saat: 3600,
      dakika: 60,
      saniye: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      
      if (interval >= 1) {
        if (interval === 1) {
          switch (unit) {
            case 'saniye':
              return 'az önce';
            case 'dakika':
              return '1 dakika önce';
            case 'saat':
              return '1 saat önce';
            case 'gün':
              return 'dün';
            case 'hafta':
              return '1 hafta önce';
            case 'ay':
              return '1 ay önce';
            case 'yıl':
              return '1 yıl önce';
            default:
              return `${interval} ${unit} önce`;
          }
        }
        return `${interval} ${unit} önce`;
      }
    }
    
    return 'az önce';
  }
  
  private formatFuture(seconds: number): string {
    const intervals: { [key: string]: number } = {
      yıl: 31536000,
      ay: 2592000,
      hafta: 604800,
      gün: 86400,
      saat: 3600,
      dakika: 60,
      saniye: 1
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      
      if (interval >= 1) {
        if (interval === 1) {
          switch (unit) {
            case 'saniye':
              return 'birazdan';
            case 'dakika':
              return '1 dakika içinde';
            case 'saat':
              return '1 saat içinde';
            case 'gün':
              return 'yarın';
            case 'hafta':
              return '1 hafta içinde';
            case 'ay':
              return '1 ay içinde';
            case 'yıl':
              return '1 yıl içinde';
            default:
              return `${interval} ${unit} içinde`;
          }
        }
        return `${interval} ${unit} içinde`;
      }
    }
    
    return 'birazdan';
  }
}
