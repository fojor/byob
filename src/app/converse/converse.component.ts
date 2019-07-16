import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'blv-converse',
  templateUrl: './converse.component.html',
  styleUrls: [
    './bootstrap/css/bootstrap.css',
    './converse.component.css'],
  encapsulation: ViewEncapsulation.ShadowDom
})
export class ConverseComponent implements OnInit {

  searchForm: FormGroup;


  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  searchIntrep() {
    console.log('search from converse section', this.searchForm.value);
  }

}
