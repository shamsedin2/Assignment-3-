const fs = require('fs').promises;
const { healthMetricsCounter } = require('./healthReader');

describe('healthMetricsCounter', () => {
  const testFilePath = './test-health-data.json';
  
  // Test data
  const validHealthData = [
    { date: '2024-01-01', steps: 8500, heartRate: 72, sleepHours: 7.5 },
    { date: '2024-01-02', steps: 10200, heartRate: 68, sleepHours: 8 }
  ];
  
  // Clean up test files after each test
  afterEach(async () => {
    try {
      await fs.unlink(testFilePath);
    } catch (error) {
      // File may not exist, ignore error
    }
  });
  
  test('should read valid JSON file and return correct count', async () => {
    // Create test file
    await fs.writeFile(testFilePath, JSON.stringify(validHealthData));
    
    const result = await healthMetricsCounter(testFilePath);
    
    expect(result.count).toBe(2);
    expect(result.data).toHaveLength(2);
    expect(result.data[0].steps).toBe(8500);
  });
  
  test('should return correct data structure', async () => {
    await fs.writeFile(testFilePath, JSON.stringify(validHealthData));
    
    const result = await healthMetricsCounter(testFilePath);
    
    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('data');
    expect(Array.isArray(result.data)).toBe(true);
  });
  
  test('should throw error when file does not exist', async () => {
    await expect(healthMetricsCounter('./nonexistent-file.json'))
      .rejects
      .toThrow('Health data file not found');
  });
  
  test('should throw error for invalid JSON', async () => {
    // Create file with invalid JSON
    await fs.writeFile(testFilePath, 'This is not valid JSON');
    
    await expect(healthMetricsCounter(testFilePath))
      .rejects
      .toThrow('Invalid JSON format');
  });
  
  test('should handle empty array', async () => {
    await fs.writeFile(testFilePath, JSON.stringify([]));
    
    const result = await healthMetricsCounter(testFilePath);
    
    expect(result.count).toBe(0);
    expect(result.data).toHaveLength(0);
  });
});
