import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  templateUrl: './chart-of-accounts.component.html',
  animations: [appModuleAnimation()]
})

export class ChartOfAccountsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
