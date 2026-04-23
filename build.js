// build.js
const fs = require("fs")
const path = require("path")
const { exec } = require("child_process")
const archiver = require("archiver")
const packageJson = require("./package.json")

// Production targets to build — add new targets here
const PRODUCTION_TARGETS = ["default", "zain", "nournet"]

// Function to execute shell commands
const executeCommand = (command) => {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error}`)
        reject(error)
        return
      }
      resolve(stdout)
    })
  })
}

// Function to remove old zip files
const removeOldZips = () => {
  const files = fs.readdirSync(__dirname)
  files.forEach((file) => {
    if (file.startsWith("dist-") && file.endsWith(".zip")) {
      fs.unlinkSync(path.join(__dirname, file))
      console.log(`Removed old zip file: ${file}`)
    }
  })
}

// Function to create zip file
const createZip = (sourcePath, zipName) => {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(zipName)
    const archive = archiver("zip", { zlib: { level: 9 } })

    output.on("close", () => {
      console.log(`${zipName} has been created successfully`)
      resolve()
    })

    archive.on("error", (err) => {
      reject(err)
    })

    archive.pipe(output)
    archive.directory(sourcePath, false)
    archive.finalize()
  })
}

// Function to create/update .env file
const updateEnvFile = (target) => {
  const envContent = `BUILD_TARGET=${target}
PMWEB_API_KEY=${process.env.PMWEB_API_KEY || "your_key_here"}
# Add any other environment variables you need
`
  fs.writeFileSync(".env", envContent)
}

// Function to get formatted timestamp
const getFormattedTimestamp = () => {
  const now = new Date()
  const day = String(now.getDate()).padStart(2, "0")
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const hours = String(now.getHours()).padStart(2, "0")
  const minutes = String(now.getMinutes()).padStart(2, "0")

  return `${day}${month}-${hours}${minutes}`
}

// Main build function — loops over all production targets
async function buildAll() {
  try {
    console.log("Removing old zip files...")
    removeOldZips()

    const timestamp = getFormattedTimestamp()

    for (const target of PRODUCTION_TARGETS) {
      console.log(`Starting ${target} build...`)
      updateEnvFile(target)
      await executeCommand(`npm run build:${target}`)
      const zipName = target === "default" ? "dist-normal" : `dist-${target}`
      await createZip("dist", `${zipName}-${timestamp}.zip`)
    }

    // Restore to default env after all builds
    updateEnvFile("default")

    console.log("Build process completed successfully!")
  } catch (error) {
    console.error("Build process failed:", error)
    // Restore to default env in case of error
    updateEnvFile("default")
  }
}

const buildTimestamp = new Date().toISOString()
fs.writeFileSync(
  "build-info.json",
  JSON.stringify({
    buildDate: buildTimestamp,
    version: packageJson.version
  })
)
// Run the build process
buildAll()
