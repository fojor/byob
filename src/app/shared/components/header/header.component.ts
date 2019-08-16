import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';


@Component({
    selector: 'blv-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
    searchForm: FormGroup;

    ngOnInit() {
        this.searchForm = new FormGroup({
            search: new FormControl('')
        });
    }
    
    searchIntrep() {
        console.log('search from user page', this.searchForm.value);
    }
}