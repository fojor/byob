import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import * as $ from 'jquery';
import 'slick-carousel-latest';


@Component({
  selector: 'blv-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  searchForm: FormGroup;
  subscribeForm: FormGroup;

  constructor() { }

  ngOnInit() {
    this.searchForm = new FormGroup({
      search: new FormControl('')
    });

    this.subscribeForm = new FormGroup({
      email: new FormControl('')
    });

    $('.slick-carousel').slick({
      dots: true,
      infinite: false,
      speed: 300,
      arrows: false,
      autoplay: false
    });

    console.log('app-home worked!')
  }

  searchIntrep() {
    console.log('search from home', this.searchForm);
  }

  onSubscribe() {
    console.log('subscribe email from home', this.subscribeForm);
  }

}
