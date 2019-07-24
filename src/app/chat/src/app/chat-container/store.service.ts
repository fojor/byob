import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { concatMap, first, map, shareReplay, tap, combineLatest } from "rxjs/operators";
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

  private getCurrentUser(): Observable<User> {
    //const search = +location.search.match(/userId\=(\d+)/);
    //const currentUserId:number = Array.isArray(search) ? search[1] : 1;

    return this.authService.currentUserObservable
            .pipe(
                combineLatest(this.getUsers()),                
            )
            .pipe(
                map(([firebaseUser, users])=> {
                    return users.find(i => i.id === firebaseUser.uid)
                }),
                tap(user  => this.currentUser = user),
                shareReplay(1),
            )

    // return this.getUsers()
    //   .pipe(
    //     map(users => users.find(item => +item.id === currentUserId)),
    //     tap(user  => this.currentUser = user),
    //     shareReplay(1),
    //   );
    
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
