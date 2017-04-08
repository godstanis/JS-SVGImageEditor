var svgEditor = {
    workAreaId: "", // element, affected by scaling/translating
    backgroundElementId: "",
    svgElementId: "",
    coordScale: 1.00,
    maxScale: 2,
    minScale: 0.3,
    curX: 0,
    curY:0,
    init: function(workAreaId, svgElementId, backgroundElementId){ 
        this.workAreaId = workAreaId;
        this.svgElementId = svgElementId;
        this.backgroundElementId = backgroundElementId;
    },
    returnElement: function(){ //service function for implementing element return
        return {
            workArea:   document.getElementById(this.workAreaId),
            background: document.getElementById(this.backgroundElementId),
            svg:        document.getElementById(this.svgElementId),
        }
    },
    center: function(){
        var windowCenterX = window.innerWidth / 2;
        var windowCenterY = window.innerHeight / 2;

        var svgRect = this.returnElement().svg.getBoundingClientRect();

        var currentSvgCenterX = (svgRect.width / 2) / this.coordScale;
        var currentSvgCenterY = (svgRect.height / 2) / this.coordScale;

        this.curX = windowCenterX - currentSvgCenterX;
        this.curY = windowCenterY - currentSvgCenterY;

        this.updateTransformation();

    },
    drag: function(fX, fY, lX, lY){
        this.curX += lX - fX;
        this.curY += lY - fY;
        this.updateTransformation();
    },
    scale: function (scale){
        scale = parseFloat(scale.toFixed(2));

        if (( this.minScale <= scale ) && ( scale <= this.maxScale )){
            this.coordScale = scale
            this.updateTransformation();
            return true;
        }

        return false;
    },
    updateTransformation: function()
    {
        var translate = 'translate('+this.curX+'px,'+this.curY+'px)';
        var scale = 'scale('+this.coordScale+')';
        this.returnElement().workArea.setAttribute('style', 'transform:'+scale+' '+translate);
    },
    // initialize image and adjust editor elements sizing
    initImage: function( image_path )
    {

        var bgElement = this.returnElement().background;
        var svgElement = this.returnElement().svg;
        var bgImg = bgElement.getElementsByTagName('img')[0];

        function initImgSizing(){
            
            var imageWidth = bgImg.offsetWidth;
            var imageHeight = bgImg.offsetHeight;

            svgElement.style['width'] = imageWidth+'px';
            svgElement.style['height'] = imageHeight+'px';

            bgElement.style['top'] = '-'+(imageHeight)+'px';

        }

        function setImage(image_element, image_path){
            image_element.setAttribute('src', image_path);
        }

        this.scale(1);

        setImage(bgImg, image_path);

        bgImg.onload = function(){
            initImgSizing();
            this.center();
        }.bind(this);
        
    },
    getOffset: function(element){ //Service method, providing current information about <svg> relative position
        var box = element.getBoundingClientRect();
        return {
            top: box.top + pageYOffset,
            left: box.left + pageXOffset
        };
    },
    getCurPos: function(e, scale = this.coordScale){ //Returns current mouse position in relative <svg> coordinates
        var svg = this.returnElement().workArea;
        var x = e.pageX - this.getOffset(svg).left;
        var y = e.pageY - this.getOffset(svg).top;
        return {
            x: Math.round(x*1/scale),
            y: Math.round(y*1/scale)
        }
    },
}
