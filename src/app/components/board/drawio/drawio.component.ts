import { Component, ViewChild, ElementRef, OnInit, ViewEncapsulation, OnDestroy, Input, EventEmitter, Output } from '@angular/core';

@Component({
    selector: 'drawio',
    template: '<div #wrapper></div>',
    styles: [`
        drawio, drawio > div, drawio > div > iframe {
            width: 100%;
            height: 930px;
            padding: 0 15px;
        }    
    `],
    encapsulation: ViewEncapsulation.None
})
export class DrawIOComponent implements OnDestroy {
    private _url = 'drawio/index.html?embed=1&spin=1&proto=json&configure=1&pv=0&sb=0&vrs=3';
    //'https://www.draw.io/?embed=1&spin=1&proto=json&configure=1';
    private _data: string;

    @ViewChild("wrapper")
    wrapper: ElementRef;

    @Input()
    set data(value: string) {
        if(value !== null) {
            this._data = value;
            if(!this.iframe) {
                this.createIframe();
            }
            this.setContent(this._data);
        }
    }
    get data() {
        return this._data;
    }

    @Input()
    revision: string;

    @Output()
    update: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    save: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    open: EventEmitter<any> = new EventEmitter<any>();

    @Output()
    share: EventEmitter<any> = new EventEmitter<any>();

    iframe: any;
    onMessage = (e) => this.onMessageReceive(e);


    createIframe() {
        if(this._data === '') {
            this._url += "&new=1";
        }
        this.iframe = document.createElement('iframe');
        this.iframe.setAttribute('frameborder', '0');
        this.iframe.setAttribute('src', this._url);
        this.wrapper.nativeElement.appendChild(this.iframe);
        window.addEventListener('message', this.onMessage);
    }

    ngOnDestroy() {
        window.removeEventListener('message', this.onMessage);
    }

    private onMessageReceive(e) {
        if (e.data.length > 0) {
            var msg = JSON.parse(e.data);

            switch(msg.event) {
                case 'configure':
                    this.setConfiguration();
                    break;
                case 'init':
                    this.setContent(this.data);
                    if(this.revision) {
                        this.updateContent(this.revision);
                    }
                    break;
                case 'autosave':
                    this.updateData(msg.xml);
                    break;
                case 'open':
                    this.openFile();
                    break;
                case 'share':
                    this.shareFile();
                    break;
                case 'save':
                    this.saveData(msg.xml);
                    break;
            }
        }
    }

    private setContent(xml: string) {

        if(!this.iframe) {
            return;
        }
        
        let options: any = {
            action: 'load',
            autosave: 1, 
        }

        if(xml) {
            options.xml = xml;
        }

        this.iframe.contentWindow.postMessage(JSON.stringify(options), '*');
    }

    private setConfiguration() {
        this.iframe.contentWindow.postMessage(JSON.stringify({
            action: 'configure',
            config: {
                css: '[title="Save (Cmd+S)"], [title="Save (Ctrl+S)"], [title="Exit"] { display: none }'
            }
        }), '*');
    }

    private updateContent(content: string) {
        this.iframe.contentWindow.postMessage(JSON.stringify({
            action: 'export',
            xml: content
        }), '*');
    }

    private updateData(value: string) {
        this.update.emit(value);
    }

    private openFile() {
        this.open.emit();
    }

    private shareFile() {
        this.open.emit();
    }

    private saveData(value: string) {
        this.save.emit(value);
    }
}