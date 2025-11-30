import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface AnswerAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface Answer {
  id: string;
  body: string;
  bodyHtml?: string;
  questionId: string;
  isAccepted: boolean;
  commentCount: number;
  createdAt: string;
  updatedAt?: string;
  author: AnswerAuthor;
  isAuthor: boolean;
}

export interface PaginatedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  errors?: { [key: string]: string[] };
}

export interface AddAnswerRequest {
  questionId: string;
  body: string;
}

export interface UpdateAnswerRequest {
  id: string;
  body: string;
}

export interface AnswersQueryParams {
  questionId: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: 'oldest' | 'latest' | 'accepted';
}

@Injectable({
  providedIn: 'root'
})
export class AnswersService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/answers`;

  getAnswers(params: AnswersQueryParams): Observable<PaginatedResponse<Answer>> {
    let httpParams = new HttpParams()
      .set('questionId', params.questionId);

    if (params.pageNumber) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }
    if (params.sortBy) {
      httpParams = httpParams.set('sortBy', params.sortBy);
    }

    return this.http.get<ApiResponse<PaginatedResponse<Answer>>>(this.baseUrl, { params: httpParams })
      .pipe(map(response => response.data));
  }

  addAnswer(request: AddAnswerRequest): Observable<{ id: string }> {
    return this.http.post<ApiResponse<{ id: string }>>(this.baseUrl, request)
      .pipe(map(response => response.data));
  }

  updateAnswer(id: string, request: UpdateAnswerRequest): Observable<void> {
    return this.http.put<ApiResponse<void>>(`${this.baseUrl}/${id}`, request)
      .pipe(map(() => undefined));
  }

  deleteAnswer(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  acceptAnswer(answerId: string): Observable<void> {
    return this.http.post<ApiResponse<void>>(`${this.baseUrl}/${answerId}/accept`, {})
      .pipe(map(() => undefined));
  }
}
