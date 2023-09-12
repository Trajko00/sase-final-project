import { Component } from '@angular/core';

import { AccountService } from '@app/_services';

@Component({ templateUrl: 'memos.component.html' })
export class MemosComponent {
  account = this.accountService.accountValue;

  constructor(private accountService: AccountService) {}
}
