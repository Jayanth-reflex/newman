# Newman-Based API Test Runner with Input Iterations

A command-line utility that automates Postman collections using [Newman](https://github.com/postmanlabs/newman). Ideal for CI/CD pipelines, it handles authentication, token generation, and data-driven execution via CSV files—complete with request/response logging and built-in delays to avoid race conditions.

---

## Table of Contents

<table>
  <thead>
    <tr>
      <th>#</th>
      <th>Section</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td>
      <td><a href="#newman-cli-overview">Newman CLI Overview</a></td>
    </tr>
    <tr>
      <td>2</td>
      <td><a href="#key-features-of-newman">Key Features of Newman</a></td>
    </tr>
    <tr>
      <td>3</td>
      <td><a href="#advantages-over-postman">Advantages Over Postman</a></td>
    </tr>
    <tr>
      <td>4</td>
      <td><a href="#project-features">Project Features</a></td>
    </tr>
    <tr>
      <td>5</td>
      <td><a href="#prerequisites">Prerequisites</a></td>
    </tr>
    <tr>
      <td>6</td>
      <td><a href="#configuration">Configuration</a></td>
    </tr>
    <tr>
      <td>7</td>
      <td><a href="#script-overview-scriptjs">Script Overview (<code>script.js</code>)</a></td>
    </tr>
    <tr>
      <td>8</td>
      <td><a href="#running-the-script">Running the Script</a></td>
    </tr>
    <tr>
      <td>9</td>
      <td><a href="#example-output">Example Output</a></td>
    </tr>
    <tr>
      <td>10</td>
      <td><a href="#next-steps">Next Steps</a></td>
    </tr>
    <tr>
      <td>11</td>
      <td><a href="#conclusion">Conclusion</a></td>
    </tr>
    <tr>
      <td>12</td>
      <td><a href="#support">Support</a></td>
    </tr>
    <tr>
      <td>13</td>
      <td><a href="#references">References</a></td>
    </tr>
  </tbody>
</table>

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
  - <code>Authentication.postman_collection</code>  
  - <code>OperationalCollection.postman_collection</code>  
  - <code>Environment.postman_environment.json</code>  
- Optional CSV input files (each with header row + data rows)

---

## Configuration

1. **Collections & Environment**  
   Place the following files in your project root:  
   <code>Authentication.postman_collection</code>  
   <code>OperationalCollection.postman_collection</code>  
   <code>Environment.postman_environment.json</code>

2. **Input Files**  
   - Ensure each CSV (e.g., <code>input1.csv</code>) has a header row followed by data rows.  
   - Add the filenames to the `inputFiles` array at the top of <code>script.js</code>.

3. **Adjustable Delays**  
   - Modify `AUTH_DELAY_MS` and `BATCH_DELAY_MS` constants in <code>script.js</code> if needed.

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

- Add new CSV files to `inputFiles` in <code>script.js</code>.  
- Integrate <code>node script.js</code> into your CI/CD pipeline’s test stage.  
- Extend logging to write to files or external logging services.  
- Implement additional error-reporting (e.g., Slack notifications).

---

## Conclusion

Newman excels at **automated, headless testing** and **CI/CD integration**, while Postman’s GUI is better for manual API exploration. For teams aiming to embed API tests in a DevOps pipeline, Newman delivers greater flexibility and reliability.

---

## Support

For questions or issues, please open an issue in the project repository.

---

## References

- [Official Newman Documentation](https://github.com/postmanlabs/newman)
