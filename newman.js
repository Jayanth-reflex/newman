const newman = require('newman');
const fs = require('fs');

// Paths to collections and environment file
const AUTH_COLLECTION = "Authentication.postman_collection";
const UPDATE_COLLECTION = "OperationalCollection.postman_collection";
const ENVIRONMENT = "Environment.postman_environment.json";

// Array of input files
const inputFiles = [
    "input1.csv","input2.csv","input3.csv"  // provide your input files path used for processing in the Operational Collection
];

// Function to log request and response (without DataSubjectId and UrlEncodedLinkToken extraction)
function logRequestResponse(args, isResponse = false) {
    const data = isResponse 
        ? (args.response.stream ? args.response.stream.toString() : "No response body") 
        : (args.request.body ? args.request.body.raw : "No request body");

    if (isResponse && data) {
        try {
            const parsedData = JSON.parse(data);
            console.log("Valid JSON response:", parsedData);
        } catch (error) {
            console.error("Invalid JSON response or empty response:", data);
        }
    }
}

// Function to get the number of iterations from the input file
function getIterationCount(inputFile) {
    return new Promise((resolve, reject) => {
        fs.readFile(inputFile, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                const lines = data.trim().split('\n');
                const count = lines.length - 1; // Subtract 1 for the header line if present
                resolve(count);
            }
        });
    });
}

// Function to run the collections for each input file
async function runCollections(inputFile) {
    console.log("Running AUTH_COLLECTION to generate token...");
    await new Promise((resolve) => {
        newman.run({
            collection: AUTH_COLLECTION,
            environment: ENVIRONMENT,
            insecure: true,
            reporters: 'cli',
            exportEnvironment: ENVIRONMENT
        }).on('done', function () {
            console.log("AUTH_COLLECTION run complete.");
            resolve();
        });
    });

    console.log("Waiting for 10 seconds before running the UPDATE_COLLECTION...");
    await new Promise(resolve => setTimeout(resolve, 10000)); // Wait for 10 seconds

    const iterationCount = await getIterationCount(inputFile);
    console.log(`Running UPDATE_COLLECTION with ${iterationCount} iterations using input file: ${inputFile}`);

    return new Promise((resolve) => {
        newman.run({
            collection: UPDATE_COLLECTION,
            environment: ENVIRONMENT,
            iterationData: inputFile,
            insecure: true,
            reporters: 'cli'
        }).on('beforeRequest', function (error, args) {
            if (error) {
                console.error("Error in beforeRequest:", error);
            } else {
                logRequestResponse(args, false);
            }
        }).on('request', function (error, args) {
            if (error) {
                console.error("Error in request:", error);
            } else {
                logRequestResponse(args, true);
            }
        }).on('done', function () {
            console.log("UPDATE_COLLECTION run complete.");
            resolve(); // Resolve the promise when done
        });
    });
}

// Execute for all input files in sequence
async function executeAllInputFiles() {
    for (const inputFile of inputFiles) {
        await runCollections(inputFile);
        console.log("Waiting for 60 seconds before running the next AUTH_COLLECTION...");
        await new Promise(resolve => setTimeout(resolve, 20000)); // Wait for 20 seconds
    }
    console.log("All collections executed. Data saved.");
}

// Start the execution
executeAllInputFiles().catch(err => console.error("Error during execution:", err));
