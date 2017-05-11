
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
    $('#svg-area').click(function(e){

        if(selectedItem == 'marker'){
            var x = parseFloat(drawStatus.fX);
            var y = parseFloat(drawStatus.fY);
            
            markerHTML = '<div class="ds-marker" style="transform: translate('+(x)+'px,'+(y)+'px);">\
                    <div style="font-size:140%;position:absolute;left:8px;"><b>?</b></div>\
                    <div class="ds-marker-text" >Hello there!</div>\
                </div>';
            
            $('#svg-work-area').append(markerHTML);
            console.log('marker created');
        }
    });


    /*
        Zoom logic events.
        Mouse wheel action was provided by https://github.com/jquery/jquery-mousewheel
    */
    $('#svg-editor-area').on('mousewheel', function(event) {
        var scaleSize = event.deltaY * 0.1;
        svgEditor.scale( svgEditor.coordScale() + scaleSize );
    });

    /*
        Zoom buttons events.
    */
    $('.zoom-svg-in').click(function(){
        svgEditor.scale( svgEditor.coordScale() + 0.1 );    
    });

    $('.zoom-svg-out').click(function(){
        svgEditor.scale( svgEditor.coordScale() - 0.1);
    });


    //image initialization logic

    $('#initImage').click(function(){
        drawSVG.clear();
        dataConstructor.clear();
        var image = prompt('Enter image url:', 'images/test-img/testbg.jpg');
        svgEditor.initImage(image);
    });



