
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

        drawSVG.setWidth('8px');
        drawSVG.setColor('#'+strokeColor); // color from jscolor element on control panel
        
        var drawable = ['rectangle', 'arrow', 'line', 'ellipse'];

        if( drawable.indexOf(selectedItem) != -1 ){
            drawSVG.createByString(selectedItem, itemId);
        }

    }
    
})
.mouseup(function(e) {
    if (e.button === 0){ // draw only if left-mouse-button is pressed
        drawStatus.isDrawing = false;

        var supported_for_save = ['path', 'ellipse'];

        var element = document.getElementById(itemId);

        if( element && supported_for_save.indexOf(element.tagName) != -1)
        {
            dataConstructor.storeElement(element);
        }
    }
});


/*
    Eraser click logic
*/
$(document).on('click','path, ellipse',function(e){

    if(selectedItem == 'eraser'){

        var deletable = ['path', 'ellipse']; // deletable object tags

        if(deletable.indexOf(e.target.tagName) != -1 && confirm('Are you sure?'))
        {
            drawSVG.deleteObject(e.target.id);
            dataConstructor.removeElement(e.target.id);
        }
    }
});

//editor dragging actions

var editStatus = {
    isEditing: false,
    fX: 0,
    fY: 0,
    lX:0,
    lY:0
}

$('#svg-editor-area').mousemove(function(e){

    var isDragging = (e.button === 1) || (selectedItem == "drag");

    if(editStatus.isEditing && isDragging)
    {
        var curPosEdit = svgEditor.getCurPos(e);
            editStatus.lX = curPosEdit.x;
            editStatus.lY = curPosEdit.y;

        svgEditor.drag(editStatus.fX, editStatus.fY, editStatus.lX, editStatus.lY);
    }

})
.mousedown(function(e){
    editStatus.isEditing = true;

    var curPosEdit = svgEditor.getCurPos(e);
        editStatus.fX = curPosEdit.x;
        editStatus.fY = curPosEdit.y;
})
.mouseup(function(e) {
    editStatus.isEditing = false;
});


/*
    Zoom logic events.
    Mouse wheel action was provided by https://github.com/jquery/jquery-mousewheel
*/
$('#svg-editor-area').on('mousewheel', function(event) {
    var scaleSize = event.deltaY * 0.1;
    svgEditor.scale( svgEditor.coordScale + scaleSize );
});

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
    svgEditor.initImage('images/test-img/testbg.jpg');
});
