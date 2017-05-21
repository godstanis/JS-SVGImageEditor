/*
    Simple object constructor for drawSVG component.
    Can be used to generate json representation of drawing objects for later saving.
*/

var dataConstructor = (function(){
    var elements = {}; // object that contains our svg elements
    function storeElement(element){ // function to add new svg element to 'elements' object.
        var item_id = element.id;

        elements[item_id] = createObjectFromPath(element);
    };

    function removeElement(element_id){
        delete elements[element_id];
        console.log ('removed element with id:'+element_id);
    };

    /*
        Generates js object representing the given html svg path element
    */
    function createObjectFromPath(element){

        return {
            'id': element.id,
            'type': element.tagName,
            'color': element.getAttribute('stroke'),
            'width': element.getAttribute('stroke-width'),
            'd': element.getAttribute('d'),
        };
            
    };
    function generateJSON(){ //generates a JSON string of elements collection
        return JSON.stringify(elements);
    };
    function generateObject(json_string)
    {
        return JSON.parse(json_string);
    };
    /*
        Draws the on-screen elements with drawSVG using JSON
    */
    function generateElementsObjFromJson(drawSVG, json_string)
    {

        var obj = generateObject(json_string);

        for(var id in obj)
        {
            var curObj = obj[id];

            switch(curObj['type']){
                case 'path':

                    drawSVG.createElement(id);
                    element = document.getElementById(id);
 
                    constructElementFromObj().path(element, curObj);

                    storeElement(element);

                break;
                case 'marker':
                break;
            }
        }
    };
    function constructElementFromObj(){
        return {
            path: function(element, obj){

                element.setAttribute('d', obj['d']);
                element.setAttribute('stroke', obj['color']);
                element.setAttribute('stroke-width', obj['width']);
            }
        }
    };
    function clear(){ //clears element object
        elements = {};
    };

    return {
        'elements': elements,
        'storeElement': storeElement,
        'removeElement': removeElement,
        'createObjectFromPath': createObjectFromPath,
        'generateJSON': generateJSON,
        'generateObject': generateObject,
        'generateElementsObjFromJson': generateElementsObjFromJson,
        'constructElementFromObj': constructElementFromObj,
        'clear': clear
    };
})();

