function setDefaultContent(actions, setData) {
    var ui = actions.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    var container = document.querySelector('.geDiagramContainer');
    if (container) {
        container.style.opacity = 0;
    }

    setTimeout(() => {
        if (setData) {
            actions.get('resetView').funct();

            var data = `<mxfile modified="2019-10-22T06:13:05.335Z" host="localhost" agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36" version="11.1.2" etag="AkylOAzUnc7xuP1y37lp" compressed="false">
                            <diagram id="U3r4llsrBNhhFNVDR43Q">
                                <mxGraphModel dx="20" dy="20" grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" pageWidth="1100" pageHeight="850" math="0" shadow="0">
                                    <root>
                                        <mxCell id="0"/>
                                        <mxCell id="1" parent="0"/>
                                    </root>
                                </mxGraphModel>
                            </diagram>
                        </mxfile>`;
            ui.editor.graph.model.beginUpdate();
            try {
                ui.editor.setGraphXml(mxUtils.parseXml(data).documentElement);
            }
            catch (e) {
                error = e;
            }
            finally {
                ui.editor.graph.model.endUpdate();
            }
        }

        if (container) {
            container.style.opacity = 1;
        }
        //actions.get('fitPageWidth').funct();
    }, 100);
};

var editorUiInsertPage = EditorUi.prototype.insertPage;
EditorUi.prototype.insertPage = function (page, index) {
    var page = editorUiInsertPage.apply(this, arguments);
    this.actions.get('grid').funct();
    setDefaultContent(this.actions, true);
    return page;
};

var editorUiInit = EditorUi.prototype.init;
EditorUi.prototype.init = function () {
    editorUiInit.apply(this, arguments);

    var ui = this.actions.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    //Hide languages button
    var langElm = document.querySelector('a[title="Language"]');
    if (langElm) {
        langElm.style.display = 'none';
    }

    //Make LEARN menu label bold
    var menuElements = document.querySelectorAll('.geMenubar .geItem:not(.geStatus)');
    if (menuElements) {
        menuElements[menuElements.length - 1].style.fontWeight = "bold";
    }

    //Create "Open" and "Share" items in File menu
    var mutationObserver = new MutationObserver(function (mutations) {
        mutations.forEach(function (mutation) {
            if (mutation && mutation.addedNodes && mutation.addedNodes.length && mutation.addedNodes[0].className === 'mxPopupMenu geMenubarMenu') {
                var tr = document.createElement('tr');
                tr.className = 'mxPopupMenuItem file-open-item';
                var td1 = document.createElement('td');
                td1.className = 'mxPopupMenuIcon';
                tr.appendChild(td1);
                var td2 = document.createElement('td');
                td2.className = 'mxPopupMenuItem';
                td2.innerText = 'Open';
                tr.appendChild(td2);
                var td3 = document.createElement('td');
                td3.className = 'mxPopupMenuItem';
                tr.appendChild(td3);

                var firstItem = document.querySelector('.mxPopupMenu.geMenubarMenu tr.mxPopupMenuItem:nth-child(1)');
                if (firstItem && firstItem.innerText.trim() === 'Import from') {
                    var parent = firstItem.parentNode;
                    if (parent) {
                        parent.insertBefore(tr, firstItem);
                    }

                    mxEvent.addGestureListeners(tr, mxUtils.bind(this, function (evt) {
                        var op = window.opener || window.parent;
                        op.postMessage(JSON.stringify({ event: 'open' }), '*');
                        //mxEvent.consume(evt);
                    }));
                }


                var tr = document.createElement('tr');
                tr.className = 'mxPopupMenuItem file-open-item';
                var td1 = document.createElement('td');
                td1.className = 'mxPopupMenuIcon';
                tr.appendChild(td1);
                var td2 = document.createElement('td');
                td2.className = 'mxPopupMenuItem';
                td2.innerText = 'Share';
                tr.appendChild(td2);
                var td3 = document.createElement('td');
                td3.className = 'mxPopupMenuItem';
                tr.appendChild(td3);

                var firstItem = document.querySelector('.mxPopupMenu.geMenubarMenu tr.mxPopupMenuItem:nth-child(2)');
                if (firstItem && firstItem.innerText.trim() === 'Import from') {
                    var parent = firstItem.parentNode;
                    if (parent) {
                        parent.insertBefore(tr, firstItem);
                    }

                    mxEvent.addGestureListeners(tr, mxUtils.bind(this, function (evt) {
                        var op = window.opener || window.parent;
                        op.postMessage(JSON.stringify({ event: 'share' }), '*');
                        //mxEvent.consume(evt);
                    }));
                }
            }
        });
    });

    mutationObserver.observe(document.documentElement, {
        //attributes: true,
        //characterData: true,
        childList: true,
        subtree: true,
        //attributeOldValue: true,
        //characterDataOldValue: true
    });


    // var svgElement = graph.container.querySelector('svg');
    // if (svgElement) {
    //     mxEvent.addGestureListeners(svgElement, null, null, (e) => {
    //         if (graph.freehand) {
    //             graph.freehand.stopDrawing();
    //             graph.freehand.startDrawing();
    //             setTimeout(function () { graph.setSelectionCells([]); }, 15);
    //         }
    //     })
    // }

}

var createMenubar = Menus.prototype.createMenubar;
Menus.prototype.createMenubar = function (container) {
    var menubar = createMenubar.apply(this, arguments);
    menubar.addMenu("LEARN", mxUtils.bind(this, function () {
        window.open('https://youtube.com', '_blank');
    }));

    return menubar;
};

EditorUi.prototype.updateTabContainer = function () {
    if (this.tabContainer && this.pages && this.pages.length) {
        this.tabContainer.style.height = '130px';
        this.tabContainer.style.overflowX = 'scroll';
        this.tabContainer.style.overflowY = 'hidden';

        var wrapper = document.createElement('div');
        wrapper.style.position = 'relative';
        wrapper.style.display = (mxClient.IS_QUIRKS) ? 'inline' : 'inline-block';
        wrapper.style.verticalAlign = 'top';
        wrapper.style.whiteSpace = 'nowrap';
        wrapper.style.overflowX = 'srcoll';
        wrapper.style.overflow = 'hidden';
        wrapper.style.fontSize = '13px';
        wrapper.style.marginLeft = '10px';

        var tabWidth = 160;
        wrapper.style.width = (tabWidth + 8) * (this.pages.length + 1) + 'px';

        var startIndex = null;

        for (var i = 0; i < this.pages.length; i++) {
            (mxUtils.bind(this, function (index, tab) {
                tab.innerHTML = '';

                if (this.pages[index] == this.currentPage) {
                    tab.className = 'geActivePage';
                }
                else {
                    tab.className = 'geInactivePage';
                }

                try {
                    var diagramNode = this.pages[index].node;
                    var xml = Graph.decompress(mxUtils.getTextContent(diagramNode));
                    var xmlDoc = mxUtils.parseXml(xml);
                    var graph = new Graph(tab);
                    var codec = new mxCodec(xmlDoc);
                    codec.decode(xmlDoc.documentElement, graph.getModel());
                    graph.foldingEnabled = false;
                    graph.setEnabled(false);
                    graph.view.setScale(0.15);
                }
                catch {
                }

                tab.setAttribute('draggable', 'true');
                tab.removeAttribute('title');
                mxEvent.addListener(tab, 'dragstart', mxUtils.bind(this, function (evt) {
                    startIndex = index;
                }));

                mxEvent.addListener(tab, 'dragend', mxUtils.bind(this, function (evt) {
                    startIndex = null;
                    evt.stopPropagation();
                    evt.preventDefault();
                }));

                mxEvent.addListener(tab, 'dragover', mxUtils.bind(this, function (evt) {
                    if (startIndex != null) {
                        evt.dataTransfer.dropEffect = 'move';
                    }

                    evt.stopPropagation();
                    evt.preventDefault();
                }));

                mxEvent.addListener(tab, 'drop', mxUtils.bind(this, function (evt) {
                    if (startIndex != null && index != startIndex) {
                        this.movePage(startIndex, index);
                    }

                    evt.stopPropagation();
                    evt.preventDefault();
                }));

                wrapper.appendChild(tab);
            }))(i, this.createTabForPage(this.pages[i], tabWidth, this.pages[i] != this.currentPage, i + 1));
        }

        var insertTab = this.createPageInsertTab();
        insertTab.className = "insert-tab";
        insertTab.style.width = tabWidth + 'px';
        insertTab.style.lineHeight = this.tabContainer.style.height;
        wrapper.appendChild(insertTab);

        this.tabContainer.innerHTML = '';
        this.tabContainer.appendChild(wrapper);
    }

};

var editorUIcreateTabContainer = EditorUi.prototype.createTabContainer
EditorUi.prototype.createTabContainer = function () {
    setTimeout(() => {
        var tabContainer = document.querySelector('.geTabContainer');
        tabContainer.scrollTo(9999999, 0);
    }, 1000);

    var container = editorUIcreateTabContainer.apply(this, arguments);
    return container;
};

var editorUIinsertPage = EditorUi.prototype.insertPage
EditorUi.prototype.insertPage = function (page, index) {
    setTimeout(() => {
        var tabContainer = document.querySelector('.geTabContainer');
        tabContainer.scrollTo(9999999, 0);
    }, 50);

    var page = editorUIinsertPage.apply(this, arguments);
    return page;
};