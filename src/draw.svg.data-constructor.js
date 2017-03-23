/*
    Simple object constructor.
    Can be used to generate json representation of drawing objects for later saving.
*/

var dataConstructor = {
    elements: {}, // object that contains our svg elements
    storeElement: function(element){ // function to add new svg element to 'elements' object.
        var item_id = element.id;

        this.elements[item_id] = this.createObjectFromPath(element);
    },

    removeElement: function(element_id){
        delete this.elements[element_id];
        console.log ('removed element with id:'+element_id);
    },

    /*
        Generates js object representing the given html svg path element
    */
    createObjectFromPath: function(element){

        return {
            'id': element.id,
            'type': element.tagName,
            'color': element.getAttribute('stroke'),
            'width': element.getAttribute('stroke-width'),
            'd': element.getAttribute('d'),
        };
            
    },
    generateJSON: function(){ //generates a JSON string of elements collection
        return JSON.stringify(this.elements);
    },
    generateObject(json_string)
    {
        return JSON.parse(json_string);
    },
    /*
        Draws the on-screen elements with drawSVG using JSON
    */
    generateElementsObjFromJson(drawSVG, json_string)
    {

        var obj = this.generateObject(json_string);

        for(var id in obj)
        {
            var curObj = obj[id];

            switch(curObj['type']){
                case 'path':

                    drawSVG.createElement(id);
                    element = document.getElementById(id);
 
                    this.constructElementFromObj().path(element, curObj);

                    this.storeElement(element);

                break;
                case 'marker':
                break;
            }
        }
    },
    constructElementFromObj: function(){
        return {
            path: function(element, obj){

                element.setAttribute('d', obj['d']);
                element.setAttribute('stroke', obj['color']);
                element.setAttribute('stroke-width', obj['width']);
            }
        }
    },
    clear: function(){ //clears element object
        this.elements = {};
    }
}

