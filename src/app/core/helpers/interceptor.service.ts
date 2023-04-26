import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor() { }

  /**
   * This function intercepts HTTP requests and adds an authorization header with a JWT token if it
   * exists in local storage.
   * @param req - HttpRequest<any> is an object that represents an HTTP request, which includes
   * information such as the request method, URL, headers, and body.
   * @param {HttpHandler} next - next is an instance of the HttpHandler class, which represents the
   * next interceptor or the backend server that will handle the request. It is responsible for
   * forwarding the request to the next interceptor or the backend server in the chain.
   * @returns If there is no JWT token in the local storage, the original request is returned. If there
   * is a JWT token, a new request is created with the Authorization header set to the JWT token and
   * this new request is returned.
   */
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
