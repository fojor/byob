import { Injectable } from '@angular/core';
import {HttpService} from "./http.service";
import { Dropbox } from 'dropbox';

@Injectable({
  providedIn: 'root'
})
export class DropboxService {
  private readonly accessToken:string = 'UEOZqEIaWPAAAAAAAAAADNWjedL8VYjK5kVaTjfc5PEvfpS_lv4Qm9SgIpzCSByH';
  private readonly dbx:Dropbox;

  constructor(private http: HttpService) {
    this.dbx = new Dropbox({ accessToken: this.accessToken, fetch: fetch });
  }

  public getLink(path: string): Promise<DropboxTypes.files.GetTemporaryLinkResult> {
    return this.dbx.filesGetTemporaryLink({path: path});
  }

  public getMetadata(path: string): Promise<DropboxTypes.files.FileMetadataReference|DropboxTypes.files.FolderMetadataReference|DropboxTypes.files.DeletedMetadataReference> {
    return this.dbx.filesGetMetadata({path: path});
  }

  public getPreview(path: string): Promise<any> {
    return this.dbx.filesGetThumbnail({path: path});
  }

  public uploadFile(file: File): Promise<DropboxTypes.files.FileMetadata> {
    return this.dbx.filesUpload({ path: '/' + file.name, contents: file });
  }
}
