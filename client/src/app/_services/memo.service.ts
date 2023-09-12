import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '@environments/environment';
import { Memo } from '@app/_models';

const baseUrl = `${environment.apiUrl}/memo`;

@Injectable({ providedIn: 'root' })
export class MemoService {
  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<Memo[]>(`${baseUrl}/all`);
  }

  getById(id: string) {
    return this.http.get<Memo>(`${baseUrl}/${id}`);
  }

  create(params: any) {
    return this.http.post(`${baseUrl}/create`, params);
  }

  update(id: string, params: any) {
    return this.http.put(`${baseUrl}/${id}`, params);
  }

  delete(id: string) {
    console.log(id);
    return this.http.delete(`${baseUrl}/delete`, {
      body: {
        memoId: id,
      },
    });
  }
}
