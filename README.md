<pre>
# Newman-Based API Test Runner with Input Iterations

A command-line utility that automates Postman collections using [Newman](https://github.com/postmanlabs/newman). Ideal for CI/CD pipelines, it handles authentication, token generation, and data-driven execution via CSV files—complete with request/response logging and built-in delays to avoid race conditions.

---

## Table of Contents

1. [Newman CLI Overview](#newman-cli-overview)  
2. [Key Features of Newman](#key-features-of-newman)  
3. [Advantages Over Postman](#advantages-over-postman)  
4. [Project Features](#project-features)  
5. [Prerequisites](#prerequisites)  
6. [Configuration](#configuration)  
7. [Script Overview (`script.js`)](#script-overview-scriptjs)  
8. [Running the Script](#running-the-script)  
9. [Example Output](#example-output)  
10. [Next Steps](#next-steps)  
11. [Conclusion](#conclusion)  
12. [Support](#support)  
13. [License](#license)

---

## Newman CLI Overview

**Newman** is the headless command-line companion to Postman, built for automated API testing in CI/CD environments. It executes Postman collections without a GUI, supports multiple reporters, and can be integrated into any pipeline.

---

## Key Features of Newman

- **Headless Execution**: Invoke collections via CLI for non-interactive automation.  
- **CI/CD Integration**: Works seamlessly with Jenkins, GitLab CI, CircleCI, Azure DevOps, and more.  
- **Custom Reporting**: Output in CLI, HTML, JSON, or JUnit formats for easy consumption.  
- **Environment Support**: Pass and export environment files to target dev, staging, or prod setups.  
- **Cross-Platform**: Compatible with Windows, macOS, and Linux.

---

## Advantages Over Postman

- **Automation Focus**: Designed for scripted, repeatable runs; no manual clicks required.  
- **Deeper CI/CD Integration**: Built-in support for pipeline hooks, exit codes, and parallel runs.  
- **Flexible Reporting**: Choose your format and level of detail for integration with external dashboards.  
- **Dynamic Environments**: Swap environment variables on the fly via CLI flags.  
- **Execution Control**: Fine-grained options for iteration counts, delays, and concurrency.

---

## Project Features

- **Authentication Collection**: Generates an access token before each data run.  
- **Operational Collection**: Processes CSV files iteratively, one row per request.  
- **Logging**: Streams raw request bodies and validates JSON responses to the console.  
- **Delay Handling**:  
    - `AUTH_DELAY_MS` (default 10 000 ms) between auth and operational runs.  
    - `BATCH_DELAY_MS` (default 20 000 ms) between different input files.

---

## Prerequisites

- **Node.js** (v14+ recommended)  
- **Newman** installed globally:  
  <code>npm install -g newman</code>  
- Postman collections and environment JSON:  
  - `Authentication.postman_collection`  
  - `OperationalCollection.postman_collection`  
  - `Environment.postman_environment.json`  
- Optional CSV input files (each with header row + data rows)

---

## Configuration

1. **Collections & Environment**  
   Place the following files in your project root:  
   <code>Authentication.postman_collection</code>  
   <code>OperationalCollection.postman_collection</code>  
   <code>Environment.postman_environment.json</code>

2. **Input Files**  
   - Ensure each CSV (e.g., `input1.csv`) has a header row followed by data rows.  
   - Add the filenames to the `inputFiles` array at the top of `script.js`.

3. **Adjustable Delays**  
   - Modify `AUTH_DELAY_MS` and `BATCH_DELAY_MS` constants in `script.js` if needed.

---

## Script Overview (`script.js`)

- **`runCollections(inputFile)`**  
    - Runs the auth collection to refresh the token.  
    - Waits `AUTH_DELAY_MS`.  
    - Runs the operational collection with `iterationData` from the CSV.

- **`logRequestResponse(args, isResponse)`**  
    - On each request: logs raw body.  
    - On each response: attempts JSON parse, logs parsed object or raw text.

- **`getIterationCount(inputFile)`**  
    - Reads CSV, counts rows minus header to determine iteration count.

- **`executeAllInputFiles()`**  
    - Loops through `inputFiles`, calls `runCollections` for each.  
    - Waits `BATCH_DELAY_MS` between runs.

---

## Running the Script

<code>node script.js</code>

Ensure you have the correct files in place and Newman installed.

---

## Example Output

<code>
Running AUTH_COLLECTION to generate token...  
✔ AUTH_COLLECTION run complete.  
Waiting for 10 seconds before running the UPDATE_COLLECTION...  
Running UPDATE_COLLECTION with 5 iterations using input file: input1.csv  
→ Request: {"username":"user1","action":"update"}  
← Response: {"status":"success","id":12345}  
…  
Waiting for 20 seconds before next input file…  
All collections executed. Data saved.  
</code>

---

## Next Steps

- Add new CSV files to `inputFiles` in `script.js`.  
- Integrate `node script.js` into your CI/CD pipeline’s test stage.  
- Extend logging to write to files or external logging services.  
- Implement additional error-reporting (e.g., Slack notifications).

---

## Conclusion

Newman excels at **automated, headless testing** and **CI/CD integration**, while Postman’s GUI is better for manual API exploration. For teams aiming to embed API tests in a DevOps pipeline, Newman delivers greater flexibility and reliability.

---

## 

For questions or issues, please open an issue in the project repository.

---

</pre>
