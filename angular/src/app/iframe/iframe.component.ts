import { Component, Input, OnInit } from '@angular/core';
import { appModuleAnimation } from '@shared/animations/routerTransition';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  moduleId: module.id,
  templateUrl: './iframe.component.html',
  animations: [appModuleAnimation()]
})


export class IframeComponent implements OnInit {

  @Input()
  id: string;
  url: SafeResourceUrl;

  constructor (public sanitizer: DomSanitizer) {
  }

  ngOnInit() {
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.id);
  }

}
