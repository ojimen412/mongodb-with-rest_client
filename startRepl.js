const repl = require('repl');
const fs = require('fs');
const path = require('path');

// List of scripts to watch and load
const scripts = ['./manipulateData.js'];  // Adjust the path as needed

// Function to load and expose module exports to the REPL context
const loadFunctions = (context) => {
    scripts.forEach(script => {
        try {
            // Delete the module from cache to allow reloading
            delete require.cache[require.resolve(script)];

            // Load the module using require
            const moduleExports = require(script);

            // Add each exported function or variable to the REPL context
            Object.keys(moduleExports).forEach(fnName => {
                context[fnName] = moduleExports[fnName];
            });

            console.log(`Loaded functions from ${script}`);
        } catch (error) {
            console.error(`Error loading ${script}:`, error);
        }
    });
};

// Start the REPL
const replServer = repl.start({ prompt: '> ' });

// Initially load functions into the REPL context
loadFunctions(replServer.context);

// Watch scripts for changes and reload functions when they change
scripts.forEach(script => {
    const scriptPath = path.resolve(__dirname, script);
    fs.watchFile(scriptPath, (curr, prev) => {
        console.log(`${script} has changed, reloading functions...`);
        loadFunctions(replServer.context);  // Reload functions into REPL context
    });
});

// Add reload function to the REPL context for manual reloading
replServer.context.reloadDocuments = () => {
    loadFunctions(replServer.context);
    console.log('Documents reloaded into REPL context');
};
