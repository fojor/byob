function setDefaultContent (actions, setData) {
    var ui = actions.editorUi;
    var editor = ui.editor;
    var graph = editor.graph;

    setTimeout(() => {
        if(setData) {
            var data = `<mxfile modified="2019-10-22T06:13:05.335Z" host="localhost" agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36" version="11.1.2" etag="AkylOAzUnc7xuP1y37lp" compressed="false">
                            <diagram id="U3r4llsrBNhhFNVDR43Q">
                                <mxGraphModel grid="0" gridSize="10" guides="1" tooltips="1" connect="1" arrows="1" fold="1" page="1" pageScale="1" math="0" shadow="0">
                                    <root>
                                        <mxCell id="0"/>
                                        <mxCell id="1" parent="0"/>
                                    </root>
                                </mxGraphModel>
                            </diagram>
                        </mxfile>`;
            ui.editor.graph.model.beginUpdate();
            try
            {
                ui.editor.setGraphXml(mxUtils.parseXml(data).documentElement);
            }
            catch (e)
            {
                error = e;
            }
            finally
            {
                ui.editor.graph.model.endUpdate();				
            }
        }
        
        
        if (!graph.pageVisible)
        {
            actions.get('pageView').funct();
        }
    
        actions.get('resetView').funct();
    }, 100); 
};

var editorUiInsertPage = EditorUi.prototype.insertPage;
EditorUi.prototype.insertPage = function(page, index)
{
    var page = editorUiInsertPage.apply(this, arguments); 
    this.actions.get('grid').funct();
    setDefaultContent(this.actions, true);	
	return page;
};

var editorUiInit = EditorUi.prototype.init;
EditorUi.prototype.init = function()
{
    editorUiInit.apply(this, arguments);

    //Hide languages button
    var langElm = document.querySelector('a[title="Language"]');
    if(langElm) {
        langElm.style.display = 'none';
    }

    //Make LEARN menu label bold
    var menuElements = document.querySelectorAll('.geMenubar .geItem:not(.geStatus)');
    if(menuElements) {
        menuElements[menuElements.length - 1].style.fontWeight = "bold";
    }

    //Create "Open" and "Share" items in File menu
    var mutationObserver = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if(mutation && mutation.addedNodes && mutation.addedNodes.length && mutation.addedNodes[0].className === 'mxPopupMenu geMenubarMenu') {
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
                if(firstItem && firstItem.innerText.trim() === 'Import from') {
                    var parent = firstItem.parentNode;
                    if(parent) {
                        parent.insertBefore(tr, firstItem);
                    }
    
                    mxEvent.addGestureListeners(tr, mxUtils.bind(this, function(evt)
                    {
                        var op = window.opener || window.parent;
                        op.postMessage(JSON.stringify({event: 'open'}), '*');
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
                if(firstItem && firstItem.innerText.trim() === 'Import from') {
                    var parent = firstItem.parentNode;
                    if(parent) {
                        parent.insertBefore(tr, firstItem);
                    }
    
                    mxEvent.addGestureListeners(tr, mxUtils.bind(this, function(evt)
                    {
                        var op = window.opener || window.parent;
                        op.postMessage(JSON.stringify({event: 'share'}), '*');
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
}

var createMenubar = Menus.prototype.createMenubar;
Menus.prototype.createMenubar = function(container)
{
    var menubar = createMenubar.apply(this, arguments);	
    menubar.addMenu("LEARN", mxUtils.bind(this, function()
    {
        window.open('https://youtube.com', '_blank');
    }));

	return menubar;
};


Sidebar.prototype.createDropHandler = function(cells, allowSplit, allowCellsInserted, bounds)
{
    allowCellsInserted = (allowCellsInserted != null) ? allowCellsInserted : true;
    

    if(cells[0].value === 'Text' && urlParams['new'] === '1') {
        setDefaultContent(this.editorUi.actions);
        var graph = this.editorUi.editor.graph;
        setTimeout(() => {
            //var cell = graph.addText(30, 20, null);
            select = graph.importCells(cells, 20, 30, null);
            if (select != null && select.length > 0)
            {
                //graph.scrollCellToVisible(select[0]);
                graph.setSelectionCells(select);
                graph.startEditing(select[0]);
            }
        }, 1000);
    }
        
	
	return mxUtils.bind(this, function(graph, evt, target, x, y, force)
	{
		var elt = (force) ? null : ((mxEvent.isTouchEvent(evt) || mxEvent.isPenEvent(evt)) ?
			document.elementFromPoint(mxEvent.getClientX(evt), mxEvent.getClientY(evt)) :
			mxEvent.getSource(evt));
		
		while (elt != null && elt != this.container)
		{
			elt = elt.parentNode;
		}
		
		if (elt == null && graph.isEnabled())
		{
			cells = graph.getImportableCells(cells);
			
			if (cells.length > 0)
			{
				graph.stopEditing();
				
				// Holding alt while mouse is released ignores drop target
				var validDropTarget = (target != null && !mxEvent.isAltDown(evt)) ?
					graph.isValidDropTarget(target, cells, evt) : false;
				var select = null;

				if (target != null && !validDropTarget)
				{
					target = null;
				}
				
				if (!graph.isCellLocked(target || graph.getDefaultParent()))
				{
					graph.model.beginUpdate();
					try
					{
						x = Math.round(x);
						y = Math.round(y);
						
						// Splits the target edge or inserts into target group
						if (allowSplit && graph.isSplitTarget(target, cells, evt))
						{
							var clones = graph.cloneCells(cells);
							graph.splitEdge(target, clones, null,
								x - bounds.width / 2, y - bounds.height / 2);
							select = clones;
						}
						else if (cells.length > 0)
						{
							select = graph.importCells(cells, x, y, target);
						}
						
						// Executes parent layout hooks for position/order
						if (graph.layoutManager != null)
						{
							var layout = graph.layoutManager.getLayout(target);
							
							if (layout != null)
							{
								var s = graph.view.scale;
								var tr = graph.view.translate;
								var tx = (x + tr.x) * s;
								var ty = (y + tr.y) * s;
								
								for (var i = 0; i < select.length; i++)
								{
									layout.moveCell(select[i], tx, ty);
								}
							}
						}
	
						if (allowCellsInserted && (evt == null || !mxEvent.isShiftDown(evt)))
						{
							graph.fireEvent(new mxEventObject('cellsInserted', 'cells', select));
						}
					}
					catch (e)
					{
						this.editorUi.handleError(e);
					}
					finally
					{
						graph.model.endUpdate();
					}
	
					if (select != null && select.length > 0)
					{
						graph.scrollCellToVisible(select[0]);
						graph.setSelectionCells(select);
					}

					if (graph.editAfterInsert && evt != null && mxEvent.isMouseEvent(evt) &&
						select != null && select.length == 1)
					{
						window.setTimeout(function()
						{
							graph.startEditing(select[0]);
						}, 0);
					}
				}
			}
			
			mxEvent.consume(evt);
		}
	});
};

EditorUi.prototype.updateTabContainer = function()
{
	if (this.tabContainer && this.pages && this.pages.length)
	{
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

		for (var i = 0; i < this.pages.length; i++)
		{
			(mxUtils.bind(this, function(index, tab) {
                tab.innerHTML = '';

                if (this.pages[index] == this.currentPage)
				{
					tab.className = 'geActivePage';
				}
				else
				{
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
				mxEvent.addListener(tab, 'dragstart', mxUtils.bind(this, function(evt)
				{
                    startIndex = index;
				}));
				
				mxEvent.addListener(tab, 'dragend', mxUtils.bind(this, function(evt)
				{
					startIndex = null;
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(tab, 'dragover', mxUtils.bind(this, function(evt)
				{
					if (startIndex != null)
					{
						evt.dataTransfer.dropEffect = 'move';
					}
					
					evt.stopPropagation();
					evt.preventDefault();
				}));
				
				mxEvent.addListener(tab, 'drop', mxUtils.bind(this, function(evt)
				{
					if (startIndex != null && index != startIndex)
					{
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
EditorUi.prototype.createTabContainer = function()
{
	setTimeout(() => {
        var tabContainer = document.querySelector('.geTabContainer');
        tabContainer.scrollTo(9999999, 0);
    }, 1000);

	var container = editorUIcreateTabContainer.apply(this, arguments);
	return container;
};

var editorUIinsertPage = EditorUi.prototype.insertPage    
EditorUi.prototype.insertPage = function(page, index)
{
    setTimeout(() => {
        var tabContainer = document.querySelector('.geTabContainer');
        tabContainer.scrollTo(9999999, 0);
    }, 50);
    
    var page = editorUIinsertPage.apply(this, arguments);
	return page;
};