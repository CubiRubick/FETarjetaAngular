import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  intercept( req: HttpRequest<any>, next: HttpHandler ) {

    const JWToken = localStorage.getItem('token');

    if (!JWToken) {
      return next.handle(req);
    }

    const httpRequest = req.clone({
      headers: new HttpHeaders({
        Authorization: `Bearer ${ JWToken }`
      })
    });

    return next.handle(httpRequest);
  }

}
