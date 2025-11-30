import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

export interface CommentAuthor {
  id: string;
  username: string;
  displayName: string;
  avatarUrl?: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
  author: CommentAuthor;
  parentId?: string;
  replyCount: number;
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

export interface AddCommentRequest {
  content: string;
  postId?: string;
  questionId?: string;
  parentId?: string;
}

export interface UpdateCommentRequest {
  id: string;
  content: string;
}

export interface CommentsQueryParams {
  postId?: string;
  questionId?: string;
  parentId?: string;
  pageNumber?: number;
  pageSize?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/comments`;

  getComments(params: CommentsQueryParams): Observable<PaginatedResponse<Comment>> {
    let httpParams = new HttpParams();

    if (params.postId) {
      httpParams = httpParams.set('postId', params.postId);
    }
    if (params.questionId) {
      httpParams = httpParams.set('questionId', params.questionId);
    }
    if (params.parentId) {
      httpParams = httpParams.set('parentId', params.parentId);
    }
    if (params.pageNumber) {
      httpParams = httpParams.set('pageNumber', params.pageNumber.toString());
    }
    if (params.pageSize) {
      httpParams = httpParams.set('pageSize', params.pageSize.toString());
    }

    return this.http.get<ApiResponse<PaginatedResponse<Comment>>>(this.baseUrl, { params: httpParams })
      .pipe(map(response => response.data));
  }

  addComment(request: AddCommentRequest): Observable<Comment> {
    return this.http.post<ApiResponse<Comment>>(this.baseUrl, request)
      .pipe(map(response => response.data));
  }

  updateComment(id: string, content: string): Observable<Comment> {
    return this.http.put<ApiResponse<Comment>>(`${this.baseUrl}/${id}`, { id, content })
      .pipe(map(response => response.data));
  }

  deleteComment(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`)
      .pipe(map(() => undefined));
  }

  getReplies(parentId: string, pageNumber: number = 1, pageSize: number = 10): Observable<PaginatedResponse<Comment>> {
    return this.getComments({ parentId, pageNumber, pageSize });
  }
}
