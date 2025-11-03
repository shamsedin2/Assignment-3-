const fs = require('fs').promises;

/**
 * Reads JSON health data asynchronously
 * @param {string} filepath - Path to the JSON file
 * @returns {Promise<Object>} Object containing count and health data
 */
async function healthMetricsCounter(filepath) {
  try {
    // Read the file asynchronously
    const data = await fs.readFile(filepath, 'utf8');
    
    // Parse the JSON data
    const healthData = JSON.parse(data);
    
    // Count the number of health entries
    const count = healthData.length;
    
    // Return the count and data
    return {
      count,
      data: healthData
    };
  } catch (error) {
    // Handle file not found error
    if (error.code === 'ENOENT') {
      throw new Error(`Health data file not found: ${filepath}`);
    }
    
    // Handle JSON parsing error
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON format in file: ${filepath}`);
    }
    
    // Re-throw other errors
    throw error;
  }
}

module.exports = { healthMetricsCounter };
