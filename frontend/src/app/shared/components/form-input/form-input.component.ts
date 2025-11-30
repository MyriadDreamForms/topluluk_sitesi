import { Component, input, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FormInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="form-group" [class.has-error]="hasError()">
      @if (label()) {
        <label [for]="inputId" class="form-label">
          {{ label() }}
          @if (required()) {
            <span class="required">*</span>
          }
        </label>
      }
      
      @if (type() === 'textarea') {
        <textarea
          [id]="inputId"
          class="form-input form-textarea"
          [placeholder]="placeholder()"
          [disabled]="disabled"
          [rows]="rows()"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (blur)="onTouched()"
        ></textarea>
      } @else {
        <input
          [id]="inputId"
          [type]="type()"
          class="form-input"
          [placeholder]="placeholder()"
          [disabled]="disabled"
          [autocomplete]="autocomplete()"
          [(ngModel)]="value"
          (ngModelChange)="onValueChange($event)"
          (blur)="onTouched()"
        />
      }
      
      @if (hint() && !hasError()) {
        <small class="form-hint">{{ hint() }}</small>
      }
      
      @if (hasError() && errorMessage()) {
        <small class="form-error">{{ errorMessage() }}</small>
      }
    </div>
  `,
  styles: [`
    .form-group {
      margin-bottom: 1rem;
    }

    .form-label {
      display: block;
      margin-bottom: 0.5rem;
      font-size: 0.875rem;
      font-weight: 500;
      color: var(--text-primary, #1a202c);
    }

    .required {
      color: #e53e3e;
      margin-left: 0.125rem;
    }

    .form-input {
      width: 100%;
      padding: 0.625rem 0.875rem;
      font-size: 0.875rem;
      border: 1px solid var(--border-color, #e2e8f0);
      border-radius: 0.375rem;
      background: var(--bg-secondary, #fff);
      color: var(--text-primary, #1a202c);
      transition: border-color 0.15s, box-shadow 0.15s;
    }

    .form-input:focus {
      outline: none;
      border-color: var(--primary-color, #3182ce);
      box-shadow: 0 0 0 3px rgba(49, 130, 206, 0.1);
    }

    .form-input:disabled {
      background: var(--bg-muted, #f7fafc);
      cursor: not-allowed;
    }

    .form-textarea {
      resize: vertical;
      min-height: 100px;
    }

    .form-group.has-error .form-input {
      border-color: #e53e3e;
    }

    .form-group.has-error .form-input:focus {
      box-shadow: 0 0 0 3px rgba(229, 62, 62, 0.1);
    }

    .form-hint {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: var(--text-muted, #718096);
    }

    .form-error {
      display: block;
      margin-top: 0.25rem;
      font-size: 0.75rem;
      color: #e53e3e;
    }
  `]
})
export class FormInputComponent implements ControlValueAccessor {
  label = input<string>('');
  type = input<'text' | 'email' | 'password' | 'number' | 'textarea'>('text');
  placeholder = input<string>('');
  hint = input<string>('');
  errorMessage = input<string>('');
  hasError = input<boolean>(false);
  required = input<boolean>(false);
  autocomplete = input<string>('off');
  rows = input<number>(4);

  value: string = '';
  disabled = false;
  
  private static idCounter = 0;
  readonly inputId = `form-input-${++FormInputComponent.idCounter}`;

  private onChange: (value: string) => void = () => {};
  onTouched: () => void = () => {};

  writeValue(value: string): void {
    this.value = value ?? '';
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  onValueChange(value: string): void {
    this.value = value;
    this.onChange(value);
  }
}
