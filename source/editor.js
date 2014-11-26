/*!
 *  editor.js
 */

var ME = ME || {};

(function() {
    'use strict';

    var module = ME;
    var elements = {};

    function appendStyles() {
        var style = document.createElement('style');

        style.innerHTML = '' +
            '.me-markdown {' +
                'border-style: solid;' +
                'border-width: 1px;' +
                'display: none;' +
                'margin: 0 0 4px;' +
                'min-height: 400px;' +
                'padding: 5px' +
            '}' +

            '.me-markdown--activate .me-markdown {' +
                'display: block;' +
            '}' +

            '.me-markdown--activate .ms-formfieldvaluecontainer {' +
                'display: none;' +
            '}' +
            
            '.me-markdown--activate .ms-formfieldlabel:after {' +
                'content: " (Markdown)";' +
            '}' +

            '.me-markdown-textarea {' +
                '-moz-box-sizing: border-box;' +
                'box-sizing: border-box;' +
                'border: 0;' +
                'font-family: Consolas, monospace;' +
                'min-height: 410px;' +
                'width: 100%;' +
            '}' +

            '.me-tab-container {' +
                'list-style: none;' +
                'margin: 0;' +
                'padding: 0;' +
            '}' +

            '.me-tab {' +
                'border: 1px solid #2A8DD4;' +
                'display: inline-block;' +
            '}' +

            '.me-tab-link {' +
                'cursor: pointer;' +
                'display: inline-block;' +
                'padding: 4px 8px;' +
            '}' +

            '.me-tab-link:hover {' +
                'background-color: #0072C6;' +
                'color: #fff;' +
                'text-decoration: none;' +
            '}';

        elements.head = document.querySelector('head');
        elements.head.appendChild(style);
    }
    
    function cleanHtml(html) {
        return html.replace('<br>', '').replace('<br />', '').replace('<br/>', '');
    }

    function createTabs() {
        var html = '<div class="me-markdown ms-rte-border-field ms-rte-border"><textarea class="me-markdown-textarea"></textarea></div>' +
            '<ul class="me-tab-container">' +
                '<li class="me-tab"><a data-connected="markdown" class="me-tab-link">Toggle Markdown</a></li>' +
            '</ul>';

        elements.editor = document.createElement('div');
        elements.editor.className = 'me-editor-container';
        elements.editor.innerHTML = html;

        elements.fields = document.querySelector('[id*="ControlWrapper_RichHtmlField"]');
        elements.fields.appendChild(elements.editor);
    }

    function eventBindings() {
        elements.markdown = document.querySelector('a[data-connected="markdown"]');

        elements.markdown.addEventListener('click', function () {
            var className = ' me-markdown--activate ';
            var textarea = document.querySelector('.me-markdown-textarea');

            if (elements.fields.className.indexOf(className) > -1) {
                elements.fields.className = elements.fields.className.replace(className, ' ');               

                var html = marked(textarea.value);
                html += '<pre style="display: none;" class="noindex me-markdown-text">' + textarea.value + '</pre>';

                elements.fields.querySelector('.ms-rtestate-write').innerHTML = html;
            } else {
                elements.fields.className += className;

                textarea.value = cleanHtml(elements.fields.querySelector('.me-markdown-text').innerHTML);
            }
        });
    }

    module.initalise = function () {
        appendStyles();
        createTabs();
        eventBindings();
    };

    _spBodyOnLoadFunctionNames.push("ME.initalise");
})();