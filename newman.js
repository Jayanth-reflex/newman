const newman = require('newman');
const async = require('async');
const fs = require('fs').promises;
const path = require('path');
const winston = require('winston');

// Configure logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
            )
        })
    ]
});

// Configuration
const CONFIG = {
    collections: {
        auth: path.resolve("D:/newman test run PROD/file types/OT API Access Authentication.postman_collection"),
        update: path.resolve("D:/newman test run PROD/file types/MainFiletypeCollection.postman_collection")
    },
    environment: path.resolve("D:/newman test run PROD/file types/OT UAT API and BH Details.postman_environment.json"),
    inputFiles: [
        path.resolve("D:/newman test run PROD/file types/input3.csv"),
        path.resolve("D:/newman test run PROD/file types/input2.csv"),
        path.resolve("D:/newman test run PROD/file types/input1.csv")
    ],
    delays: {
        betweenCollections: 10000,
        betweenFiles: 20000
    },
    maxParallelRuns: parseInt(process.argv[2]) || 2
};

// Validate file existence
async function validateFiles() {
    const allFiles = [
        CONFIG.collections.auth,
        CONFIG.collections.update,
        CONFIG.environment,
        ...CONFIG.inputFiles
    ];

    for (const file of allFiles) {
        try {
            await fs.access(file);
        } catch (error) {
            throw new Error(`File not found: ${file}`);
        }
    }
}

// Get iteration count from input file
async function getIterationCount(inputFile) {
    try {
        const data = await fs.readFile(inputFile, 'utf8');
        const lines = data.trim().split('\n');
        return Math.max(0, lines.length - 1); // Subtract header, ensure non-negative
    } catch (error) {
        throw new Error(`Failed to read input file ${inputFile}: ${error.message}`);
    }
}

// Run Newman collection with proper error handling
function runNewmanCollection(options) {
    return new Promise((resolve, reject) => {
        newman.run(options)
            .on('beforeRequest', (err, args) => {
                if (err) {
                    logger.error('Error in beforeRequest:', { error: err, request: args.request.url });
                }
            })
            .on('request', (err, args) => {
                if (err) {
                    logger.error('Error in request:', { error: err, response: args.response.code });
                } else {
                    logger.info('Request successful:', {
                        url: args.request.url,
                        status: args.response.code
                    });
                }
            })
            .on('done', (err, summary) => {
                if (err || summary.error) {
                    reject(new Error(`Newman run failed: ${err || summary.error}`));
                } else {
                    resolve(summary);
                }
            });
    });
}

// Process single input file
async function processInputFile(inputFile) {
    const jobId = path.basename(inputFile, '.csv');
    logger.info(`Starting job for ${jobId}`);

    try {
        // Run auth collection
        logger.info(`Running AUTH_COLLECTION for ${jobId}`);
        await runNewmanCollection({
            collection: CONFIG.collections.auth,
            environment: CONFIG.environment,
            insecure: true,
            reporters: 'cli',
            exportEnvironment: CONFIG.environment
        });

        // Wait between collections
        await new Promise(resolve => setTimeout(resolve, CONFIG.delays.betweenCollections));

        // Get iteration count and run update collection
        const iterationCount = await getIterationCount(inputFile);
        logger.info(`Running UPDATE_COLLECTION for ${jobId} with ${iterationCount} iterations`);
        
        await runNewmanCollection({
            collection: CONFIG.collections.update,
            environment: CONFIG.environment,
            iterationData: inputFile,
            insecure: true,
            reporters: 'cli'
        });

        logger.info(`Completed job for ${jobId}`);
    } catch (error) {
        logger.error(`Failed to process ${jobId}:`, error);
        throw error;
    }
}

// Main execution function
async function main() {
    try {
        // Validate files before starting
        await validateFiles();

        // Create queue for parallel processing
        const queue = async.queue(async (inputFile) => {
            try {
                await processInputFile(inputFile);
                await new Promise(resolve => setTimeout(resolve, CONFIG.delays.betweenFiles));
            } catch (error) {
                logger.error(`Queue processing error for ${inputFile}:`, error);
            }
        }, CONFIG.maxParallelRuns);

        // Add all input files to queue
        queue.push(CONFIG.inputFiles);

        // Wait for queue to complete
        await new Promise((resolve) => {
            queue.drain(resolve);
        });

        logger.info('All collections executed successfully');
    } catch (error) {
        logger.error('Fatal error:', error);
        process.exit(1);
    }
}

// Start execution
main().catch(error => {
    logger.error('Unhandled error:', error);
    process.exit(1);
});