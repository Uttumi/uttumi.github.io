//var tempElements = [];

var templates = 
(
    function ($, host)
    {
        // Begin to load external templates from a given path and inject them into the DOM
        return {
            loadJSON: function (json_path, event)
            {
                var loader = $.getJSON(json_path)
                    .success(function (data) 
                        {
                            //console.debug(JSON.stringify(data));
                            $(host).trigger(event, [data]);
                    	}
                    )
                    .error(function (data)
                        {

                        }
                    )
                    .complete(function ()
                        {
                            //$(host).trigger(event, [url]);
                        }
                    );

/*                $.when(loader).done(function ()
                {
                    $(host).trigger(event);
                });*/
            }
            ,
            loadDocuments: function (documentArray, target, event)
            {
                var defferArray = [];
                tempElements = [];

                var i = 0;

                $.each(documentArray, function (index, url_value)
                {
                    defferArray.push(new $.Deferred());

                    var tempElement = $('<article />');
                    tempElements.push( tempElement );
                    
                    tempElement.load(
                        'content/'+ url_value, 
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
                        $(host).trigger(event, [tempElements, target]);
                    }
                );
            }
        };
    }
)
(jQuery, document);
