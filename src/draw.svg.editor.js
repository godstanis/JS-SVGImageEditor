
var svgEditor = (function(){
    console.log('Editor initialized');
    var workAreaElement= ""; // element, affected by scaling/translating
    var backgroundElement= "";
    var svgElement= "";
    var coordScale= 1.00;
    var maxScale= 2;
    var minScale= 0.3;
    var curX = 0;
    var curY = 0;

    function init(workAreaId, svgElementId, backgroundElementId){ 
        workAreaElement = document.getElementById(workAreaId);
        svgElement = document.getElementById(svgElementId);
        backgroundElement = document.getElementById(backgroundElementId);
    };

    function getCurX(){
        return curX;
    };

    function getCurY(){
        return curY;
    };

    function getScale(){
        return coordScale;
    };

    function center(){
        var windowCenterX = window.innerWidth / 2;
        var windowCenterY = window.innerHeight / 2;

        var svgRect = svgElement.getBoundingClientRect();

        var currentSvgCenterX = (svgRect.width / 2) / coordScale;
        var currentSvgCenterY = (svgRect.height / 2) / coordScale;

        curX = windowCenterX - currentSvgCenterX;
        curY = windowCenterY - currentSvgCenterY;

        //updateTransformation();
        setPosition(curX, curY);

    };
    function drag(f_editor_X, f_editor_Y, difX, difY){
        curX = f_editor_X+difX;
        curY = f_editor_Y+difY;

        setPosition(curX, curY);
    };
    function scale(in_scale){

        var scale = parseFloat(in_scale.toFixed(2));

        if (( minScale <= in_scale ) && ( in_scale <= maxScale )){
            coordScale = in_scale
            setScale(coordScale);
            return true;
        }

        return false;
    };
    function setPosition(left, top){
        workAreaElement.style.left = left+'px';
        workAreaElement.style.top = top+'px';
    };
    function setScale(in_scale)
    {
        workAreaElement.style.transform = "scale("+in_scale+")";
    };
    // initialize image and adjust editor elements sizing
    function initImage( image_path )
    {

        var bgImg = backgroundElement.getElementsByTagName('img')[0];

        function initImgSizing(){
            
            var imageWidth = bgImg.offsetWidth;
            var imageHeight = bgImg.offsetHeight;

            svgElement.style['width'] = imageWidth+'px';
            svgElement.style['height'] = imageHeight+'px';

        }

        function setImage(image_element, image_path){
            image_element.setAttribute('src', image_path);
        }

        scale(1);

        setImage(bgImg, image_path);

        bgImg.onload = function(){
            initImgSizing();
            center();
        };
        
    };
    function getOffset(element){ //Service method, providing current information about <svg> relative position
        var box = element.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    };
    function getCurPos(e, scale){ //Returns current mouse position in relative <svg> coordinates
        if(scale === undefined){
            scale = coordScale;
        }
        var svg = workAreaElement;
        var x = e.pageX - getOffset(svg).left;
        var y = e.pageY - getOffset(svg).top;
        return {
            x: Math.round(x*1/scale),
            y: Math.round(y*1/scale)
        }
    };

    return {
        init: init,
        center: center,
        drag: drag,
        scale: scale,
        initImage: initImage,
        getOffset: getOffset,
        getCurPos: getCurPos,
        curX: getCurX,
        curY: getCurY,
        coordScale: getScale,
    };

})();
