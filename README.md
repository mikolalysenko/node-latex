node-latex
==========

Simple LaTeX wrapper for node.js

Installation
============

First, you need to install latex.  On any Debian based system, you can do this with the following command:

    sudo apt-get install texlive

On OS X, you will need to install [MacPorts](http://www.macports.org/) first.  Once that is set up, you can then do:

    sudo port install texlive
    
For Windows, you can try using cygwin though I have not tested this.

Once you have a working version of latex, you can install node-latex using the following command:

    npm install latex
    
Usage
=====

Here is an example of how to use the library in one line:

    require("latex")([
      "\\documentclass{article}",
      "\\begin{document}",
      "hello world",
      "\\end{document}"
    ]).pipe(process.stdout)

This will spit out a formatted PDF article to stdout that says "hello world".  The result of calling the function is returned as a stream and can be processed using other tools.  If you want to convert the result into an image or pdf, you can use [graphics magic](http://aheckmann.github.com/gm/).

`require("latex")(doc[, options])`
----------------------------------
The only exported function from `node-latex` is a function that takes as input a raw LaTeX document and returns a stream representing the document state. The type of `doc` must be one of the following:

* A string
* A [Buffer](http://nodejs.org/api/buffer.html)
* An array of strings and/or Buffers
* A readable [Stream](http://nodejs.org/api/stream.html)

In addition, you can also specify the following additional parameters via the `options` struct:

* `command`: An optional override for the latex command.  By default calls `latex`.
* `format`: Either "pdf" or "dvi".  By default returns a pdf.

The function returns a readable Stream object representing a LaTeX encoded document in either PDF or [DVI format](http://en.wikipedia.org/wiki/Device_independent_file_format).  If there were errors in the syntax of the document, they will be raised as errors on this Stream object.

Credits
=======
(c) 2013 Mikola Lysenko.  MIT License
