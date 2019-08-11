import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {fromEvent, interval, Observable, of} from "rxjs";
import {debounceTime, distinctUntilChanged, first, map, takeUntil, tap} from "rxjs/operators";
import {SearchService} from "../search.service";
import {DomSanitizer} from "@angular/platform-browser";
import {User} from '../../../../../shared';
import { PubnubService } from '../pubnub.service';
import { StoreService } from '../store.service';

@Component({
  selector: 'chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {
  @ViewChild('searchInput') searchInput:ElementRef;

  @Input() currentUser: User = {} as any;
  @Input() currentChat: Chat = {} as any;
  @Input() chats: Chat[] = [];
  @Input() users: User[] = [];
  @Input() recent: User[] = [];
  @Input() saved: User[] = [];

  @Output() openChat: EventEmitter<User> = new EventEmitter();
  @Output() startChat: EventEmitter<User> = new EventEmitter();
  @Output() addParticipant: EventEmitter<User> = new EventEmitter();
  @Output() sendMessage: EventEmitter<string> = new EventEmitter();
  @Output() uploadFile: EventEmitter<FileList> = new EventEmitter();
  @Output() addContact: EventEmitter<string> = new EventEmitter();


  public searchText: string = '';
  public message: string = '';
  public searchResults: User[] = [];
  public isAddingParticipantMode: boolean = false;
  public activeTabIndex: number = 0;
  public currentTime$: Observable<any> = interval(500)
    .pipe(
      map(() => new Date()),
    );

  constructor(
    private search: SearchService,
    private sanitizer: DomSanitizer,
    private pubnub: PubnubService,
    private store: StoreService
  ) {}

    ngOnInit(): void {

    }

    public getTitle(chat: Chat): string {
        //console.log(chat);

        if (chat && !chat.is_private && chat.participants) {
            return  `${chat.participants.length} peoples`;
        } else if (chat && chat.is_private && chat.participants) {

            const participants = chat.participants
                .filter(item => +item !== +this.currentUser.id);

            const user = this.users.find(item => +item.id === +participants[0]);
            if(user) {
                return `${user.first_name} ${user.last_name}`;
            }
        }

        return '';
    }

    public getSenderPhoto(senderId: string) {
        const user = this.users.find(item => item.id === senderId);
        if(user) {
            return user.photoURL;
        }
        return '';
    }

    public getParticipant(chat: Chat): User {
        if (chat && chat.participants) {
            const participants = chat.participants
                .filter(item => item !== this.currentUser.id);

            return this.users.find(item => item.id === participants[0]);
        }

        return null;
    }

    public isOnline(userId: string) {
        return this.pubnub.getOnlineUsers().indexOf(userId) > -1;
    }

    public emitOpenChat(user: User): void {
        this.openChat.emit(user);
    }

    public emitStartChat(user: User): void {
        if (!this.isAddingParticipantMode) {
            this.startChat.emit(user);
        } else {
            this.addParticipant.emit(user);
        }

        this.isAddingParticipantMode = false;
        this.searchText = '';
    }

    public emitSendMessage(): void {
        if (this.currentChat.channel) {
            this.sendMessage.emit(this.message);
            this.message = '';
        }
    }

    public enableAddParticipantMode(): void {
        this.isAddingParticipantMode = true;
        this.searchText = '';
        this.searchInput.nativeElement.focus();
    }

    public emitSearch(value: string): void {
        if (value) {
            let source: User[];
            switch (this.activeTabIndex) {
                case 0:
                    source = this.users;
                    break;
                case 1:
                    source = this.recent;
                    break;
                case 2:
                    source = this.saved;
                    break;
                default:
                    source = [];
                    break;
            }
            this.searchResults = this.search.search(source, value);
        }
    }

    public searchFocus(): void {
        const blur$ = 
            fromEvent(this.searchInput.nativeElement, 'blur')
                .pipe(
                    first(),
                );  

        fromEvent(this.searchInput.nativeElement, 'input')
            .pipe(
                takeUntil(blur$),
                debounceTime(300),
                distinctUntilChanged(),
                tap(() => {
                    this.emitSearch(this.searchText);
                }),
            )
            .subscribe();
    }

    public saveContact(id: string) {
        this.addContact.emit(id);
    }

    public isAlreadySaved(id: string) {
        return this.saved.some(i => i.id === id);
    }
}
