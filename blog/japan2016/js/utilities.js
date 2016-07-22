
function GetArrayByKey(element, list_key)
{
    if(element.hasOwnProperty(list_key))
    {
        var array = element[list_key];
        
        if($.isArray(array))
            return array
    }

    return null;                    
}

function GetComplexElementList(element)
{
    var complex_elements = [];

    $.each(
        element, 
        function(key, value) 
        {
            //if(!$.isArray(value))
            if($.isPlainObject( value ) )
            {
                complex_elements.push({'key': key, 'value': value});
            }
        }
    )
    
    return complex_elements;
}

function HasNestedElements(element)
{
    var has_nested_elements = false;

    $.each(
        element, 
        function(key, value) 
        {
            if(!$.isArray(value))
            {
                has_nested_elements = true;
                return false;
            }
        }
    )
    
    return has_nested_elements;
}

/** Function count the occurrences of substring in a string;
 * @param {String} string   Required. The string;
 * @param {String} subString    Required. The string to search for;
 * @param {Boolean} allowOverlapping    Optional. Default: false;
 * @author Vitim.us http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping)
{
    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true)
    {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}

 /**
  * Conserve aspect ratio of the orignal region. Useful when shrinking/enlarging
  * images to fit into a certain area.
  *
  * @param {Number} srcWidth Source area width
  * @param {Number} srcHeight Source area height
  * @param {Number} maxWidth Fittable area maximum available width
  * @param {Number} maxHeight Fittable area maximum available height
  * @return {Object} { width, heigth }
  */
function CalculateAspectRatioFit(srcWidth, srcHeight, maxWidth, maxHeight)
{
    var ratio = Math.min(maxWidth / srcWidth, maxHeight / srcHeight);

    return { width: srcWidth*ratio, height: srcHeight*ratio };
 }