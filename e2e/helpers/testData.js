/**
 * Test data helpers for end-to-end tests
 */

/**
 * Generate a random user profile for testing
 * @returns {Object} - A user profile object
 */
function generateUserProfile() {
  const randomId = Math.floor(Math.random() * 10000);
  
  return {
    name: `Test User ${randomId}`,
    email: `testuser${randomId}@example.com`,
    birthDate: new Date(1990, 0, 1), // January 1, 1990
    lifeExpectancy: 85
  };
}

/**
 * Generate a random goal for testing
 * @param {string} [focusArea='Health'] - The focus area for the goal
 * @returns {Object} - A goal object
 */
function generateGoal(focusArea = 'Health') {
  const randomId = Math.floor(Math.random() * 10000);
  const today = new Date();
  const futureDate = new Date();
  futureDate.setDate(today.getDate() + 30); // 30 days in the future
  
  return {
    id: `goal-${randomId}`,
    title: `Test Goal ${randomId}`,
    description: `This is a test goal created for e2e testing with ID ${randomId}`,
    focusArea,
    startDate: today,
    targetDate: futureDate,
    isCompleted: false
  };
}

/**
 * Generate a random memory for testing
 * @returns {Object} - A memory object
 */
function generateMemory() {
  const randomId = Math.floor(Math.random() * 10000);
  const today = new Date();
  
  return {
    id: `memory-${randomId}`,
    title: `Test Memory ${randomId}`,
    description: `This is a test memory created for e2e testing with ID ${randomId}`,
    date: today,
    tags: ['test', 'e2e', `tag-${randomId}`]
  };
}

/**
 * Generate a list of focus areas for testing
 * @returns {Array} - An array of focus area objects
 */
function generateFocusAreas() {
  return [
    {
      id: 'health',
      name: 'Health',
      color: '#4CAF50',
      icon: 'heart'
    },
    {
      id: 'career',
      name: 'Career',
      color: '#2196F3',
      icon: 'briefcase'
    },
    {
      id: 'relationships',
      name: 'Relationships',
      color: '#E91E63',
      icon: 'people'
    },
    {
      id: 'personal-growth',
      name: 'Personal Growth',
      color: '#9C27B0',
      icon: 'school'
    }
  ];
}

module.exports = {
  generateUserProfile,
  generateGoal,
  generateMemory,
  generateFocusAreas
}; 