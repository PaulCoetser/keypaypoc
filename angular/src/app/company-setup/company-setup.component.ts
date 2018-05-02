import { Component, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';

@Component({
  templateUrl: './company-setup.component.html',
  animations: [appModuleAnimation()]
})

export class CompanySetupComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
