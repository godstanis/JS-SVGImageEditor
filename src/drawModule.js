(function(){

    var drawModule = (function(){
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

        var drawStatus = {
            isDrawing: false,
            fX: 0,
            fY: 0,
            lX:0,
            lY:0
        };

        function mouseMoveEvent(e)
        {
            if(drawStatus.isDrawing){
                var curPos = svgEditor.getCurPos(e);
                drawStatus.lX = curPos.x;
                drawStatus.lY = curPos.y;

                drawSVG.drawByString(selectedItem, itemId, drawStatus.fX, drawStatus.fY, drawStatus.lX, drawStatus.lY);
            }
            
            //Show coordinates in demo:
            str = 'X:'+svgEditor.getCurPos(e).x+'  Y:'+svgEditor.getCurPos(e).y;
            $('#current-pos').html(str);
        };

        function mouseDownEvent(e)
        {
            if (e.button === 0){ // draw only if left-mouse-button is pressed

                drawStatus.isDrawing = true;

                var curPos = svgEditor.getCurPos(e);
                drawStatus.fX = curPos.x;
                drawStatus.fY = curPos.y;

                itemId = (+ new Date()).toString(); // generate random unique id for figure
                
                var drawable = ['rectangle', 'arrow', 'line', 'ellipse'];

                if( drawable.indexOf(selectedItem) != -1 ){
                    drawSVG.createElement(itemId);
                }

            }
        };

        function mouseUpEvent(e)
        {
            if (e.button === 0){ // draw only if left-mouse-button is pressed
                drawStatus.isDrawing = false;

                var supported_for_save = ['path'];

                var element = document.getElementById(itemId);

                if( element && supported_for_save.indexOf(element.tagName) != -1)
                {
                    var d_exists = ( element.getAttribute('d') != null );

                    if(d_exists){
                        dataConstructor.clear();
                        dataConstructor.storeElement(element);
                    }
                }
            }

            console.log(dataConstructor.generateJSON());
        };

        function touchMoveEvent(e)
        {
            var e_touch = e.originalEvent.touches[0];

            if(drawStatus.isDrawing){
                var curPos = svgEditor.getCurPos(e_touch);
                drawStatus.lX = curPos.x;
                drawStatus.lY = curPos.y;

                drawSVG.drawByString(selectedItem, itemId, drawStatus.fX, drawStatus.fY, drawStatus.lX, drawStatus.lY);
            }
        };

        function touchDownEvent(e)
        {
            drawStatus.isDrawing = true;

            var curPos = svgEditor.getCurPos(e.originalEvent.touches[0]);
            drawStatus.fX = curPos.x;
            drawStatus.fY = curPos.y;

            itemId = (+ new Date()).toString(); // generate random unique id for figure
            
            var drawable = ['rectangle', 'arrow', 'line', 'ellipse'];

            if( drawable.indexOf(selectedItem) != -1 ){
                drawSVG.createElement(itemId);
            }
        };

        function touchUpEvent(e)
        {
            drawStatus.isDrawing = false;

            var supported_for_save = ['path'];

            var element = document.getElementById(itemId);

            if( element && supported_for_save.indexOf(element.tagName) != -1)
            {
                var d_exists = ( element.getAttribute('d') != null );

                if(d_exists){
                    dataConstructor.storeElement(element);
                }
            }
        };

        return {
            init: init,
            bindEvents: bindEvents,
        };
    })();

    drawModule.init($('#svg-area'), $('#svg-editor-area'));
    drawModule.bindEvents();

})();