var fileSystem = require("fs-extra"),
    path = require("path");

// clean de dist folder
fileSystem.emptyDirSync(path.join(__dirname, "../chrome"));
fileSystem.emptyDirSync(path.join(__dirname, "../firefox"));

require("./manifest.generator");
