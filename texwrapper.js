var spawn   = require("child_process").spawn;
var temp    = require("temp");
var fs      = require("fs");
var path    = require("path");
var Stream  = require("stream");

//Eagerly create temporary directory
var directory_built = false
  , directory_err   = null
  , directory_wait  = []
  , directory_path  = "/tmp"
  , directory_count = 0;
temp.mkdir("node-latex", function(err, dirpath) {
  directory_err = err;
  directory_path = dirpath;
  directory_built = true;
  for(var i=0; i<directory_wait.length; ++i) {
    directory_wait[i]();
  }
  directory_wait.length = 0;
});

//Waits for directory to be built
function awaitDir(cb) {
  function makeLocalDir() {
    if(directory_err) {
      console.log("Error creating temp directory", directory_err);
      cb(directory_err, null);
      return;
    }
    var temp_path = path.join(directory_path, "" + directory_count++);
    fs.mkdir(temp_path, function(err) {
      if(err) {
        cb(err, null);
        return;
      }
      cb(null, temp_path);
    });
  }
  if(directory_built) {
    makeLocalDir();
  } else {
    directory_wait.push(makeLocalDir);
  }
}

//Send errors downstream to result
function handleErrors(dirpath, result) {
  var log_file = path.join(dirpath, "texput.log");
  fs.exists(log_file, function(exists) {
  
    if(!exists) {
      fs.rmdir(dirpath);
      result.emit("error", new Error("Error running LaTeX"));
      return;
    }
    
    //Try to crawl through the horrible mess that LaTeX shat upon us
    var log = fs.createReadStream(log_file);
    
    
  
  });
}

//Converts a expression into a LaTeX image
module.exports = function(expr, options) {
  if(!options) {
    options = {};
  }
  
  //LaTeX command
  var tex_command = options.command || "latex";
  
  //Create result
  var result = new Stream();
  awaitDir(function(err, dirpath) {
    function error(e) {
      result.emit("error", e);
      result.destroySoon();
    }
    if(err) {
      error(err);
      return;
    }
    
    //Write data to tex file
    console.log("directory = ", dirpath);
    var input_path = path.join(dirpath, "texput.tex");
    var tex_file = fs.createWriteStream(input_path);
    tex_file.write(header);
    tex_file.write(expr);
    tex_file.end(footer);
    tex_file.destroySoon();
    
    //Invoke LaTeX
    var tex = spawn(tex_command, [
      "-interaction=batchmode",
      "texput.tex"
    ], {
      cwd: dirpath,
      env: process.env
    });
    
    //tex.stdout.pipe(process.stdout);
    console.log("Calling latex");
    
    //Wait for LaTeX to finish its thing
    tex.on("exit", function(code, signal) {
      var output_file = path.join(dirpath, "texput.dvi");
      fs.exists(output_file, function(exists) {
        if(exists) {
          var stream = fs.createReadStream(output_file);
          stream.on("close", function() {
            fs.rmdir(dirpath);
          });
          stream.pipe(result);
        } else {
          handleErrors(dirpath, result);
        }
      });
    });
  });
  
  return result;
}
