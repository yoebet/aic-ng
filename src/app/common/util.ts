import {reduce} from 'underscore';
import {HttpErrorResponse} from '@angular/common/http';
import {FormGroup} from '@angular/forms';

export function sum(array) {
  return reduce(array,
    (acc, cur) => acc + cur || 0, 0);
}

export function errorHandler(error: any) {
  if (error.name === 'HttpErrorResponse') {
    const httpError = error as HttpErrorResponse;
    if (httpError.status === 404) {
      alert('404 资源未找到');
      return;
    }
    if (httpError.status >= 500) {
      alert(`${httpError.status} 服务器内部错误`);
      return;
    }
  }
  console.error(error);
}

export function handle404(message: string) {
  return (error: any) => {
    if (error.name === 'HttpErrorResponse') {
      const httpError = error as HttpErrorResponse;
      if (httpError.status === 404) {
        alert(message);
        return;
      }
    }
    errorHandler(error);
  };
}

/*
export function zhComparator(a, b) {
  if (typeof a !== 'string') {
    return a - b;
  }
  return a.localeCompare(b);
}*/

export function shorterFirstZhComparator(a: string, b: string) {
  const lenDiff = a.length - b.length;
  if (lenDiff !== 0) {
    return lenDiff;
  }
  return a.localeCompare(b);
}

export function validateForm(form: FormGroup): boolean {
  form.updateValueAndValidity();
  if (!form.invalid) {
    return true;
  }
  const controls = form.controls;
  for (const controlName in controls) {
    if (!controls.hasOwnProperty(controlName)) {
      continue;
    }
    const control = controls[controlName];
    if (!control) {
      continue;
    }
    if (control.errors) {
      control.markAsTouched();
    }
  }
  return false;
}
