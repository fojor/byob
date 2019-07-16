import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {DropboxService} from "../../dropbox.service";
import {DomSanitizer, SafeUrl} from "@angular/platform-browser";

@Component({
  selector: 'message-file',
  templateUrl: './file.component.html',
  styleUrls: ['./file.component.scss']
})
export class FileComponent implements OnInit, OnChanges {
  @Input() file: string = '';

  public preview: SafeUrl | undefined;
  public link: string;
  public metadata: DropboxTypes.files.FileMetadataReference = {} as any;

  private readonly imagePattern: RegExp = /(png)|(jpg)|(jpeg)/;

  constructor(
    private dropbox: DropboxService,
    private sanitizer: DomSanitizer,
  ) {
  }

  ngOnInit(): void {  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.file) {
      this.link = undefined;

      this.getMetadata();

      if (this.isImage()) {
        this.getPreview();
      }

      this.getLink();
    }
  };

  public isImage(): boolean {
    return this.imagePattern.test(this.file);
  }

  public getPreview(): Promise<string | SafeUrl> {
    if (this.preview) {
      return Promise.resolve(this.preview);
    }

    this.preview = ' ';
    this.dropbox.getPreview(this.file).then(response => {
      const objectURL = URL.createObjectURL(response.fileBlob);

      this.preview = this.sanitizer.bypassSecurityTrustUrl(objectURL);

      return this.preview;
    });
  }

  public getLink(): void {
    this.dropbox.getLink(this.file).then((response) => {
      this.link = response.link
    })
  }

  public getMetadata(): void {
    this.dropbox.getMetadata(this.file).then((response) => {
      this.metadata = response as DropboxTypes.files.FileMetadataReference;
    })
  }
}
