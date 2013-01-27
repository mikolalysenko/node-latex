var exec = require("child_process").exec;


function sanitize(expr) {
  return expr;
}


function makeDVI(stream) {
  return stream;
}

function makePDF(stream) {
  //TODO: Convert to pdf
}

function makePNG(stream) {
}



//Converts a expression into a LaTeX image
module.exports = function(expr, options) {
  if(!options) {
    options = {};
  }
  
  //Unpack options
  var format = (options.format || "png").toLowerCase();
  
  //Default header
  var header = options.header || [
    "\documentclass{article}",
    "\begin{document}"
  ].join("\n");
  
  //Default footer
  var footer = options.footer || [
    "\end{document}"
  ];
  
  //If we are in batch mode, run expression as an instance of an array
  var batch_mode = expr instanceof Array;
  
  //Write document out to latex
  var tex = exec("latex");
  tex.stdin.write(header);
  if(batch_mode) {
    for(var i=0; i<expr.length; ++i) {
      if(i > 0) {
        tex.stdin.write("\newpage");
      }
      tex.stdin.write("\[");
      tex.stdin.write(sanitize(expr[i]));
      tex.stdin.write("\]");
    }
  } else {
    tex.stdin.write("\[");
    tex.stdin.write(sanitize(expr));
    tex.stdin.write("\]");
  }
  tex.stdin.end(footer);
  
  
  if(batch_mode) {
    //Run dvichop on output
  } else {
  
  }
  
  
  
  
}
