# Newman CLI Overview and Advantages Over Postman

**Newman** is a command-line companion to **Postman**, designed for automated, headless API testing, ideal for **CI/CD environments**. It runs Postman collections from the terminal, supporting custom reporting, integration, and efficient execution for continuous testing.

## Key Features:
- **Headless Execution**: Runs tests via CLI, perfect for automation and CI/CD pipelines.
- **CI/CD Integration**: Easily integrates with Jenkins, GitLab, CircleCI, etc., enabling automated testing during build or deployment cycles.
- **Customizable Reporting**: Supports reports in **HTML**, **JSON**, and **JUnit** formats for seamless integration with external tools.
- **Environment Support**: Easily manage environments and variables via CLI for different stages (dev, staging, prod).
- **Cross-Platform Compatibility**: Runs on **Windows**, **macOS**, and **Linux**, making it suitable for diverse environments.

## Advantages Over Postman:
- **Automation**: Newman is headless, making it better for automated, non-interactive execution compared to Postman’s GUI-based interface.
- **CI/CD Integration**: Unlike Postman, Newman seamlessly integrates into CI/CD systems for continuous testing.
- **Customizable Reports**: Newman offers more flexible and detailed reporting options compared to Postman’s built-in features.
- **Environment Flexibility**: Easily pass environments via the command line, providing dynamic testing configurations.
- **Execution Control**: Newman allows more granular control over test execution (iterations, concurrency), making it ideal for performance testing.


---

## 🚀 Features

- **Authentication Collection**: Generates a token before each data processing run.
- **Operational Collection**: Executes requests iteratively using data from CSV files.
- **Logging**: Logs request body and response body (if valid JSON) to the console.
- **Delay Handling**: Ensures proper timing between collection runs to avoid race conditions.

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- Newman (`npm install -g newman`)
- Your Postman collections and environment JSON files
- Optional: CSV input files (header row followed by test data)

---

## ⚙️ Configuration

1. Place your Postman collections and environment file in the project root:
   - `Authentication.postman_collection`
   - `OperationalCollection.postman_collection`
   - `Environment.postman_environment.json`

2. Add your data files:
   - Ensure CSVs (e.g., `input1.csv`) are in the correct format (header + rows).
   - Add the filenames to the `inputFiles` array in `script.js`.

---

## 🧠 Script Overview (`script.js`)

### Main Functional Blocks:

- `runCollections(inputFile)`: 
  - Runs the authentication collection first.
  - Waits 10 seconds for token propagation.
  - Then, it runs the operational collection with input file iterations.

- `logRequestResponse(args, isResponse)`: 
  - Logs request body (raw) and response body (JSON if valid).
  - Skips specific parsing like `DataSubjectId` or `UrlEncodedLinkToken`.

- `getIterationCount(inputFile)`:
  Calculates the number of iterations based on the number of rows in the CSV file.

- `executeAllInputFiles()`:
  - Sequentially processes all input files listed.
  - Adds a 20-second delay between batches to manage server load or token expiration risks.

---

## 🏁 Running the Script

```bash
node script.js


## Conclusion:
Newman is optimized for **automated testing**, **CI/CD integration**, and large-scale test execution, while Postman is better suited for **manual testing** and exploration. Teams seeking continuous, automated testing in a DevOps pipeline should leverage Newman for higher efficiency and flexibility.
