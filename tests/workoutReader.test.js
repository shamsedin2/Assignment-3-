const fs = require('fs');
const { workoutCalculator } = require('./workoutReader');

describe('workoutCalculator', () => {
  const testFilePath = './test-workouts.csv';
  
  // Clean up test files after each test
  afterEach(() => {
    try {
      if (fs.existsSync(testFilePath)) {
        fs.unlinkSync(testFilePath);
      }
    } catch (error) {
      // Ignore cleanup errors
    }
  });
  
  test('should read valid CSV file and return correct count and total minutes', async () => {
    const csvContent = `date,type,duration,calories
2024-01-01,Running,30,320
2024-01-02,Cycling,45,380
2024-01-03,Swimming,35,290`;
    
    fs.writeFileSync(testFilePath, csvContent);
    
    const result = await workoutCalculator(testFilePath);
    
    expect(result.count).toBe(3);
    expect(result.totalMinutes).toBe(110); // 30 + 45 + 35
    expect(result.data).toHaveLength(3);
  });
  
  test('should return correct data structure', async () => {
    const csvContent = `date,type,duration,calories
2024-01-01,Running,30,320`;
    
    fs.writeFileSync(testFilePath, csvContent);
    
    const result = await workoutCalculator(testFilePath);
    
    expect(result).toHaveProperty('count');
    expect(result).toHaveProperty('totalMinutes');
    expect(result).toHaveProperty('data');
    expect(Array.isArray(result.data)).toBe(true);
  });
  
  test('should throw error when file does not exist', async () => {
    await expect(workoutCalculator('./nonexistent-file.csv'))
      .rejects
      .toThrow('Workout data file not found');
  });
  
  test('should calculate total minutes correctly with multiple workouts', async () => {
    const csvContent = `date,type,duration,calories
2024-01-01,Running,25,270
2024-01-02,Yoga,40,150
2024-01-03,Cycling,50,420
2024-01-04,Swimming,40,330`;
    
    fs.writeFileSync(testFilePath, csvContent);
    
    const result = await workoutCalculator(testFilePath);
    
    expect(result.count).toBe(4);
    expect(result.totalMinutes).toBe(155); // 25 + 40 + 50 + 40
  });
  
  test('should handle empty CSV file (only headers)', async () => {
    const csvContent = `date,type,duration,calories`;
    
    fs.writeFileSync(testFilePath, csvContent);
    
    const result = await workoutCalculator(testFilePath);
    
    expect(result.count).toBe(0);
    expect(result.totalMinutes).toBe(0);
  });
  
  test('should handle CSV with single workout', async () => {
    const csvContent = `date,type,duration,calories
2024-01-01,Running,30,320`;
    
    fs.writeFileSync(testFilePath, csvContent);
    
    const result = await workoutCalculator(testFilePath);
    
    expect(result.count).toBe(1);
    expect(result.totalMinutes).toBe(30);
    expect(result.data[0].type).toBe('Running');
  });
});
```

## 6. .env
```
USER_NAME=Alex
WEEKLY_GOAL=150// Test your workoutReader.js module here
