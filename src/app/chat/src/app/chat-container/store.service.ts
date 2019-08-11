import { Injectable } from '@angular/core';
import { Observable, of } from "rxjs";
import { concatMap, first, map, shareReplay, tap, combineLatest, withLatestFrom } from "rxjs/operators";
import { HttpService } from "./http.service";
import { AuthService } from '../../../../auth/auth.service';
import { User } from '../../../../shared';

@Injectable({
    providedIn: 'root'
})
export class StoreService {
    public currentUser: User = {} as any;
    public users: User[] = [];
    public chats: Chat[] = [];
    public recent: User[] = [];
    public saved: User[] = [];

    public init$: Observable<any>;

    constructor(
        private http: HttpService,
        private authService: AuthService
    ) {
        this.init();
    }

    public init(): Observable<any> {
        if (this.init$) {
            return this.init$;
        }

        return this.getUsers().pipe(
            concatMap(() => this.getCurrentUser()),
            concatMap(() => this.getChats()),
            concatMap(() => this.getRecentUsers()),
            concatMap(() => this.getSavedContacts()),
            first(),
            map(() => true),
            shareReplay(1),
        );
    }

    public addChat(channel: string, participants: string[], isPrivate: boolean = false): Chat {
        const chat = {
            channel: channel,
            is_private: isPrivate,
            messages: [],
            participants: participants,
        } as Chat;

        this.chats.push(chat);

        return chat;
    }

    public addParticipant(user: User, chat: Chat): void {
        chat.participants.push(user.id);
    }

    public getCurrentUser(): Observable<User> {
        return this.authService.currentUserObservable
            .pipe(
                combineLatest(this.getUsers()),
            )
            .pipe(
                map(([firebaseUser, users]) => {
                    return users.find(i => i.id === firebaseUser.uid)
                }),
                tap(user => this.currentUser = user),
                shareReplay(1),
            )
    }

    public getRecentUsers(): Observable<User[]> {
        return this.getChats()
            .pipe(
                map(chats => {
                    let participants = [];
                    chats.filter(i => i.participants.includes(this.currentUser.id))
                        .sort(this.sortByLastUpdate)
                        .forEach(i => participants.push(...i.participants))
                    return participants;
                }),
                withLatestFrom(this.getUsers()),
                map(([participants, users]) => {
                    let tmp1 = [];
                    participants.forEach(p => {
                        if (p !== this.currentUser.id && tmp1.indexOf(p) === -1) {
                            tmp1.push(p);
                        }
                    })
                    //console.log(tmp1);
                    let tmp2 = [];
                    tmp1.forEach(i => {
                        let user = users.find(u => u.id === i);
                        if (user) {
                            tmp2.push(user);
                        }
                    });
                    return tmp2.slice(0, 10);
                }),
                tap(data => this.recent = data),
                shareReplay(1),
            )
    }

    public getSavedContacts() {
        return this.http.getContacts(this.currentUser.id)
            .pipe(
                tap(contacts => { 
                    this.saved = this.users.filter(i => contacts.some(s => s === i.id))
                }),
                shareReplay(1),
            );
    }

    public sortByLastUpdate(a, b) {
        if(a.last_update && b.last_update) {
            return new Date(a.last_update).getTime() < new Date(b.last_update).getTime() ? 1 : -1;
        }
        return 0;
    }

    private getChats(): Observable<Chat[]> {
        return this.http.getChats(this.currentUser.id)
            .pipe(
                // map(chats => {
                //   return chats.filter(item => item.participants.includes(this.currentUser.id))
                // }),
                tap(chats => this.chats = chats),
                shareReplay(1),
            );
    }

    private getUsers(): Observable<User[]> {
        return this.http.getUsers()
            .pipe(
                tap(users => this.users = users),
                shareReplay(1),
            );
    }
}
