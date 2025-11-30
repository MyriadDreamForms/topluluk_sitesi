import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface SeoConfig {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'profile';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  section?: string;
  tags?: string[];
  twitterCard?: 'summary' | 'summary_large_image' | 'app' | 'player';
  twitterCreator?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SeoService {
  private readonly titleService = inject(Title);
  private readonly metaService = inject(Meta);
  private readonly document = inject(DOCUMENT);
  
  private readonly siteName = 'Türkiye Teknoloji Topluluğu';
  private readonly defaultDescription = 'Türkiye\'nin en büyük yazılım geliştirici topluluğu. Sorular sorun, bilgi paylaşın, etkinliklere katılın.';
  private readonly defaultImage = '/assets/images/og-image.png';
  private readonly twitterHandle = '@TurkiyeTechCom';
  private readonly baseUrl = 'https://turkiye-tech.com';
  
  updateSeo(config: SeoConfig): void {
    // Title
    const title = config.title 
      ? `${config.title} | ${this.siteName}`
      : this.siteName;
    this.titleService.setTitle(title);
    
    // Basic meta tags
    this.updateTag('description', config.description || this.defaultDescription);
    
    if (config.keywords && config.keywords.length > 0) {
      this.updateTag('keywords', config.keywords.join(', '));
    }
    
    if (config.author) {
      this.updateTag('author', config.author);
    }
    
    // Robots
    if (config.noIndex) {
      this.updateTag('robots', 'noindex, nofollow');
    } else {
      this.updateTag('robots', 'index, follow');
    }
    
    // Open Graph
    this.updateProperty('og:site_name', this.siteName);
    this.updateProperty('og:title', config.title || this.siteName);
    this.updateProperty('og:description', config.description || this.defaultDescription);
    this.updateProperty('og:type', config.type || 'website');
    this.updateProperty('og:image', config.image || this.defaultImage);
    this.updateProperty('og:url', config.url || this.baseUrl);
    this.updateProperty('og:locale', 'tr_TR');
    
    // Article specific
    if (config.type === 'article') {
      if (config.publishedTime) {
        this.updateProperty('article:published_time', config.publishedTime);
      }
      if (config.modifiedTime) {
        this.updateProperty('article:modified_time', config.modifiedTime);
      }
      if (config.author) {
        this.updateProperty('article:author', config.author);
      }
      if (config.section) {
        this.updateProperty('article:section', config.section);
      }
      if (config.tags && config.tags.length > 0) {
        config.tags.forEach(tag => {
          this.metaService.addTag({ property: 'article:tag', content: tag });
        });
      }
    }
    
    // Twitter Card
    this.updateTag('twitter:card', config.twitterCard || 'summary_large_image');
    this.updateTag('twitter:site', this.twitterHandle);
    this.updateTag('twitter:title', config.title || this.siteName);
    this.updateTag('twitter:description', config.description || this.defaultDescription);
    this.updateTag('twitter:image', config.image || this.defaultImage);
    
    if (config.twitterCreator) {
      this.updateTag('twitter:creator', config.twitterCreator);
    }
    
    // Canonical URL
    this.updateCanonical(config.canonicalUrl || config.url);
  }
  
  setTitle(title: string): void {
    this.titleService.setTitle(`${title} | ${this.siteName}`);
    this.updateProperty('og:title', title);
    this.updateTag('twitter:title', title);
  }
  
  setDescription(description: string): void {
    this.updateTag('description', description);
    this.updateProperty('og:description', description);
    this.updateTag('twitter:description', description);
  }
  
  setKeywords(keywords: string[]): void {
    this.updateTag('keywords', keywords.join(', '));
  }
  
  setImage(imageUrl: string): void {
    const fullUrl = imageUrl.startsWith('http') ? imageUrl : `${this.baseUrl}${imageUrl}`;
    this.updateProperty('og:image', fullUrl);
    this.updateTag('twitter:image', fullUrl);
  }
  
  setArticle(config: {
    title: string;
    description: string;
    author: string;
    publishedTime: string;
    modifiedTime?: string;
    tags?: string[];
    image?: string;
  }): void {
    this.updateSeo({
      ...config,
      type: 'article'
    });
  }
  
  setProfile(config: {
    username: string;
    displayName: string;
    bio?: string;
    image?: string;
  }): void {
    this.updateSeo({
      title: `${config.displayName} (@${config.username})`,
      description: config.bio || `${config.displayName} profili - Türkiye Teknoloji Topluluğu`,
      type: 'profile',
      image: config.image
    });
    
    this.updateProperty('profile:username', config.username);
  }
  
  setQuestion(config: {
    title: string;
    description: string;
    author: string;
    createdAt: string;
    tags?: string[];
    answerCount?: number;
  }): void {
    const description = config.description.length > 160 
      ? config.description.substring(0, 157) + '...' 
      : config.description;
    
    this.updateSeo({
      title: config.title,
      description,
      type: 'article',
      author: config.author,
      publishedTime: config.createdAt,
      tags: config.tags
    });
  }
  
  setEvent(config: {
    title: string;
    description: string;
    startDate: string;
    endDate?: string;
    location?: string;
    image?: string;
  }): void {
    const eventDescription = config.location 
      ? `${config.description} - ${config.location}` 
      : config.description;
    
    this.updateSeo({
      title: config.title,
      description: eventDescription,
      type: 'article',
      image: config.image
    });
    
    // Add event structured data
    this.addStructuredData({
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: config.title,
      description: config.description,
      startDate: config.startDate,
      endDate: config.endDate || config.startDate,
      location: config.location ? {
        '@type': 'Place',
        name: config.location
      } : undefined,
      image: config.image
    });
  }
  
  // Alias for updateSeo - for convenience
  updateTags(config: SeoConfig): void {
    this.updateSeo(config);
  }
  
  resetToDefaults(): void {
    this.titleService.setTitle(this.siteName);
    this.updateTag('description', this.defaultDescription);
    this.updateTag('robots', 'index, follow');
    this.updateProperty('og:title', this.siteName);
    this.updateProperty('og:description', this.defaultDescription);
    this.updateProperty('og:type', 'website');
    this.updateProperty('og:image', this.defaultImage);
    this.updateProperty('og:url', this.baseUrl);
    this.removeCanonical();
    this.removeStructuredData();
  }
  
  private updateTag(name: string, content: string): void {
    this.metaService.updateTag({ name, content });
  }
  
  private updateProperty(property: string, content: string): void {
    this.metaService.updateTag({ property, content });
  }
  
  private updateCanonical(url?: string): void {
    this.removeCanonical();
    
    if (url) {
      const link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      link.setAttribute('href', url.startsWith('http') ? url : `${this.baseUrl}${url}`);
      this.document.head.appendChild(link);
    }
  }
  
  private removeCanonical(): void {
    const existing = this.document.querySelector('link[rel="canonical"]');
    if (existing) {
      existing.remove();
    }
  }
  
  addStructuredData(data: object): void {
    this.removeStructuredData();
    
    const script = this.document.createElement('script');
    script.setAttribute('type', 'application/ld+json');
    script.setAttribute('id', 'structured-data');
    script.textContent = JSON.stringify(data);
    this.document.head.appendChild(script);
  }
  
  private removeStructuredData(): void {
    const existing = this.document.getElementById('structured-data');
    if (existing) {
      existing.remove();
    }
  }
}
