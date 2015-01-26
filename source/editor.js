(function (module) {
	'use strict';

	var classes = {
			prefix: 'markdown',
			active: 'markdown--active',
			tabActive: 'markdown-tab-link--active'
		},
		md,
		rtes = [];

	// Add the textarea for Markdown, and the toggling button
	function appendHtml () {
		var html =
			'<ul class="' + classes.prefix + '-tab-list">' +
				'<li class="' + classes.prefix + '-tab">' +
					'<a class="' + classes.prefix + '-tab-link">' +
						'<span class="ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">' +
							'<img style="top: -269px; left: -37px;" src="/_layouts/15/1033/images/formatmap16x16.png">' +
						'</span>' +
						'<span class="ms-cui-ctl-mediumlabel">Toggle Markdown</span>' +
					'</a>' +
				'</li>' +
				'<li class="' + classes.prefix + '-tab ' + classes.prefix + '-tab--fullscreen">' +
					'<a class="' + classes.prefix + '-tab-link">' +
						'<span class="ms-cui-img-16by16 ms-cui-img-cont-float ms-cui-imageDisabled" unselectable="on">' +
							'<img style="top: -236px; left: -271px;" src="/_layouts/15/1033/images/formatmap16x16.png">' +
						'</span>' +
						'<span class="ms-cui-ctl-mediumlabel">Full Screen</span>' +
					'</a>' +
				'</li>' +
			'</ul>' +
			'<div class="' + classes.prefix + '-textarea-container ms-rte-border-field ms-rte-border">' +
				'<textarea class="' + classes.prefix + '-textarea"></textarea>' +
			'</div>';

		// Select all areas of the page that are rich text editors (page content
		// or content editor web parts)
		var fields = document.querySelectorAll('.ms-rtestate-write[contenteditable="true"]');

		for (var i = 0; i < fields.length; i++) {
			var wpBody = findFieldAncestor(fields[i]);

			if (wpBody) {
				var ancestor = wpBody.parentNode.parentNode;
				ancestor.className += ' ' + classes.prefix;

				var editor = document.createElement('div');
				editor.className = classes.prefix + '-editor-container';
				editor.innerHTML = html;
				editor.setAttribute('unselectable', 'on');

				wpBody.parentNode.insertBefore(editor, wpBody);

				// Save references to the field, ancestor and editor for event
				// bindings
				var rte = {
					field: fields[i],
					ancestor: ancestor,
					textarea: editor.querySelector('.' + classes.prefix + '-textarea'),
					button: editor.querySelector('.' + classes.prefix + '-tab-link'),
					fullscreen: editor.querySelector('.' + classes.prefix + '-tab--fullscreen a')
				};

				rtes.push(rte);
			}
		}
	}

	// Transform the HTML before going into Markdown mode
	function cleanHtml (html) {
		// Trim
		html = html.trim();

		// Remove RTE range cursor elements
		html = html.replace('&lt;span id="ms-rterangecursor-start" rtenodeid="1"&gt;&lt;/span&gt;', '');
		html = html.replace('&lt;span id="ms-rterangecursor-end"&gt;&lt;/span&gt;', '');

		return html;
	}

	// Attach the click binding for the toggle button
	function eventBindings () {
		rtes.forEach(function (rte) {
			// When the toggle button is clicked, switch between the two modes
			rte.button.addEventListener('click', function () {
				if (hasClass(rte.ancestor, classes.active)) {
					toggleRichText(rte);
				} else {
					toggleMarkdown(rte);
				}
			});

			rte.fullscreen.addEventListener('click', function () {
				toggleFullscreen(rte);
			});

			rte.textarea.addEventListener('keyup', function () {
				saveMarkdown(rte.textarea, rte.field);
			});

			rte.textarea.addEventListener('change', function () {
				saveMarkdown(rte.textarea, rte.field);
			});
		});
	}

	// Return the appropriate parent container for the rich text editor
	function findFieldAncestor (element) {
		// If it is a page content, find one parent
		var ancestor = findAncestor(element, 'ms-WPBody');

		// If it is a content editor web part, the above ancestor class
		// won't exist
		if (!ancestor) {
			return findAncestor(element, 'ms-formfieldvaluecontainer');
		}

		return ancestor;
	}

	// Return the first parent node that has the given class name
	function findAncestor (element, className) {
		while ((element = element.parentElement) && !hasClass(element, className)) {
			continue;
		}

		return element;
	}

	// Return true if an element has the given class name
	function hasClass (element, className) {
		if (element && element instanceof HTMLElement) {
			return (' ' + element.className + ' ').indexOf(' ' + className + ' ') > -1;
		}

		return false;
	}

	// Convert Markdown to HTML and copy HTML content into the RTE
	function saveMarkdown (textarea, field) {
		if (typeof (md) === 'undefined') {
			md = window.markdownit();
		}

		var html = md.render(textarea.value);

		if (html.length) {
			field.innerHTML = html;
		}
	}

	// Convert the Markdown into HTML, and show it in the rich text editor field
	function toggleFullscreen (rte) {
		var html = '<div class="ms-input-divAroundTextArea ms-fullWidth">' +
				'<textarea id="markdowndialog_textarea" class="markdown-textarea">' +
					rte.textarea.value +
				'</textarea>' +
			'</div>' +
			'<div class="ms-core-form-bottomButtonBox">' +
				'<input type="button" value="OK" class="ms-ButtonHeightWidth" id="markdowndialog_okbutton">' +
				'<input type="button" value="Cancel" class="ms-ButtonHeightWidth" id="markdowndialog_cancelbutton">' +
			'</div>';

		var element = document.createElement('div');
		element.className = 'markdown-modal';
		element.innerHTML = html;

		SP.SOD.loadMultiple(['sp.ui.dialog.js'], function () {
			SP.UI.ModalDialog.showModalDialog({
				allowMaximize: true,
				height: window.innerHeight - 15,
				html: element,
				showClose: true,
				title: 'Markdown Editor',
				width: 960
			});

			document.querySelector('#markdowndialog_okbutton').addEventListener('click', function () {
				rte.textarea.value = document.querySelector('#markdowndialog_textarea').value;
				SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.OK);
			});

			document.querySelector('#markdowndialog_cancelbutton').addEventListener('click', function () {
				SP.UI.ModalDialog.commonModalDialogClose(SP.UI.DialogResult.cancel);
			});
		});
	}

	// Convert the HTML to Markdown, and show it in the rich text editor field
	function toggleMarkdown (rte) {
		try {
			var html = rte.field.innerHTML;

			if (html.length) {
				html = toMarkdown(html);
				rte.textarea.value = cleanHtml(html);

				// Set the min-height to the textarea
				var minHeight = rte.field.offsetHeight > 150 ? rte.field.offsetHeight : 150;
				rte.textarea.style.minHeight = minHeight + 'px';

				rte.ancestor.className += ' ' + classes.active;
				rte.button.querySelector('.ms-cui-ctl-mediumlabel').innerText = 'Toggle Rich Text';
			}
		} catch (exp) {
			SP.UI.Notify.addNotification('<strong>Warning:</strong> There was an error while converting your HTML to Markdown');
			console.log('Error while converting HTML to Markdown', exp);
		}
	}

	// Convert the Markdown into HTML, and show it in the rich text editor field
	function toggleRichText (rte) {
		rte.ancestor.className = rte.ancestor.className.replace(' ' + classes.active, '');
		rte.button.querySelector('.ms-cui-ctl-mediumlabel').innerText = 'Toggle Markdown';

		try {
			saveMarkdown(rte.textarea, rte.field);
		} catch (exp) {
			SP.UI.Notify.addNotification('<strong>Warning:</strong> There was an error while converting your Markdown to HTML');
			console.log('Error while converting Markdown to HTML', exp);
		}
	}

	module.init = function () {
		var inDesignMode = document.forms[MSOWebPartPageFormName].MSOLayout_InDesignMode.value;

		// Only engage while in design (edit) mode
		if (inDesignMode) {
			appendHtml();
			eventBindings();
		}
	};

	if (_spBodyOnLoadCalled) {
		module.init();
	} else {
		// Wait for body load using an OOTB SharePoint object
		_spBodyOnLoadFunctionNames.push('SPMD.init');
	}

})(window.SPMD = window.SPMD || {});