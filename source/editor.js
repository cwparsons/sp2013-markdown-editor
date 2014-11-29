;(function(module, undefined) {
    'use strict';

    var classes = {
            prefix: 'me-markdown',
            active: 'me-markdown--active',
            tabActive: 'me-markdown-tab-link--active'
        },
        elements = {};

    function appendStyles() {
        var style = document.createElement('style');

        style.innerHTML =
            '.' + classes.prefix + '{' +
                'position: relative;' +
            '}' +

            '.' + classes.active + ' .ms-formfieldvaluecontainer {' +
                'display: none;' +
            '}' +

            '.' + classes.active + ' .ms-formfieldlabel:after {' +
                'content: " (Markdown)";' +
            '}' +

            '.' + classes.prefix + '-textarea-container {' +
                'border-style: solid;' +
                'border-width: 1px;' +
                'display: none;' +
                'margin: 0 0 4px;' +
                'padding: 5px' +
            '}' +

            '.' + classes.active + ' .' + classes.prefix + '-textarea-container {' +
                'display: block;' +
            '}' +

            '.' + classes.prefix + '-textarea {' +
                '-moz-box-sizing: border-box;' +
                'box-sizing: border-box;' +
                'border: 0;' +
                'font-family: Consolas, monospace;' +
                'font-size: 16px;' +
                'min-height: 410px;' +
                'width: 100%;' +
            '}' +

            '.' + classes.prefix + '-tab-container {' +
                'list-style: none;' +
                'margin: 0;' +
                'padding: 0;' +
                'position: absolute;' +
                'right: 10px;' +
                'top: 30px;' +
            '}' +

            '.' + classes.prefix + '-tab {' +
                'display: block;' +
                'margin-bottom: 10px;' +
            '}' +

            '.' + classes.prefix + '-tab + .' + classes.prefix + '-tab {' +
                'margin-left: -1px;' +
            '}' +

            '.' + classes.prefix + '-tab-link {' +
                'border: 1px solid #666;' +
                'color: #444;' +
                'cursor: pointer;' +
                'display: block;' +
                'padding: 4px 8px;' +
                'text-align: center;' +
                'width: 105px;' +
            '}' +

            '.' + classes.prefix + '-tab-link:hover {' +
                'background-color: #aaa;' +
                'color: #fff;' +
                'text-decoration: none;' +
            '}' +

            '.' + classes.prefix + '-tab-link:active {' +
                'background-color: #666;' +
            '}';

        elements.head = document.querySelector('head');
        elements.head.appendChild(style);
    }

    function cleanHtml(html) {
        return html.replace(/\<br( \/|\/)?\>/g, '');
    }

    function createTabs() {
        var html =
            '<div class="' + classes.prefix + '-textarea-container ms-rte-border-field ms-rte-border">' +
                '<textarea class="' + classes.prefix + '-textarea"></textarea>' +
            '</div>' +
            '<ul class="' + classes.prefix + '-tab-container">' +
                '<li class="' + classes.prefix + '-tab">' +
                    '<a data-connected="markdown" class="' + classes.prefix + '-tab-link">Toggle Rich Text</a>' +
                '</li>' +
            '</ul>';

        elements.editor = document.createElement('div');
        elements.editor.className = classes.prefix + '-editor-container';
        elements.editor.innerHTML = html;

        elements.fields = document.querySelector('[id*="ControlWrapper_RichHtmlField"]');
        elements.fields.className += ' ' + classes.prefix;
        elements.fields.appendChild(elements.editor);
    }

    function eventBindings() {
        elements.markdown = document.querySelector('a[data-connected="markdown"]');
        elements.textarea = document.querySelector('.' + classes.prefix + '-textarea');

        elements.markdown.addEventListener('click', function () {
            if (elements.fields.className.indexOf(classes.active) > -1) {
                elements.fields.className = elements.fields.className.replace(' ' + classes.active, '');
                elements.markdown.className = elements.markdown.className.replace(' ' + classes.tabActive, '');

                elements.markdown.innerText = 'Toggle Rich Text';

                var html = marked(elements.textarea.value);
                html += '<pre style="display: none;" class="noindex ' + classes.prefix + '-text">' + elements.textarea.value + '</pre>';

                elements.fields.querySelector('.ms-rtestate-write').innerHTML = html;
            } else {
                elements.fields.className += ' ' + classes.active;
                elements.markdown.className += ' ' + classes.tabActive;

                elements.markdown.innerText = 'Toggle Markdown';

                elements.textarea.value = cleanHtml(elements.fields.querySelector('.' + classes.prefix + '-text').innerHTML);
            }
        });
    }

    module.initalise = function () {
        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;

        if (inDesignMode) {
            appendStyles();
            createTabs();
            eventBindings();
        }
    };

    _spBodyOnLoadFunctionNames.push("ME.initalise");
})(window.ME = window.ME || {});