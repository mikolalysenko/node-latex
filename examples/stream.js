//One liner application of node-latex showing how to make tex work with streams
require("../texwrapper.js")(process.stdin).pipe(process.stdout);

