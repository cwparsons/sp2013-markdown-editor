(function(module) {
    'use strict';

    var classes = {
            prefix: 'me-markdown',
            active: 'me-markdown--active',
            tabActive: 'me-markdown-tab-link--active'
        },
        rteFields = [];

    // Add the textarea for Markdown, and the toggling button
    function appendHtml () {
        var html =
            '<div class="' + classes.prefix + '-textarea-container ms-rte-border-field ms-rte-border">' +
                '<textarea class="' + classes.prefix + '-textarea"></textarea>' +
            '</div>' +
            '<ul class="' + classes.prefix + '-tab-list">' +
                '<li class="' + classes.prefix + '-tab">' +
                    '<a data-connected="markdown" class="' + classes.prefix + '-tab-link">Toggle Markdown</a>' +
                '</li>' +
            '</ul>';

        // Select all areas of the page that are rich text editors (page content
        // or content editor web parts)
        var fields = document.querySelectorAll('.ms-rtestate-write[contenteditable="true"]');

        for (var i = 0; i < fields.length; i++) {
            var ancestor = findFieldAncestor(fields[i]);

            if (ancestor) {
                ancestor.className += ' ' + classes.prefix;

                var editor = document.createElement('div');
                editor.className = classes.prefix + '-editor-container';
                editor.innerHTML = html;

                ancestor.appendChild(editor);

                // Save references to the field, ancestor and editor for event
                // bindings
                var rteField = {
                    field: fields[i],
                    ancestor: ancestor,
                    textarea: editor.querySelector('.me-markdown-textarea'),
                    button: editor.querySelector('.me-markdown-tab-link')
                };

                rteFields.push(rteField);

                // Set the min-height to the textarea
                rteField.textarea.style.minHeight = rteField.field.offsetHeight + 'px';
            }
        }
    }

    function findFieldAncestor (element) {
        // If it is a page content, find one parent
        var ancestor = findAncestor(element, 'ms-rtestate-field');

        // If it is a content editor web part, the above ancestor class
        // won't exist
        if (!ancestor) {
            return findAncestor(element, 'ms-webpart-chrome');
        }

        return ancestor;
    }

    function findAncestor (element, className) {
        while ((element = element.parentElement) && !hasClass(element, className)) {
            continue;
        }

        return element;
    }

    function hasClass (element, className) {
        if (element && element instanceof HTMLElement) {
            return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
        }

        return false;
    }

    // Attach the click binding for the toggle button
    function eventBindings () {
        rteFields.forEach(function (rteField) {
            rteField.button.addEventListener('click', function () {
                if (hasClass(rteField.ancestor, classes.active)) {
                    toggleRichText(rteField);
                } else {
                    toggleMarkdown(rteField);
                }
            });
        });
    }

    // Convert the Markdown into HTML, and show it in the rich text editor field
    function toggleRichText (rteField) {
        rteField.ancestor.className = rteField.field.className.replace(' ' + classes.active, '');
        rteField.button.innerText = 'Toggle Markdown';

        try {
            var html = marked(rteField.textarea.value);

            if (html.length) {
                rteField.field.innerHTML = html;
            }
        } catch (exp) {
            SP.UI.Notify.addNotification('<strong>Warning:</strong> There was an error while converting your Markdown to HTML');
            console.log('Error while converting Markdown to HTML', exp);
        }
    }

    // Convert the HTML to Markdown, and show it in the rich text editor field
    function toggleMarkdown (rteField) {
        rteField.ancestor.className += ' ' + classes.active;
        rteField.button.innerText = 'Toggle Rich Text';

        try {
            var html = rteField.field.innerHTML;

            if (html.length) {
                rteField.textarea.value = toMarkdown(html);
            }
        } catch (exp) {
            SP.UI.Notify.addNotification('<strong>Warning:</strong> There was an error while converting your HTML to Markdown');
            console.log('Error while converting HTML to Markdown', exp);
        }
    }

    module.initalise = function () {
        var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;

        // Only engage while in design (edit) mode
        if (inDesignMode) {
            appendHtml();
            eventBindings();
        }
    };

    if (_spBodyOnLoadCalled) {
        module.initalise();
    } else {
        // Wait for body load using an OOTB SharePoint object
        _spBodyOnLoadFunctionNames.push('ME.initalise');
    }

})(window.ME = window.ME || {});