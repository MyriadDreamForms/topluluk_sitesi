import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

export interface JsonLdArticle {
  '@context': 'https://schema.org';
  '@type': 'Article' | 'BlogPosting' | 'TechArticle';
  headline: string;
  description?: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  author: {
    '@type': 'Person';
    name: string;
    url?: string;
  };
  publisher: {
    '@type': 'Organization';
    name: string;
    logo?: {
      '@type': 'ImageObject';
      url: string;
    };
  };
  mainEntityOfPage?: {
    '@type': 'WebPage';
    '@id': string;
  };
  keywords?: string[];
}

export interface JsonLdQuestion {
  '@context': 'https://schema.org';
  '@type': 'QAPage';
  mainEntity: {
    '@type': 'Question';
    name: string;
    text: string;
    answerCount: number;
    dateCreated?: string;
    author?: {
      '@type': 'Person';
      name: string;
    };
    acceptedAnswer?: {
      '@type': 'Answer';
      text: string;
      dateCreated?: string;
      author?: {
        '@type': 'Person';
        name: string;
      };
    };
    suggestedAnswer?: Array<{
      '@type': 'Answer';
      text: string;
      dateCreated?: string;
      author?: {
        '@type': 'Person';
        name: string;
      };
    }>;
  };
}

export interface JsonLdEvent {
  '@context': 'https://schema.org';
  '@type': 'Event';
  name: string;
  description?: string;
  startDate: string;
  endDate?: string;
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  eventAttendanceMode?: 'OnlineEventAttendanceMode' | 'OfflineEventAttendanceMode' | 'MixedEventAttendanceMode';
  location?: {
    '@type': 'VirtualLocation' | 'Place';
    name?: string;
    url?: string;
    address?: string;
  };
  organizer?: {
    '@type': 'Person' | 'Organization';
    name: string;
    url?: string;
  };
  image?: string;
}

export interface JsonLdPerson {
  '@context': 'https://schema.org';
  '@type': 'Person';
  name: string;
  alternateName?: string;
  description?: string;
  image?: string;
  url?: string;
  sameAs?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class StructuredDataService {
  private readonly document = inject(DOCUMENT);
  private readonly scriptId = 'structured-data-script';

  /**
   * Add JSON-LD structured data for an article/blog post
   */
  setArticleData(data: {
    title: string;
    description?: string;
    imageUrl?: string;
    publishedAt?: string;
    updatedAt?: string;
    authorName: string;
    authorUsername: string;
    tags?: string[];
    url: string;
  }): void {
    const jsonLd: JsonLdArticle = {
      '@context': 'https://schema.org',
      '@type': 'TechArticle',
      headline: data.title,
      description: data.description,
      image: data.imageUrl,
      datePublished: data.publishedAt,
      dateModified: data.updatedAt || data.publishedAt,
      author: {
        '@type': 'Person',
        name: data.authorName,
        url: `https://techcommunity.com.tr/u/${data.authorUsername}`
      },
      publisher: {
        '@type': 'Organization',
        name: 'TechCommunity Türkiye',
        logo: {
          '@type': 'ImageObject',
          url: 'https://techcommunity.com.tr/assets/logo.png'
        }
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': data.url
      },
      keywords: data.tags
    };

    this.setJsonLdScript(jsonLd);
  }

  /**
   * Add JSON-LD structured data for a Q&A page
   */
  setQuestionData(data: {
    title: string;
    body: string;
    answerCount: number;
    createdAt?: string;
    authorName: string;
    acceptedAnswer?: {
      text: string;
      createdAt?: string;
      authorName: string;
    };
    answers?: Array<{
      text: string;
      createdAt?: string;
      authorName: string;
    }>;
  }): void {
    const jsonLd: JsonLdQuestion = {
      '@context': 'https://schema.org',
      '@type': 'QAPage',
      mainEntity: {
        '@type': 'Question',
        name: data.title,
        text: data.body,
        answerCount: data.answerCount,
        dateCreated: data.createdAt,
        author: {
          '@type': 'Person',
          name: data.authorName
        }
      }
    };

    if (data.acceptedAnswer) {
      jsonLd.mainEntity.acceptedAnswer = {
        '@type': 'Answer',
        text: data.acceptedAnswer.text,
        dateCreated: data.acceptedAnswer.createdAt,
        author: {
          '@type': 'Person',
          name: data.acceptedAnswer.authorName
        }
      };
    }

    if (data.answers && data.answers.length > 0) {
      jsonLd.mainEntity.suggestedAnswer = data.answers.map(answer => ({
        '@type': 'Answer' as const,
        text: answer.text,
        dateCreated: answer.createdAt,
        author: {
          '@type': 'Person' as const,
          name: answer.authorName
        }
      }));
    }

    this.setJsonLdScript(jsonLd);
  }

  /**
   * Add JSON-LD structured data for an event
   */
  setEventData(data: {
    name: string;
    description?: string;
    startDate: string;
    endDate?: string;
    isOnline: boolean;
    location?: string;
    eventUrl?: string;
    organizerName: string;
    imageUrl?: string;
  }): void {
    const jsonLd: JsonLdEvent = {
      '@context': 'https://schema.org',
      '@type': 'Event',
      name: data.name,
      description: data.description,
      startDate: data.startDate,
      endDate: data.endDate,
      eventStatus: 'EventScheduled',
      eventAttendanceMode: data.isOnline ? 'OnlineEventAttendanceMode' : 'OfflineEventAttendanceMode',
      location: data.isOnline
        ? {
            '@type': 'VirtualLocation',
            url: data.eventUrl
          }
        : {
            '@type': 'Place',
            name: data.location,
            address: data.location
          },
      organizer: {
        '@type': 'Person',
        name: data.organizerName
      },
      image: data.imageUrl
    };

    this.setJsonLdScript(jsonLd);
  }

  /**
   * Add JSON-LD structured data for a person/profile
   */
  setPersonData(data: {
    displayName: string;
    username: string;
    bio?: string;
    avatarUrl?: string;
    websiteUrl?: string;
    githubUrl?: string;
    twitterUrl?: string;
    linkedInUrl?: string;
  }): void {
    const sameAs: string[] = [];
    if (data.websiteUrl) sameAs.push(data.websiteUrl);
    if (data.githubUrl) sameAs.push(data.githubUrl);
    if (data.twitterUrl) sameAs.push(data.twitterUrl);
    if (data.linkedInUrl) sameAs.push(data.linkedInUrl);

    const jsonLd: JsonLdPerson = {
      '@context': 'https://schema.org',
      '@type': 'Person',
      name: data.displayName,
      alternateName: `@${data.username}`,
      description: data.bio,
      image: data.avatarUrl,
      url: `https://techcommunity.com.tr/u/${data.username}`,
      sameAs: sameAs.length > 0 ? sameAs : undefined
    };

    this.setJsonLdScript(jsonLd);
  }

  /**
   * Clear any existing structured data
   */
  clearStructuredData(): void {
    const existingScript = this.document.getElementById(this.scriptId);
    if (existingScript) {
      existingScript.remove();
    }
  }

  private setJsonLdScript(data: object): void {
    this.clearStructuredData();

    const script = this.document.createElement('script');
    script.id = this.scriptId;
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data, null, 0);

    this.document.head.appendChild(script);
  }
}
