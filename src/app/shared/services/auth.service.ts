import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { setAccessToken, setRefreshToken } from '../utils/token-handler';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);

  url = environment.urlApi + 'token/';

  public refreshToken(refreshTokenParam: { refreshToken: string }) {
    let userId = localStorage.getItem('currentUser') ? JSON.parse(localStorage.getItem('currentUser') || '{}').userId : null;
    return this.httpClient.post<{ accessToken: string; refreshToken: string }>
      (this.url + 'RefreshToken', { UserId: userId, RefreshToken: refreshTokenParam.refreshToken })
  }
}
