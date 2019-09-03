var NodeUglifier = require("node-uglifier");

new NodeUglifier("./app.js").uglify().exportToFile("lib_compiled/test/resultFiles/simpleMergeAndUglify.js");
