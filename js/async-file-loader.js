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

    $.fetchTextDocuments = function(urls)
    {
        let promises = [];

        for(let url of urls)
        {
            promises.push($.fetchText('content/'+ url));
        }

        return Promise.all(promises);
    }

} (project.utility));
