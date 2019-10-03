import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable, of } from 'rxjs';

import { FileElement } from '../../../../file-manager';
import { FileService } from "../../services/file.service";
import { StoreService } from '../../../../chat/src/app/chat-container/store.service';
import { tap, switchMap } from "rxjs/operators";
import { User } from "src/app/shared/models/user";

@Component({
    selector: 'share-dialog',
    templateUrl: './share-dialog.component.html',
    styleUrls: ['./share-dialog.component.css']
})
export class ShareDialogComponent {

    fileElements: Observable<FileElement[]>;
    currentRoot: FileElement;
    currentPath: string;
    canNavigateUp = false;
    selectedFiles: FileElement[] = [];
    selectedUsers: User[] = [];
    contacts: Observable<any>;

    @Input()
    data: string;

    //@Input()
    filename: string = '';

    constructor(
        public activeModal: NgbActiveModal,
        private fileService: FileService,
        private storeService: StoreService
    ) { 
        this.contacts = this.storeService.getCurrentUser()
            .pipe(
                switchMap(() => this.storeService.getSavedContacts()),
                switchMap(() => of(this.storeService.saved))
            );
    }


    ngOnInit() {
        this.fileService.load()
            .subscribe(() => this.updateFileElementQuery());
    }

    addFolder(folder: { name: string }) {
        this.fileService.add({ 
            isFolder: true, 
            name: folder.name, 
            parent: this.currentRoot ? this.currentRoot.id : 'root',
            data: null
        });
        this.updateFileElementQuery();
    }

    removeElement(element: FileElement) {
        console.log(element);

        this.fileService.delete(element.id);
        this.updateFileElementQuery();
    }

    navigateToFolder(element: FileElement) {
        this.currentRoot = element;
        this.updateFileElementQuery();
        this.currentPath = this.pushToPath(this.currentPath, element.name);
        this.canNavigateUp = true;
    }

    navigateUp() {
        if (this.currentRoot && this.currentRoot.parent === 'root') {
            this.currentRoot = null;
            this.canNavigateUp = false;
            this.updateFileElementQuery();
        } else {
            this.currentRoot = this.fileService.get(this.currentRoot.parent);
            this.updateFileElementQuery();
        }
        this.currentPath = this.popFromPath(this.currentPath);
    }

    moveElement(event: { element: FileElement; moveTo: FileElement }) {
        this.fileService.update(event.element.id, { parent: event.moveTo.id });
        this.updateFileElementQuery();
    }

    renameElement(element: FileElement) {
        console.log(element);
        this.fileService.update(element.id, { name: element.name });
        this.updateFileElementQuery();
    }

    updateFileElementQuery() {
        this.fileElements = this.fileService.queryInFolder(this.currentRoot ? this.currentRoot.id : 'root');
    }

    pushToPath(path: string, folderName: string) {
        let p = path ? path : '';
        p += `${folderName}/`;
        return p;
    }

    popFromPath(path: string) {
        let p = path ? path : '';
        let split = p.split('/');
        split.splice(split.length - 2, 1);
        p = split.join('/');
        return p;
    }

    chooseFile(element: FileElement) {
        if(this.selectedFiles.some(i => i.id === element.id)) {
            this.selectedFiles = this.selectedFiles.filter(i => i.id !== element.id);
        }
        else {
            this.selectedFiles.push(element);
        }
    }

    selectContact(user: User) {
        if(this.selectedUsers.some(i => i.id === user.id)) {
            this.selectedUsers = this.selectedUsers.filter(i => i.id !== user.id);
        }
        else {
            this.selectedUsers.push(user);
        }
    }

    isContactSelected(user: User) {
        return this.selectedUsers.some(i => i.id === user.id);
    }

    share() {
        if(this.selectedFiles.length) {
            //this.activeModal.close(result);
        }
    }
}