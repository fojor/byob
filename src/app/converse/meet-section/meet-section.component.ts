import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'blv-meet-section',
  templateUrl: './meet-section.component.html',
  styleUrls: [
    '../bootstrap/css/bootstrap.min.css',
    './meet-section.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class MeetSectionComponent implements OnInit {
  searchForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  searchIntrep() {
    console.log('search from meet section', this.searchForm.value);
  }

}
