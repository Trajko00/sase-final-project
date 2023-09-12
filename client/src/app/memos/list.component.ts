import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';

import { MemoService } from '@app/_services';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  memos?: any[];

  constructor(private memoService: MemoService) {}

  ngOnInit() {
    this.memoService
      .getAll()
      .pipe(first())
      .subscribe((memos) => (this.memos = memos));
  }

  deleteMemo(id: string) {
    const memo = this.memos!.find((x) => x._id === id);
    memo.isDeleting = true;
    this.memoService
      .delete(id)
      .pipe(first())
      .subscribe(() => (this.memos = this.memos!.filter((x) => x._id !== id)));
  }
}
