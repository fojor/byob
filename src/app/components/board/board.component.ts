import { Component, ViewChild, ElementRef, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { tap, take, shareReplay, map, distinctUntilChanged } from 'rxjs/operators';
import { AngularFirestore } from '@angular/fire/firestore';
import { StoreService } from 'src/app/chat/src/app/chat-container/store.service';
import { Observable } from 'rxjs';

@Component({
    selector: 'blv-board',
    templateUrl: './board.component.html',
    styleUrls: ['./board.component.css'],
})
export class BoardComponent {

    docId: string;
    data$: Observable<string>;
    isDataLoaded: boolean = true;

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private db: AngularFirestore,
    ) {
        this.route.paramMap
            .pipe(
                take(1),
                tap((params: ParamMap) => {
                    const id = params.get('id');
                    if(!id) {
                        this.db
                            .collection('boards')
                            .add({
                                data: ''
                            })
                            .then((doc) => {
                                this.router.navigate(['board/' + doc.id])
                            })
                        
                    }
                    else {
                        this.docId = params.get('id');                

                        this.data$ = this.db
                            .doc('boards/' + this.docId)
                            .valueChanges()
                            .pipe(
                                take(1),
                                distinctUntilChanged(),
                                map((doc: any) => doc.data),    
                                //tap(() => console.log('loaded')),                      
                                shareReplay(1),
                            );
                    }
                })
            )
            .subscribe()      
    }

    updateData(xml: string) {
        this.db
            .doc('boards/' + this.docId)            
            .set({ data: xml }, { merge: true })
    }
}