// var editorUiInit = EditorUi.prototype.init;
// EditorUi.prototype.init = function()
// {
//     editorUiInit.apply(this, arguments);

//     setTimeout(() => {
//         var div = document.createElement('div');
//         div.innerText = "TEST";
//         var ok = () => alert('ok');
//         var cnl = () => alert('cancel');
    
//         var dlg = new CustomDialog(this, div, ok, cnl, 'oki', null); 
//     }, 2000);
// }

var sidebarCreateDropHandler = Sidebar.prototype.createDropHandler;
Sidebar.prototype.createDropHandler = function(cells, allowSplit, allowCellsInserted, bounds)
{
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

    sidebarCreateDropHandler.apply(this, arguments);
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