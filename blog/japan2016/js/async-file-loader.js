var templates = 
(
    function ($, host)
    {
        // Begin to load external templates from a given path and inject them into the DOM
        return {
            getJSON: function (jsonPath, event)
            {
                var loader = $.getJSON(jsonPath)
                    .success(function (jsonData) 
                        {
                            //The task was finished succesfully without errors

                            //console.debug(JSON.stringify(jsonData));

                            $(host).trigger(event, [jsonData]);
                    	}
                    )
                    .error(function (jsonData)
                        {
                            //Error happened
                        }
                    )
                    .complete(function (jsonData)
                        {
                            //The task was finished but it could have ended in an error
                        }
                    );
            }
            ,
            getFileContents: function (path, event)
            {
                var loader = $.get(path)
                    .success(function (content) 
                        {
                            //The task was finished succesfully without errors

                            //console.debug(JSON.stringify(jsonData));
                            $(host).trigger(event, [content]);
                        }
                    )
                    .error(function (jsonData)
                        {
                            //Error happened
                        }
                    )
                    .complete(function (jsonData)
                        {
                            //The task was finished but it could have ended in an error
                        }
                    );
            }
            ,
            loadElements: function (element_url_array, element_id_array, target_id, event)
            {
                var deffer_array = [];
                var temp_element_array = [];

                var i = 0;

//                console.debug('IS ARRAY: '+ $.isArray(documentArray));
//                console.debug('DOCUMENT ARRAY: ');
//                console.debug(documentArray);

                $.each(element_url_array, function (index, url_value)
                {
                    deffer_array.push(new $.Deferred());

                    var temp_element = $('<div />');
                    temp_element_array.push( temp_element );
                    
                    temp_element.load(
                        'content/'+ url_value, 
                        function() 
                        {
                            deffer_array[i].resolve();

                            i++;
                        }
                    );
                })

                $.when.apply(null, deffer_array).done(
                    function ()
                    {
/*                        var client = new XMLHttpRequest();
                        client.open("GET", 'content/'+ urlArray[0], true);
                        client.onreadystatechange = function() 
                        {
                            if(this.readyState == 2) 
                            {
                                console.debug('LAST MODIFIED JSON: '+ client.getResponseHeader("Last-Modified"));

                                
                                
                            }
                        }
                        client.send();*/
                        
                        $(host).trigger(event, [temp_element_array, element_id_array, target_id]);
                    }
                );
            }
        };
    }
)
(jQuery, document);
