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
            loadElements: function (documentArray, target_id, event)
            {
                var defferArray = [];
                var tempElements = [];

                var i = 0;

                console.debug('IS ARRAY: '+ $.isArray(documentArray));
                console.debug('DOCUMENT ARRAY: ');
                console.debug(documentArray);

                $.each(documentArray, function (index, urlValue)
                {
                    defferArray.push(new $.Deferred());

                    var tempElement = $('<div />');
                    tempElements.push( tempElement );
                    
                    tempElement.load(
                        'content/'+ urlValue, 
                        function() 
                        {
                            defferArray[i].resolve();
                            i++;
                        }
                    );
                })

                $.when.apply(null, defferArray).done(
                    function ()
                    {
                        $(host).trigger(event, [tempElements, target_id]);
                    }
                );
            }
        };
    }
)
(jQuery, document);
