(function () {
drawSVG.coordScale;

//drawing mouse actions
var drawStatus = {
    isDrawing: false,
    fX: 0,
    fY: 0,
    lX:0,
    lY:0
}

$('#svg-area').mousemove(function(e){

    if(drawStatus.isDrawing){

        var curPos = svgEditor.getCurPos(e);
        drawStatus.lX = curPos.x;
        drawStatus.lY = curPos.y;

        drawSVG.drawByString(selectedItem, itemId, drawStatus.fX, drawStatus.fY, drawStatus.lX, drawStatus.lY);
    }
    
    //Show coordinates in demo:
    str = 'X:'+svgEditor.getCurPos(e).x+'  Y:'+svgEditor.getCurPos(e).y;
    $('#current-pos').html(str);
})
.mousedown(function(e){
    
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
    
})
.mouseup(function(e) {
    if (e.button === 0){ // draw only if left-mouse-button is pressed
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
    }
});


//editor dragging actions

var dragStatus = {
    isDragging: false,
    editorX: 0,
    editorY: 0,
    fX: 0,
    fY: 0,
    lX: 0,
    lY: 0
}

$('#svg-editor-area').mousemove(function(e){

    if(dragStatus.isDragging)
    {
        dragStatus.lX = e.clientX - dragStatus.fX;
        dragStatus.lY = e.clientY - dragStatus.fY;

        svgEditor.drag(dragStatus.editorX, dragStatus.editorY, dragStatus.lX, dragStatus.lY);
    }

})
.mousedown(function(e){
    var actionIsDrag = (e.button === 1) || (selectedItem == "drag");

    if( actionIsDrag ){
        dragStatus.isDragging = true;
    }

    dragStatus.editorX = svgEditor.curX;
    dragStatus.editorY = svgEditor.curY;

    dragStatus.fX = e.clientX;
    dragStatus.fY = e.clientY;
    
})
.mouseup(function(e) {
    dragStatus.isDragging = false;
});

/*
    Eraser click logic
*/
$(document).on('click','path',function(e){

    if(selectedItem == 'eraser'){

        var deletable = ['path']; // deletable object tags

        if(deletable.indexOf(e.target.tagName) != -1 && confirm('Are you sure?'))
        {
            drawSVG.deleteObject(e.target.id);
            dataConstructor.removeElement(e.target.id);
        }
    }
});

/*
    Marker click logic
*/
/*
// TODO
*/


/*
    Zoom logic events.
    Mouse wheel action was provided by https://github.com/jquery/jquery-mousewheel
*/
$('#svg-editor-area').on('mousewheel', function(event) {
    var scaleSize = event.deltaY * 0.1;
    svgEditor.scale( svgEditor.coordScale + scaleSize );
});

/*
    Zoom buttons events.
*/
$('.zoom-svg-in').click(function(){
    svgEditor.scale( svgEditor.coordScale + 0.1 );    
});

$('.zoom-svg-out').click(function(){
    svgEditor.scale( svgEditor.coordScale - 0.1);
});


//image initialization logic

$('#initImage').click(function(){
    drawSVG.clear();
    dataConstructor.clear();
    var image = prompt('Enter image url:', 'images/test-img/testbg.jpg');
    svgEditor.initImage(image);
});


/*
    ____________________
    Mobile touch events:
*/

/*
    Touch drawing event
*/
$('#svg-area').on( "touchmove" , function( e ) {
    
    var e_touch = e.originalEvent.touches[0];

    if(drawStatus.isDrawing){
        var curPos = svgEditor.getCurPos(e_touch);
        drawStatus.lX = curPos.x;
        drawStatus.lY = curPos.y;

        drawSVG.drawByString(selectedItem, itemId, drawStatus.fX, drawStatus.fY, drawStatus.lX, drawStatus.lY);
    }

})
.on( "touchstart" , function(e){

    drawStatus.isDrawing = true;

    var curPos = svgEditor.getCurPos(e.originalEvent.touches[0]);
    drawStatus.fX = curPos.x;
    drawStatus.fY = curPos.y;

    itemId = (+ new Date()).toString(); // generate random unique id for figure
    
    var drawable = ['rectangle', 'arrow', 'line', 'ellipse'];

    if( drawable.indexOf(selectedItem) != -1 ){
        drawSVG.createElement(itemId);
    }

})
.on( "touchend" ,function(e) {

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
    
});

/*
    Touch dragging event
*/
$('#svg-editor-area').on( "touchmove" ,function(e){

    var e_touch = e.originalEvent.touches[0];

    if(dragStatus.isDragging)
    {
        dragStatus.lX = e_touch.clientX - dragStatus.fX;
        dragStatus.lY = e_touch.clientY - dragStatus.fY;

        svgEditor.drag(dragStatus.editorX, dragStatus.editorY, dragStatus.lX, dragStatus.lY);
    }

})
.on( "touchstart" , function(e){

    var e_touch = e.originalEvent.touches[0];

    var actionIsDrag = (selectedItem == "drag");
    if( actionIsDrag ){
        dragStatus.isDragging = true;
    }
    dragStatus.editorX = svgEditor.curX;
    dragStatus.editorY = svgEditor.curY;

    dragStatus.fX = e_touch.clientX;
    dragStatus.fY = e_touch.clientY;
})
.on( "touchend" ,function(e) {
    dragStatus.isDragging = false;
});


}());
