import { Component, OnInit } from '@angular/core';

// import 'slick-carousel-latest';

@Component({
  selector: 'blv-advertisment',
  templateUrl: './advertisment.component.html',
  styleUrls: ['./advertisment.component.css']
})
export class AdvertismentComponent implements OnInit {
  grids: boolean = false;
  list: boolean = true;

  slides = [
    {img: "assets/img/video.png"},
    {img: "assets/img/video-2.png"},
    {img: "assets/img/video-3.png"},
    {img: "assets/img/video.png"},
    {img: "assets/img/video-2.png"},
    {img: "assets/img/video-3.png"},
    {img: "assets/img/video.png"}
  ];
  
  slideConfig = {
    "slidesToShow": 4, 
    "slidesToScroll": 4,
    "arrows": true,
  };

  constructor() { }

  ngOnInit() { }
  
  showList() {
    this.grids = false;
    this.list = true;
  }
  
  showGrids() {
    this.list = false;
    this.grids = true;
  }
  

}
