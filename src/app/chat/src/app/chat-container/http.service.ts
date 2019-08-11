import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { first, shareReplay, tap, map } from "rxjs/operators";
import { AngularFirestore } from "@angular/fire/firestore";
import * as firebase from 'firebase';
import { User } from '../../../../shared';

@Injectable({
    providedIn: 'root'
})
export class HttpService {

    constructor(private db: AngularFirestore) { }

    public getUsers(): Observable<User[]> {
        return this.db
            .collection<User>('users')
            .valueChanges()
            .pipe(
                shareReplay(1),
            );
    }

    public getChats(userId: string): Observable<Chat[]> {
        return this.db
            .collection<Chat>('chats', ref => ref.where('participants', 'array-contains', userId))
            .valueChanges()
            .pipe(
                shareReplay(1),
            );
    }

    public getContacts(currentUserId: string): Observable<string[]> {
        return this.db
            .doc('contacts/' + currentUserId)
            .valueChanges()
            .pipe(
                map((data: any) => data.users as string[]),
                shareReplay(1),
            );
    }

    public addChat(chat: Chat): void {
        this.db
            .collection<Chat>('chats')
            .add(chat);
    }

    public addIfNotExist(chat: Chat): void {
        this.db
            .collection<Chat>('chats', ref => ref.where('channel', '==', `${chat.channel}`).limit(1))
            .get()
            .pipe(
                first(),
                tap((snapshot) => {
                    if (!snapshot.docs.length) {
                        this.db
                            .collection<Chat>('chats')
                            .add(chat);
                    }
                }),
            )
            .subscribe();

        this.db
            .collection<Chat>('chats')
            .add(chat);
    }

    public updateChat(chat: Chat): void {
        this.db
            .collection<Chat>('chats', ref => ref.where('channel', '==', `${chat.channel}`).limit(1))
            .get()
            .pipe(
                first(),
                tap((snapshot) => {
                    const document = snapshot.docs[0];
                    this.db.doc('chats/' + document.id).update(chat);
                }),
            )
            .subscribe();
    }

    public getUTCTimestamp() {
        return new Date().toUTCString();
        //firebase.firestore.FieldValue.serverTimestamp();
    }

    public addContact(currentUserId: string, contacts: string[]) {
        this.db
            .doc('contacts/' + currentUserId)            
            .set({ users: contacts }, { merge: true })
    }
}
