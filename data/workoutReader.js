const fs = require('fs');
const csv = require('csv-parser');

/**
 * Reads CSV workout data asynchronously and calculates total workouts and minutes
 * @param {string} filepath - Path to the CSV file
 * @returns {Promise<Object>} Object containing workout count and total minutes
 */
function workoutCalculator(filepath) {
  return new Promise((resolve, reject) => {
    const workouts = [];
    let totalMinutes = 0;
    
    // Check if file exists
    if (!fs.existsSync(filepath)) {
      reject(new Error(`Workout data file not found: ${filepath}`));
      return;
    }
    
    fs.createReadStream(filepath)
      .pipe(csv())
      .on('data', (row) => {
        try {
          workouts.push(row);
          // Parse duration and add to total
          const duration = parseInt(row.duration);
          if (!isNaN(duration)) {
            totalMinutes += duration;
          }
        } catch (error) {
          reject(new Error(`Error parsing CSV data: ${error.message}`));
        }
      })
      .on('end', () => {
        resolve({
          count: workouts.length,
          totalMinutes,
          data: workouts
        });
      })
      .on('error', (error) => {
        if (error.code === 'ENOENT') {
          reject(new Error(`Workout data file not found: ${filepath}`));
        } else {
          reject(new Error(`Error reading CSV file: ${error.message}`));
        }
      });
  });
}

module.exports = { workoutCalculator };
