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
    private _url = 'drawio/index.html?embed=1&proto=json&configure=1&sb=0&vrs=8';
    //'https://www.draw.io/?embed=1&spin=1&proto=json&configure=1';
    private _data: string;

    @ViewChild("wrapper")
    wrapper: ElementRef;

    @Input()
    set data(value: string) {
        if (value !== null) {
            if (!this.iframe) {
                this._data = value;
                this.createIframe();
                this.setContent(value);
            }
            else if (!this.isEqual(value, this._data)) {
                this._data = value;
                this.updateContent(value);
            }
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
        if (this._data === '') {
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

    private isEqual(a, b) {
        return this.getHtmlDiagram(a) === this.getHtmlDiagram(b)
    }

    private getHtmlDiagram(xml: string) {
        let tmp = document.createElement('div');
        tmp.innerHTML = xml;
        if (tmp.children && tmp.children.length) {
            return tmp.children[0].innerHTML;
        }
        return null;
    }

    private onMessageReceive(e) {
        if (e.data.length > 0) {
            var msg = JSON.parse(e.data);

            switch (msg.event) {
                case 'configure':
                    this.setConfiguration();
                    break;
                case 'init':
                    this.setContent(this.data);
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

        if (!this.iframe) {
            return;
        }

        let options: any = {
            action: 'load',
            autosave: 1,
        }

        //if(xml) {
        options.xml = xml
            ||
            `<mxfile modified="2019-10-22T06:13:05.335Z" host="localhost" agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36" version="11.1.2" etag="AkylOAzUnc7xuP1y37lp" compressed="false">
                    <diagram id="U3r4llsrBNhhFNVDR43Q">
                        <mxGraphModel dx="20" dy="20" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
                            <root>
                                <mxCell id="0"/>
                                <mxCell id="1" parent="0"/>
                            </root>
                        </mxGraphModel>
                    </diagram>
                </mxfile>`
        //}

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
        if (!this.isEqual(value, this._data)) {
            this._data = value;
            this.update.emit(value);
            console.log('updated')
        }
    }

    private openFile() {
        this.open.emit();
    }

    private shareFile() {
        this.share.emit();
    }

    private saveData(value: string) {
        this.save.emit(value);
    }
}