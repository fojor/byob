var editorUiInit = EditorUi.prototype.init;
EditorUi.prototype.init = function()
{
    editorUiInit.apply(this, arguments);

    var langElm = document.querySelector('a[title="Language"]');
    if(langElm) {
        langElm.style.display = 'none';
    }

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
                if(firstItem && firstItem.innerText.trim() === 'Import from')
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

Sidebar.prototype.createDropHandler = function(cells, allowSplit, allowCellsInserted, bounds)
{
    allowCellsInserted = (allowCellsInserted != null) ? allowCellsInserted : true;
    

    if(cells[0].value === 'Text' && urlParams['new'] === '1') {
        //console.log('autocreate text')
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


EditorUi.prototype.resetScrollbars = function()
{
	var graph = this.editor.graph;
	
    graph.container.scrollTop = 0;
    graph.container.scrollLeft = 0;

    if (!mxUtils.hasScrollbars(graph.container))
    {
        graph.view.setTranslate(0, 0);
    }
};