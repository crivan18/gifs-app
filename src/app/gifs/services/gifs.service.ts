import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gifs, GifsResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifsList: Gifs[] = [];

  private _tagsHistory: string[] = [];
  private apiKey = 'uGGMC3CXZJjFjlBBQpvtuDQLVyNWbOmf';
  private serviceUrl: string = 'https://api.giphy.com/v1/gifs';

  constructor(private http: HttpClient) {
    this.loadLocalStorage();
    this.loadFirstItemFromHistory();
  }

  get tagsHistory(): string[] {
    return [...this._tagsHistory];
  }

  public searchTag(tag: string): void {
    if (tag.length === 0) {
      return;
    }

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.organizeHistory(tag);

    this
      .http
      .get<GifsResponse>(`${this.serviceUrl}/search`, {
        params
      })
      .subscribe(resp => {
        this.gifsList = resp.data;
      });
  }

  private organizeHistory(tag: string): void {
    tag = tag.toLowerCase();

    if (this._tagsHistory.includes(tag)) {
      this._tagsHistory = this._tagsHistory.filter(oldTag => oldTag !== tag);
    }

    this._tagsHistory.unshift(tag);

    this._tagsHistory = this._tagsHistory.splice(0, 10);

    this.saveLocalStorage();
  }

  private saveLocalStorage(): void {
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStorage(): void {
    const history = localStorage.getItem('history');

    if (history) {
      this._tagsHistory = JSON.parse(history);
    }
  }

  private loadFirstItemFromHistory(): void {
    if (this._tagsHistory.length > 0) {
      this.searchTag(this._tagsHistory[0]);
    }
  }
}
