(function(module) {
    'use strict';

    var classes = {
            prefix: 'me-markdown',
            active: 'me-markdown--active',
            tabActive: 'me-markdown-tab-link--active'
        },
        elements = {};

    // Add the textarea for Markdown, and the toggling button
    function appendHtml() {
        var html =
            '<div class="' + classes.prefix + '-textarea-container ms-rte-border-field ms-rte-border">' +
                '<textarea class="' + classes.prefix + '-textarea"></textarea>' +
            '</div>' +
            '<ul class="' + classes.prefix + '-tab-list">' +
                '<li class="' + classes.prefix + '-tab">' +
                    '<a data-connected="markdown" class="' + classes.prefix + '-tab-link">Toggle Markdown</a>' +
                '</li>' +
            '</ul>';

        elements.editor = document.createElement('div');
        elements.editor.className = classes.prefix + '-editor-container';
        elements.editor.innerHTML = html;

        // TODO: Refactor to account for multiple rich text fields
        elements.field = document.querySelector('[id*="ControlWrapper_RichHtmlField"]');
        elements.field.className += ' ' + classes.prefix;
        elements.field.appendChild(elements.editor);
    }

    // Add our button and editor styles via JavaScript to reduce file
    // dependencies and ease overall installation.
    function appendStyles() {
        var style = document.createElement('style');

        style.innerHTML =
            '.' + classes.prefix + '{' +
                'position: relative;' +
            '}' +

            // Hide the rich text area on activation
            '.' + classes.active + ' .ms-formfieldvaluecontainer {' +
                'display: none;' +
            '}' +

            '.' + classes.prefix + ' .ms-formfieldlabel:after {' +
                'content: " (Rich Text)";' +
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

            '.' + classes.prefix + '-tab-list {' +
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

    // Attach the click binding for the toggle button
    function eventBindings() {
        elements.markdown = document.querySelector('a[data-connected="markdown"]');
        elements.textarea = document.querySelector('.' + classes.prefix + '-textarea');

        elements.markdown.addEventListener('click', function () {
            // Use the active CSS class for determining if we're on or not
            if (elements.field.className.indexOf(classes.active) > -1) {
                toggleRichText();
            } else {
                toggleMarkdown();
            }
        });
    }

    // Convert the Markdown into HTML, and show it in the rich text editor field
    function toggleRichText() {
        elements.field.className = elements.field.className.replace(' ' + classes.active, '');
        elements.markdown.className = elements.markdown.className.replace(' ' + classes.tabActive, '');

        elements.markdown.innerText = 'Toggle Markdown';

        try {
            var html = marked(elements.textarea.value);

            if (html.length) {
                elements.field.querySelector('.ms-rtestate-write').innerHTML = html;
            }
        } catch (exp) {
            SP.UI.Notify.addNotification('<strong>Warning:</strong> There was an error while converting your Markdown to HTML');
            console.log("Error while converting Markdown to HTML", exp);
        }
    }

    // Convert the HTML to Markdown, and show it in the rich text editor field
    function toggleMarkdown() {
        elements.field.className += ' ' + classes.active;
        elements.markdown.className += ' ' + classes.tabActive;

        elements.markdown.innerText = 'Toggle Rich Text';

        try {
            var html = elements.field.querySelector('.ms-rtestate-write').innerHTML;

            if (html.length) {
                elements.textarea.value = toMarkdown(html);
            }
        } catch (exp) {
            SP.UI.Notify.addNotification('<strong>Warning:</strong> There was an error while converting your HTML to Markdown');
            console.log("Warning: Error while converting HTML to Markdown", exp);
        }
    }

    module.initalise = function () {
        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;

        // Only engage while in design (edit) mode
        if (inDesignMode) {
            appendHtml();
            appendStyles();
            eventBindings();
        }
    };

    // Wait for body load using an OOTB SharePoint object
    _spBodyOnLoadFunctionNames.push("ME.initalise");
})(window.ME = window.ME || {});