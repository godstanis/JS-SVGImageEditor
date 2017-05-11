(function(){
    var editorModule = (function(){
        var svg_area = undefined;
        var editor_area = undefined;

        function init(svgArea, editorArea)
        {
            svg_area = svgArea;
            editor_area = editorArea;
        };

        function bindEvents()
        {
            bindMouseEvents();
            bindTouchEvents();
        }

        function bindMouseEvents()
        {
            svg_area.on( "mousemove" , function(e){
                mouseMoveEvent(e);
            }).on( "mousedown" , function(e){
                mouseDownEvent(e);
            }).on( "mouseup" ,function(e) {
                mouseUpEvent(e);
            });

        };

        function bindTouchEvents()
        {
            svg_area.on( "touchmove" , function(e){
                touchMoveEvent(e);
            }).on( "touchstart" , function(e){
                touchDownEvent(e);
            }).on( "touchend" ,function(e) {
                touchUpEvent(e);
            });
        };

        var dragStatus = {
            isDragging: false,
            editorX: 0,
            editorY: 0,
            fX: 0,
            fY: 0,
            lX: 0,
            lY: 0
        };

        function mouseMoveEvent(e)
        {
            if(dragStatus.isDragging)
            {
                dragStatus.lX = e.clientX - dragStatus.fX;
                dragStatus.lY = e.clientY - dragStatus.fY;
                svgEditor.drag(dragStatus.editorX, dragStatus.editorY, dragStatus.lX, dragStatus.lY);
            }
        };

        function mouseDownEvent(e)
        {
            var actionIsDrag = (e.button === 1) || (selectedItem == "drag");

            if( actionIsDrag ){
                dragStatus.isDragging = true;
            }

            dragStatus.editorX = svgEditor.curX();
            dragStatus.editorY = svgEditor.curY();

            dragStatus.fX = e.clientX;
            dragStatus.fY = e.clientY;
        };

        function mouseUpEvent(e)
        {
            dragStatus.isDragging = false;
        };

        function touchMoveEvent(e)
        {
            var e_touch = e.originalEvent.touches[0];

            if(dragStatus.isDragging)
            {
                dragStatus.lX = e_touch.clientX - dragStatus.fX;
                dragStatus.lY = e_touch.clientY - dragStatus.fY;

                svgEditor.drag(dragStatus.editorX, dragStatus.editorY, dragStatus.lX, dragStatus.lY);
            }
        };

        function touchDownEvent(e)
        {
            var e_touch = e.originalEvent.touches[0];

            var actionIsDrag = (selectedItem == "drag");
            if( actionIsDrag ){
                dragStatus.isDragging = true;
            }
            dragStatus.editorX = svgEditor.curX();
            dragStatus.editorY = svgEditor.curY();

            dragStatus.fX = e_touch.clientX;
            dragStatus.fY = e_touch.clientY;
        };

        function touchUpEvent(e)
        {
            dragStatus.isDragging = false;
        };

        function deleteElementEvent(e)
        {
            if(selectedItem == 'eraser'){

                var deletable = ['path']; // deletable object tags

                if(deletable.indexOf(e.target.tagName) != -1 && confirm('Are you sure?'))
                {
                    drawSVG.deleteObject(e.target.id);
                    dataConstructor.removeElement(e.target.id);
                }
            }
        };

        return {
            init: init,
            bindEvents: bindEvents,
        };
    })();

    editorModule.init($('#svg-area'), $('#svg-editor-area'));
    editorModule.bindEvents();

})();
