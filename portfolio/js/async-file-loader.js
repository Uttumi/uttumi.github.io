"use strict";

(function($)
{
    $.fetchJson = function (url)
    {
        return fetch(url)
            // Handle HTML response and return JSON
            .then($.handleJSONResponse)
            .catch(error => console.log(error));
    };

    $.fetchText = function (url)
    {
        return fetch(url)
            // Returns HTML response
            .then($.handleTextResponse)
            .catch(error => console.log(error));
    };

    $.fetchContents = function (url)
    {
        return fetch(url)
            // Returns HTML response
            .then($.handleGenericResponse)
            // Returns JSON data
            //.then(text => { callback(text); })
            .catch(error => console.log(error));
    };

    $.handleGenericResponse = function(response)
    {
        let contentType = response.headers.get('content-type');

        if (contentType.includes('application/json'))
        {
            return $.handleJSONResponse(response);
        } 
        else if (contentType.includes('text/html'))
        {
            return $.handleTextResponse(response);
        } 
        else 
        {
            // Other response types as necessary
            throw new Error('Content-type '+ contentType +' not supported');
        }
    };

    $.handleJSONResponse = function(response)
    {
        return response.json().then(json => $.handleContentResponse(response, json));
    };

    $.handleTextResponse = function(response)
    {
        return response.text().then(text => $.handleContentResponse(response, text));
    };

    $.handleContentResponse = function(response, content)
    {
        if (response.ok)
        {
            return content;
        } 
        else
        {
            return Promise.reject(
                {
                    status: response.status,
                    statusText: response.statusText,
                    content: content,
                });
        }
    };

    $.fetchTextDocuments = function(urls) //(documentArray, target, event)
    {
        // let defferArray = [];
        // let tempElements = [];
        let promises = [];

        for(let url of urls)
        {
            promises.push($.fetchText('content/'+ url));

            // defferArray.push(new $.Deferred());

            // let tempElement = $('<article />');
            // tempElements.push( tempElement );
            
            // tempElement.load(
            //     'content/'+ url, 
            //     function() 
            //     {
            //         defferArray[i].resolve();
            //     }
            // );
        }

        // documentArray.forEach( 
        //     function(index, url)
        //     {
        //         promises.push($.fetchText(url));

        //     defferArray.push(new $.Deferred());

        //     var tempElement = $('<article />');
        //     tempElements.push( tempElement );
            
        //     tempElement.load(
        //         'content/'+ url, 
        //         function() 
        //         {
        //             defferArray[i].resolve();
        //         }
        //     );
        // })

        return Promise.all(promises);

        // Promise.all(promises).then(function(results) 
        // {
        //     let articles = [];

        //     for(let result of results)
        //     {
        //         // let tempElement = $('<article />');
        //         let article = document.createElement('ARTICLE');
        //         article.innerHTML = result;
        //         articles.push(article);
        //     }

        //     window.dispatchEvent(event);
        //     document.trigger(event, [tempElements, target]);
        // });

        // return Promise.all(promises);

        // $.when.apply(null, defferArray).done(
        //     function ()
        //     {
        //         $(host).trigger(event, [tempElements, target]);
        //     }
        // );
    }

    // var templates = 
    // (
    //     function ($, host)
    //     {
    //         // Begin to load external templates from a given path and inject them into the DOM
    //         return {
    //             loadJSON: function (json_path, event)
    //             {
    //                 var loader = $.getJSON(json_path)
    //                     .success(function (data) 
    //                         {
    //                             //console.debug(JSON.stringify(data));
    //                             $(host).trigger(event, [data]);
    //                     	}
    //                     )
    //                     .error(function (data)
    //                         {

    //                         }
    //                     )
    //                     .complete(function ()
    //                         {
    //                             //$(host).trigger(event, [url]);
    //                         }
    //                     );

    // /*                $.when(loader).done(function ()
    //                 {
    //                     $(host).trigger(event);
    //                 });*/
    //             }
    //             ,
    //             loadDocuments: function (documentArray, target, event)
    //             {
    //                 var defferArray = [];
    //                 tempElements = [];

    //                 var i = 0;

    //                 $.each(documentArray, function (index, url_value)
    //                 {
    //                     defferArray.push(new $.Deferred());

    //                     var tempElement = $('<article />');
    //                     tempElements.push( tempElement );
                        
    //                     tempElement.load(
    //                         'content/'+ url_value, 
    //                         function() 
    //                         {
    //                             defferArray[i].resolve();
    //                             i++;
    //                         }
    //                     );
    //                 })

    //                 $.when.apply(null, defferArray).done(
    //                     function ()
    //                     {
    //                         $(host).trigger(event, [tempElements, target]);
    //                     }
    //                 );
    //             }
    //         };
    //     }
    // )
    // (jQuery, document);

} (project.utility));