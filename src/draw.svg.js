/*
    Simple SVG drawing library. The main concept is to create an object (path, ellipse e.t.c) and then
    change it's properties regarding to the created object ('d' for paths; cx,cy,rx,ty for ellipses e.t.c)

    Short instruction: 
    - create <svg id="test"></svg> tag.
    - use drawSVG.element="test"; drawSVG.init() to initialize.
    - now you are ready to go, more info on https://github.com/Stasgar/draw.swg.js
*/

var drawSVG = (function(){

    var element = ""; //<svg> id property
    var strokeWidth = '4px';
    var strokeColor = 'green';

    function initElementById(svg_element){
        element = document.getElementById(svg_element);
    };

    function initElementByClass(svg_element){
        element = document.getElementsByClassName(svg_element)[0];
    };

    function setColor(color){
        strokeColor = color;
    };

    function setWidth(width){
        strokeWidth = width;
    }

    function clear(){
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    };

    function deleteObject(obj_id){
        var deletable = ['path'];//deletable object tags
        var element = document.getElementById(obj_id);

        if(deletable.indexOf(element.tagName) != -1)
        {
            element.parentNode.removeChild(element);
        }
    };

    function createElement(id){
        PathHelper.itemId = id; // Change PathHelper itemId
 
        var newPath = HTMLhelper.createPath(id, strokeWidth, strokeColor);

        element.appendChild(newPath);
    };

    function drawObject(itemId, do_create){
        if(itemId === undefined){
            itemId = PathHelper.itemId;
        }
        if(do_create === undefined){
            do_create = true;
        }

        // Do not create the element if param false given
        function createManage(id)
        {
            if(do_create)
            {
                createElement(itemId);
            }
            else
            {
                itemId = PathHelper.itemId;
            }
        }

        return {
            rectangle: function(fX, fY, lX, lY){

                createManage(itemId);
                PathHelper.moveTo(fX, fY);
                PathHelper.lineTo(fX, lY);
                PathHelper.lineTo(lX, lY);
                PathHelper.lineTo(lX, fY);
                PathHelper.closePath();
            },
            ellipse: function (fX, fY, lX, lY){

                createManage(itemId);

                var step = 2*Math.PI/40;  // drawing frequency
                var cx = fX; 
                var cy = fY;
                var rx = Math.abs(fX-lX)/2;
                var ry = Math.abs(fY-lY)/2;

                //Ellipse drawing algorithm
                for(var theta=0;  theta < 2*Math.PI;  theta+=step)
                { 
                    var x = cx + rx*Math.cos(theta) - (fX-lX)/2;
                    var y = cy - ry*Math.sin(theta) - (fY-lY)/2;  
                    if(theta == 0)
                    {
                        PathHelper.moveTo(x, y);
                    }
                    else
                    {
                        PathHelper.lineTo(x, y);
                    }
                    
                }

                PathHelper.closePath();
            },
            arrow: function(fX, fY, lX, lY){

                createManage(itemId);
                // Draws the line
                PathHelper.moveTo(fX, fY);
                PathHelper.lineTo(lX, lY);
                
                // Arrow tip vector points
                var arrowTipPoints = {
                    "x":{"1":0,"2":30,"3":0},
                    "y":{"1":-10,"2":0,"3":10}
                };

                // Draws the given points array in given angle
                function drawRotated(arr, angle) 
                {
                    
                    for(var i=1; i<=3; i++){
                        var x2 = arrowTipPoints["x"][i];
                        var y2 = arrowTipPoints["y"][i];

                        var newX = x2*Math.cos(angle) - y2*Math.sin(angle);
                        var newY = x2*Math.sin(angle) + y2*Math.cos(angle);

                        PathHelper.lineTo(lX+parseFloat(newX), lY+parseFloat(newY) );
                    }

                    PathHelper.lineTo(lX, lY); // Closes the triangle
                }

                //Returns the current line angle in rads
                function getCurrentLineAngle()
                {
                    var angle_rad = Math.atan( (lY - fY) / (lX - fX) );

                    if(lX < fX)
                    {
                        var degree = -90;
                        angle_rad-=degree-1.1;
                    }

                    return angle_rad;
                }

                // Finnaly draws the arrow tip
                var distance = Math.sqrt(Math.pow(lX-fX,2)+Math.pow(lY-fY,2));

                if(distance > 0)
                    drawRotated(arrowTipPoints, getCurrentLineAngle());

            }
        }
    };

    var linerH = null; //buffer for closure
    function drawLineH(itemId, X, Y, time_between_lines_ticks){
        if(linerH === null){
            linerH = drawLineFactoryH();
        }

        return linerH(itemId, X, Y, time_between_lines_ticks);
    };
    /* 
        This method is used in drawSVG.drawLine().
        You can read more about closures on https://www.w3schools.com/js/js_function_closures.asp
    */
    function drawLineFactoryH() {
        var prevX = 0;
        var prevY = 0;

        //Decrease to draw lines more often; increase to draw lines less often.
        //Greater numbers will produce 'low poly' line effect.
        var LINE_POLY_LENGTH = 10;
        function drawLineH(itemId, X, Y, line_poly_length) {
            if(line_poly_length === undefined){
                line_poly_length = LINE_POLY_LENGTH;
            }

            var path = document.getElementById(itemId);
            if (path.getAttribute('d')) {
                var a = prevX - X;
                var b = prevY - Y;

                var distance = Math.sqrt( a*a + b*b );

                if(distance <= line_poly_length){
                    return true
                }

                PathHelper.lineTo(X, Y, itemId);

                prevX = X;
                prevY = Y;
            } else {
                PathHelper.moveTo(X, Y, itemId); // if path has not been started yet
            }
        
        }

        return drawLineH;
    };

    /*
        Next xxxByString methods provide simple interface for 
        string based switching (for example Radio buttons input)
    */
    function drawByString(string, itemId, fX, fY, lX, lY){ 
        switch(string)
            {
                case "rectangle": drawObject(itemId, false).rectangle(fX, fY, lX, lY)
                    break;
                case "arrow": drawObject(itemId, false).arrow(fX, fY, lX, lY)
                    break;
                case "line": drawLineH(itemId, lX, lY, 6)
                    break;
                case "ellipse": drawObject(itemId, false).ellipse(fX, fY, lX, lY)
            }
    };


    /*
        HTMLhelper is used to provide easy html implementation of base objects.
    */
    var HTMLhelper = {

        createPath: function(id, strokeWidth, strokeColor, fill){
            if(strokeWidth === undefined){
                strokeWidth = "4px";
            }
            if(strokeColor === undefined){
                strokeColor = "green";
            }
            if(fill === undefined){
                fill = "none";
            }
            
            var newPath = document.createElementNS('http://www.w3.org/2000/svg',"path");    
            newPath.setAttributeNS(null, "id", id);
            newPath.setAttributeNS(null, "stroke", strokeColor);
            newPath.setAttributeNS(null, "stroke-width", strokeWidth);
            newPath.setAttributeNS(null, "class", "svg-element");
            newPath.setAttributeNS(null, "fill", fill);

            return newPath;
        },
    };

    var PathHelper = {
        itemId:false,

        //Moves 'virtual brush' to the provided coordinates. If not used - 'virtual brush' will start from (0;0)
        moveTo: function(X, Y, itemId){
            if(itemId === undefined){
                itemId = this.itemId;
            }
            var path = document.getElementById(itemId);
            path.setAttribute('d', "M"+X.toString()+","+Y.toString());
            return this;
        },

        //Draws the line from 'virtual brush' position to the provided coordinates
        lineTo: function(X, Y, itemId){
            if(itemId === undefined){
                itemId = this.itemId;
            }
            var path = document.getElementById(itemId);
            path.setAttribute('d', path.getAttribute('d') + "L"+X.toString()+","+Y.toString());
            return this;
        },

        //Closes the path connectig the first point with the last
        closePath: function(itemId){
            if(itemId === undefined){
                itemId = this.itemId;
            }
            var path = document.getElementById(itemId);
            path.setAttribute('d', path.getAttribute('d') + "z");
        },

        //itemId setter
        setIemId: function(itemId)
        {
            this.itemId = itemId;
        },

    };

    return{
        initElementById: initElementById,
        initElementByClass: initElementByClass,
        createElement: createElement,
        PathHelper: PathHelper,
        setColor: setColor,
        setWidth: setWidth,
        drawObject: drawObject,
        drawLine: drawLineH,
        drawByString: drawByString,
        clear: clear,
        deleteObject: deleteObject,
    }

})();
