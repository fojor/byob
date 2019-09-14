import { Injectable } from '@angular/core';

import { v4 } from 'uuid';
import { FileElement } from '../../../file-manager/model/element';
import { BehaviorSubject, combineLatest } from 'rxjs';
import { Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/firestore';
import { tap, take, filter, combineAll, map, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/auth';

export interface IFileService {
    add(fileElement: FileElement);
    delete(id: string);
    update(id: string, update: Partial<FileElement>);
    queryInFolder(folderId: string): Observable<FileElement[]>;
    get(id: string): FileElement;
}

@Injectable()
export class FileService implements IFileService {
    private map = new Map<string, FileElement>();
    private currentUserId: string;

    constructor(
        private db: AngularFirestore,
        private afAuth: AngularFireAuth, 
    ) { }

    load(): Observable<any> {
        return this.afAuth.authState
            .pipe(
                map(i => i.uid),
                tap(i => this.currentUserId = i),
                take(1),
                switchMap(() => {
                    return this.db.doc('files/' + this.currentUserId).get()                   
                        .pipe(                            
                            tap((snapshot: firebase.firestore.DocumentSnapshot) => {
                                let data = snapshot.data();
                                if(data && !this.map.keys.length) {
                                    data.files.forEach(i => this.map.set(i.id, i))
                                }
                            })
                        )
                })
            );
    }

    add(fileElement: FileElement) {
        fileElement.id = v4();
        this.map.set(fileElement.id, this.clone(fileElement));
        this.updateDatabase();
        return {
            fileId: fileElement.id,
            ownerId: this.currentUserId
        };
    }

    delete(id: string) {
        this.map.delete(id);
        this.updateDatabase();
    }

    update(id: string, update: Partial<FileElement>) {
        let element = this.map.get(id);
        element = Object.assign(element, update);
        this.map.set(element.id, element);
        this.updateDatabase();
        return {
            fileId: id,
            ownerId: this.currentUserId
        };
    }

    private querySubject: BehaviorSubject<FileElement[]>;
    queryInFolder(folderId: string) {
        const result: FileElement[] = [];
        this.map.forEach(element => {
            if (element.parent === folderId) {
                result.push(this.clone(element));
            }
        });
        if (!this.querySubject) {
            this.querySubject = new BehaviorSubject(result);
        } else {
            this.querySubject.next(result);
        }
        return this.querySubject.asObservable();
    }

    get(id: string) {
        return this.map.get(id);
    }

    clone(element: FileElement) {
        return JSON.parse(JSON.stringify(element));
    }

    updateDatabase() {
        this.db.doc('files/' + this.currentUserId).set({
            files: [ ...Array.from(this.map.values()) ]
        });
    }
}
