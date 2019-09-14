import { Component, Input } from "@angular/core";
import { NgbActiveModal } from "@ng-bootstrap/ng-bootstrap";
import { Observable } from 'rxjs';

import { FileElement } from '../../../../file-manager';
import { FileService } from "../../services/file.service";
import { take, tap } from "rxjs/operators";

@Component({
    selector: 'save-dialog',
    templateUrl: './save-dialog.component.html',
    styleUrls: ['./save-dialog.component.css']
})
export class SaveDialogComponent {

    fileElements: Observable<FileElement[]>;
    currentRoot: FileElement;
    currentPath: string;
    canNavigateUp = false;

    @Input()
    data: string;

    //@Input()
    filename: string = '';

    constructor(
        public activeModal: NgbActiveModal,
        private fileService: FileService,
    ) { }


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
        this.filename = element.name;
    }

    save() {
        this.fileElements
            .pipe(
                take(1),
                tap((files) => {
                    let selectedFile: FileElement = null;
                    let result: any = null;
                    if(files) {
                        selectedFile = files.find(i => i.name === this.filename);
                    }
                    if(selectedFile) {
                        result = this.fileService.update(selectedFile.id, { 
                            data: this.data
                        });
                    }
                    else {
                        result = this.fileService.add({ 
                            isFolder: false, 
                            name: this.filename, 
                            parent: this.currentRoot ? this.currentRoot.id : 'root',
                            data: this.data
                        });
                    }
                    this.activeModal.close(result);
                })
            ).subscribe();


        
    }
}