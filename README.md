# Markdown Editor for SharePoint 2013

A Markdown editor to replace the rich text editor for SharePoint 2013.


## Getting Started

1. [Download the latest release of the script](https://github.com/habaneroconsulting/sp2013-markdown-editor/releases/latest).

2. Upload the JavaScript file to your `Style Library/Scripts`.

3. Edit your masterpage and add a reference to the new file. For example:

        <script src="/Style Library/Scripts/sp2013-markdown-editor.min.js"></script>

4. Save and publish your masterpage.

5. Go back to your portal and try it out.


## Support

If you have a bug, or a feature request, please post in the [issue tracker](https://github.com/habaneroconsulting/sp2013-markdown-editor/issues).


## Build Instructions

1. Install [NodeJS](http://nodejs.org/)

2. Install Grunt CLI, Bower, and bower-installer using NPM

        npm -g install grunt-cli bower bower-installer

3. Run `npm install` from command line at root project folder

4. Run `grunt bower` to download the vendor files using Bower, and copy them into the correct folder

5. Run `grunt build` to build, minify and concatenate the vendor and source files


## License

Copyright (c) 2014 Habanero Consulting Group

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.