import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConfig } from '../_config/app-config';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { JsonAppConfigService } from 'src/_service/json-app-config-service';

@Injectable({
  providedIn: 'root'
})
export class GlobalApiService {
  private config: AppConfig | undefined;

  constructor(
    private http: HttpClient,
    private jsonAppConfigService: JsonAppConfigService
  ) {
    this.config = this.jsonAppConfigService.getConfig();
    console.log('API Base URL:', this.config?.APIBaseUrl);
  }

  private getOptions(): { headers: HttpHeaders } {
    return {
      headers: new HttpHeaders({
        Authorization: 'token eac724ea860fd67:229986a7634dd5a',
        'Content-Type': 'application/json'
      })
    };
  }


  getUrl(): string | undefined {
    return this.config?.ReportBaseUrl;
  }
//TODO: This function is  to post data inside peoplenavee
  postData(body: any): Observable<any> {
    const url = `/api/resource/Overtime%20Application`;
    let post = this.http.post(url, body, this.getOptions()).pipe(
    
      catchError(this.handleError)
    );
    //console.log(post)
    return post
  }

  view(module: string, modparam: string = ''): string {
    const site = this.config?.ReportBaseUrl + 'Reporting/';
    return `${site}${module}?${modparam}`;
  }

//TODO: this function get data from people navee
  async getPNData(doctype: string): Promise<any> {
    const url = `/api/resource/${doctype}`;
    try {
      const response = await this.http.get(url, this.getOptions()).toPromise();
      //console.log('response', response);
      return response;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  }


  private handleError(error: any): Observable<never> {
    console.error('An error occurred:', error);

    throw error;
  }
}
