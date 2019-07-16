import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'blv-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: [
    '../bootstrap/css/bootstrap.min.css',
    './profile-info.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ProfileInfoComponent implements OnInit {
  searchForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  searchIntrep() {
    console.log('search from profile info', this.searchForm.value);
  }

}
