import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage'
import { IPromise } from 'q';

@Injectable({
  providedIn: 'root'
})
export class FileService {

    constructor(
        private storage: AngularFireStorage
    ) { }

    upload(path: string, file: any): Promise<string> {
        return this.storage.upload(path, file)
                    .then(response => {
                        return this.storage.ref(response.metadata.fullPath).getDownloadURL().toPromise()
                    })
    }
}
