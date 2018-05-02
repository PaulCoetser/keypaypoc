import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  templateUrl: './payroll-journals.component.html',
  animations: [appModuleAnimation()]
})

export class PayrollJournalsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
