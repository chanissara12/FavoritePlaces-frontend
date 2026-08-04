export function getAccessToken(): string {
    return localStorage.getItem('accessToken') || ''
}

export function getRefreshToken(): string {
    return localStorage.getItem('refreshToken') || ''
}

export function setAccessToken(accessToken: string): void {
    return localStorage.setItem('accessToken', accessToken)
}

export function setRefreshToken(refreshToken: string): void {
    return localStorage.setItem('refreshToken', refreshToken)
}

export function clearAccessToken(): void {
    return localStorage.setItem('accessToken', '')
}

export function clearRefreshToken(): void {
    return localStorage.setItem('refreshToken', '')
}



// public getAccessToken() {
//     // let accessToken = '';
//     // localStorage.getItem('accessToken')
//     // this.httpClient.get<{ accessToken: string }>(this.url + 'GetAccessToken').subscribe((resdata) => accessToken = resdata.accessToken)
//     return localStorage.getItem('accessToken')
//   }

//   public getRefreshToken() {
//     let refreshToken = '';
//     this.httpClient.get<{ refreshToken: string }>(this.url + 'GetRefreshToken').subscribe((resdata) => refreshToken = resdata.refreshToken)
//     return refreshToken
//   }

//   public setAccessToken(accessToken: string) {

//   }

//   public setRefreshToken(refreshToken: string) {

//   }

//   public refreshToken() {
//     return this.httpClient.get(this.url + 'GetRefreshToken')
//   }

//   public clearAccessToken() {
    
//   }

//   public clearRefreshToken() {

//   }