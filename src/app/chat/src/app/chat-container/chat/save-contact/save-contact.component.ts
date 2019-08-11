import { Component, Output, EventEmitter, Input } from "@angular/core";

@Component({
    selector: 'save-contact',
    template: `
        <div class="nav-item dropdown" (mouseenter)="hidden = false" (mouseleave)="hidden = true">
            <span>
                ...
            </span>
            <div class="dropdown-menu" [hidden]="hidden">
                <div *ngIf="!alreadySaved" (click)="saveContact($event)">Save this contact</div>
                <div *ngIf="alreadySaved" (click)="close($event)">This contact saved already</div>
            </div>
        </div>
    `,
    styles: [`
        .dropdown {
            display: inline-block;
        }
        .dropdown-menu {
            display: block;
            margin-left: -2px;
            margin-top: -2px;   
            padding-left: 10px;
        }
    `]
})
export class SaveContactComponent {
    hidden: boolean = true;

    @Input()
    alreadySaved: boolean;

    @Output()
    save = new EventEmitter();

    saveContact(event) {
        this.save.emit();
        this.close(event);
    }

    close(event) {
        this.hidden = true;
        event.preventDefault();
        event.stopPropagation();
    }
}