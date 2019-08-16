import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'blv-video-chart',
  templateUrl: './video-chart.component.html',
  styleUrls: [ './video-chart.component.css'],
})
export class VideoChartComponent implements OnInit {

  searchForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });
  }

  searchIntrep() {
    console.log('search from video-chart', this.searchForm.value);
  }


}
