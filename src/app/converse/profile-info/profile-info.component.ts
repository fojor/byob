import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'blv-profile-info',
  templateUrl: './profile-info.component.html',
  styleUrls: [ './profile-info.component.css' ],
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
