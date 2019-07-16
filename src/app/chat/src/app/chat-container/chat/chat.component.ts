import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {fromEvent, interval, Observable} from "rxjs";
import {debounceTime, distinctUntilChanged, first, map, takeUntil, tap} from "rxjs/operators";
import {SearchService} from "../search.service";
import {DomSanitizer} from "@angular/platform-browser";

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

  @Output() openChat: EventEmitter<Chat> = new EventEmitter();
  @Output() startChat: EventEmitter<User> = new EventEmitter();
  @Output() addParticipant: EventEmitter<User> = new EventEmitter();
  @Output() sendMessage: EventEmitter<string> = new EventEmitter();
  @Output() uploadFile: EventEmitter<FileList> = new EventEmitter();

  public searchText: string = '';
  public message: string = '';
  public searchResults: User[] = [];
  public isAddingParticipantMode: boolean = false;
  public currentTime$: Observable<any> = interval(500)
    .pipe(
      map(() => new Date()),
    );

  constructor(
    private search: SearchService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {}

  public getTitle(chat: Chat): string {
    if (chat && !chat.is_private && chat.participants) {
      return  `${chat.participants.length} peoples`;
    } else if (chat && chat.is_private && chat.participants) {

      const participants = chat.participants
        .filter(item => +item !== +this.currentUser.id)
      ;

      const user = this.users.find(item => +item.id === +participants[0]);

      return `${user.first_name} ${user.last_name}`;
    }

    return '';
  }

  public getParticipant(chat: Chat): User {
    if (chat && chat.participants) {
      const participants = chat.participants
        .filter(item => +item !== +this.currentUser.id)
      ;

      return this.users.find(item => +item.id === +participants[0]);
    }

    return {} as any;
  }


  public emitOpenChat(chat: Chat): void {
    this.openChat.emit(chat);
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
      this.searchResults = this.search.search(value);
    }
  }

  public searchFocus(): void {
    const blur$ = fromEvent(this.searchInput.nativeElement, 'blur')
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
      .subscribe()
    ;
  }
}
