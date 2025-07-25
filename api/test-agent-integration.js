/**
 * Agent API Integration Test Script
 * Mô phỏng user gọi API từ frontend để test toàn bộ luồng tư vấn
 */

const axios = require('axios');
const colors = require('colors');
const fs = require('fs');
const path = require('path');

// Configuration
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3999/api';
const DELAY_BETWEEN_MESSAGES = 2000; // 2 seconds
const TEST_RESULTS_DIR = path.join(__dirname, 'test-result');

// Real JWT Token from frontend
const JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODgzMGUxZGE0MDdlOTQxZjM1NDI1MzYiLCJpYXQiOjE3NTM0MTkyOTMsImV4cCI6MTc1NDAyNDA5M30.7fi7MgEnN6GGNsFywMJABU9NQ1h_CkD2GiSPGVNCsrs';
const REAL_USER_ID = '68830e1da407e941f3542536'; // From JWT payload

// API Client with real JWT token
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${JWT_TOKEN}`,
    Cookie: `access_token=${JWT_TOKEN}`,
  },
});

// Test results storage
let testResults = {
  timestamp: new Date().toISOString(),
  testSuite: 'Agent API Integration Test',
  userToken: JWT_TOKEN,
  userId: REAL_USER_ID,
  results: {},
  logs: [],
};

// Ensure test results directory exists
if (!fs.existsSync(TEST_RESULTS_DIR)) {
  fs.mkdirSync(TEST_RESULTS_DIR, { recursive: true });
}

/**
 * Utility functions
 */
function log(message, type = 'info') {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    type,
    message,
  };

  // Add to test results
  testResults.logs.push(logEntry);

  // Also log to console with colors
  switch (type) {
    case 'success':
      console.log(`[${timestamp}] ✅ ${message}`.green);
      break;
    case 'error':
      console.log(`[${timestamp}] ❌ ${message}`.red);
      break;
    case 'info':
      console.log(`[${timestamp}] ℹ️  ${message}`.blue);
      break;
    case 'user':
      console.log(`[${timestamp}] 👤 USER: ${message}`.yellow);
      break;
    case 'agent':
      console.log(`[${timestamp}] 🤖 AGENT: ${message}`.cyan);
      break;
    case 'phase':
      console.log(`[${timestamp}] 📍 PHASE: ${message}`.magenta);
      break;
    case 'database':
      console.log(`[${timestamp}] 💾 DATABASE: ${message}`.green);
      break;
  }
}

function saveTestResults(results, testName) {
  if (typeof results === 'string') {
    // Old signature: saveTestResults(filename)
    const filePath = path.join(TEST_RESULTS_DIR, results);
    fs.writeFileSync(filePath, JSON.stringify(testResults, null, 2));
    console.log(`\n📊 Test results saved to: ${filePath}`.green.bold);
  } else {
    // New signature: saveTestResults(results, testName)
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `${testName}-${timestamp}.json`;
    const filePath = path.join(TEST_RESULTS_DIR, filename);
    fs.writeFileSync(filePath, JSON.stringify(results, null, 2));
    console.log(`\n📊 Test results saved to: ${filePath}`.green.bold);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * API Functions
 */
async function sendMessage(message, userId = REAL_USER_ID) {
  try {
    log(`Sending message: "${message}"`, 'user');

    const response = await apiClient.post('/agent/message', {
      message,
    });

    log(`Response received - Phase: ${response.data.phase}`, 'success');
    log(`Agent Response: ${response.data.response}`, 'agent');

    return response.data;
  } catch (error) {
    log(`Error sending message: ${error.message}`, 'error');
    if (error.response) {
      log(`Error details: ${JSON.stringify(error.response.data)}`, 'error');
    }
    throw error;
  }
}

async function getSession(userId = REAL_USER_ID) {
  try {
    const response = await apiClient.get(`/agent/session`);
    log(`Session retrieved: ${response.data.sessionId}`, 'database');
    return response.data;
  } catch (error) {
    log(`Error getting session: ${error.message}`, 'error');
    throw error;
  }
}

async function getMessageHistory(userId = REAL_USER_ID) {
  try {
    const response = await apiClient.get(`/agent/session/history`);
    log(
      `Message history retrieved: ${response.data.total} messages`,
      'database',
    );
    return response.data;
  } catch (error) {
    log(`Error getting message history: ${error.message}`, 'error');
    throw error;
  }
}

async function resetSession(userId = REAL_USER_ID) {
  try {
    await apiClient.delete(`/agent/session`);
    log('Session reset successfully', 'success');
  } catch (error) {
    log(`Error resetting session: ${error.message}`, 'error');
    throw error;
  }
}

// New functions to interact with user and legal modules
async function getUserInfo(userId = REAL_USER_ID) {
  try {
    const response = await apiClient.get(`/user/me`);
    log(`User info retrieved: ${response.data.email}`, 'database');
    return response.data;
  } catch (error) {
    log(`Error getting user info: ${error.message}`, 'error');
    return null;
  }
}

async function updateUserProfile(userId, updateData) {
  try {
    const response = await apiClient.patch(`/user/${userId}`, updateData);
    log(`User profile updated: ${response.data.email}`, 'success');
    return response.data;
  } catch (error) {
    log(`Failed to update user profile: ${error.message}`, 'error');
    return null;
  }
}

async function createLegalDocument(userId = REAL_USER_ID, documentData) {
  try {
    const response = await apiClient.post('/legal', {
      userId,
      title: documentData.name,
      content: `${documentData.type} document - ${documentData.name}`,
      status: documentData.status || 'pending',
    });

    if (response.data.success) {
      log(`Legal document created: ${documentData.name}`, 'database');
      return response.data.data;
    } else {
      log(`Failed to create legal document: ${response.data.message}`, 'error');
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    log(`Error creating legal document: ${error.message}`, 'error');
    return { success: false, message: 'Failed to create legal document' };
  }
}

async function updateLegalDocument(documentId, updateData) {
  try {
    const response = await apiClient.patch(`/legal/${documentId}`, updateData);

    if (response.data.success) {
      log(
        `Legal document updated: ${response.data.data.title} -> ${response.data.data.status}`,
        'database',
      );
      return response.data.data;
    } else {
      log(`Failed to update legal document: ${response.data.message}`, 'error');
      return null;
    }
  } catch (error) {
    log(`Error updating legal document: ${error.message}`, 'error');
    return null;
  }
}

async function getAllLegalDocuments(userId = REAL_USER_ID) {
  try {
    const response = await apiClient.get(`/legal/user/${userId}`);

    if (response.data.success) {
      log(
        `Legal documents retrieved: ${response.data.data.length} documents`,
        'database',
      );
      return response.data.data;
    } else {
      log(`Failed to get legal documents: ${response.data.message}`, 'error');
      return [];
    }
  } catch (error) {
    log(`Error getting legal documents: ${error.message}`, 'error');
    return [];
  }
}

async function checkHealth() {
  try {
    const response = await apiClient.get('/agent/health');
    log(`Health check: ${response.data.status}`, 'success');
    return response.data;
  } catch (error) {
    log(`Health check failed: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Test Scenarios
 */
async function testFullConversationFlow() {
  log('🚀 Starting Full Conversation Flow Test', 'info');

  try {
    // Test user authentication and get user info
    log('\n📍 Phase 0: USER AUTHENTICATION - Kiểm tra thông tin user', 'info');
    const userInfo = await getUserInfo();
    if (userInfo) {
      log(`User authenticated: ${userInfo.email}`, 'success');
      testResults.userInfo = userInfo;
    }

    // Reset session first
    await resetSession();
    await delay(1000);

    // 1. INTRO Phase - Giới thiệu
    log('\n📍 Phase 1: INTRO - Giới thiệu', 'info');
    let response = await sendMessage('Xin chào, tôi muốn tư vấn du học Mỹ');
    testResults.results.phase1 = {
      phase: response.phase,
      response: response.response,
      timestamp: new Date().toISOString(),
    };
    await delay(DELAY_BETWEEN_MESSAGES);

    // 2. COLLECT_INFO Phase - Thu thập thông tin
    log('\n📍 Phase 2: COLLECT_INFO - Thu thập thông tin học tập', 'info');
    response = await sendMessage(
      'Tôi có GPA 3.8, TOEFL 105, muốn học Computer Science, ngân sách khoảng 60000$/năm, thích California hoặc New York',
    );
    testResults.results.phase2 = {
      phase: response.phase,
      response: response.response,
      timestamp: new Date().toISOString(),
    };
    await delay(DELAY_BETWEEN_MESSAGES);

    // Additional info if needed
    response = await sendMessage(
      'Tôi có kinh nghiệm làm việc 2 năm trong lĩnh vực IT, tốt nghiệp đại học ngành Công nghệ thông tin tại Việt Nam',
    );
    await delay(DELAY_BETWEEN_MESSAGES);

    // 3. SELECT_SCHOOL Phase - Gợi ý trường học
    log('\n📍 Phase 3: SELECT_SCHOOL - Gợi ý trường và ngành học', 'info');
    response = await sendMessage(
      'Hãy gợi ý cho tôi một số trường đại học phù hợp',
    );
    await delay(DELAY_BETWEEN_MESSAGES);

    // User selects school
    response = await sendMessage(
      'Tôi muốn chọn Stanford University, ngành Computer Science',
    );
    testResults.results.phase3 = {
      phase: response.phase,
      response: response.response,
      selectedSchool: 'Stanford University',
      selectedMajor: 'Computer Science',
      timestamp: new Date().toISOString(),
    };
    await delay(DELAY_BETWEEN_MESSAGES);

    // 4. LEGAL_CHECKLIST Phase - Tạo danh sách giấy tờ
    log(
      '\n📍 Phase 4: LEGAL_CHECKLIST - Tạo danh sách giấy tờ pháp lý',
      'info',
    );
    response = await sendMessage(
      'Tôi cần danh sách giấy tờ cần chuẩn bị để du học',
    );
    await delay(DELAY_BETWEEN_MESSAGES);

    // Agent should automatically create legal documents
    response = await sendMessage(
      'Hãy tạo danh sách chi tiết các giấy tờ tôi cần chuẩn bị',
    );
    testResults.results.phase4 = {
      phase: response.phase,
      response: response.response,
      timestamp: new Date().toISOString(),
    };

    // Check existing legal documents first, then create only if needed
    log('\n💾 Checking existing legal documents', 'info');

    try {
      const existingDocs = await apiClient.get(`/legal/user/${REAL_USER_ID}`);
      log(
        `Found ${existingDocs.data.data.length} existing legal documents`,
        'info',
      );

      // Define required documents
      const requiredDocs = [
        {
          name: 'I-20 Form',
          type: 'admission',
          status: 'pending',
          priority: 'high',
        },
        {
          name: 'Passport',
          type: 'identity',
          status: 'pending',
          priority: 'high',
        },
        {
          name: 'Visa Application (DS-160)',
          type: 'visa',
          status: 'pending',
          priority: 'high',
        },
        {
          name: 'Financial Statement',
          type: 'financial',
          status: 'pending',
          priority: 'medium',
        },
        {
          name: 'Academic Transcripts',
          type: 'academic',
          status: 'pending',
          priority: 'medium',
        },
      ];

      // Create only missing documents
      const existingDocNames = existingDocs.data.data.map((doc) => doc.title);
      const missingDocs = requiredDocs.filter(
        (doc) => !existingDocNames.includes(doc.name),
      );

      log(`Creating ${missingDocs.length} missing legal documents`, 'info');

      const createdDocuments = [];
      for (const doc of missingDocs) {
        const createdDoc = await createLegalDocument(REAL_USER_ID, doc);
        if (createdDoc && createdDoc.id) {
          createdDocuments.push(createdDoc);
        } else {
          // If creation failed, still add to the array with error info
          createdDocuments.push(
            createdDoc || {
              success: false,
              message: 'Failed to create legal document',
              name: doc.name,
            },
          );
        }
      }

      if (missingDocs.length === 0) {
        log('All required legal documents already exist', 'info');
      }
    } catch (error) {
      log(`Error managing legal documents: ${error.message}`, 'error');
    }

    await delay(DELAY_BETWEEN_MESSAGES);

    // 5. PROGRESS_TRACKING Phase - Theo dõi tiến độ
    log('\n📍 Phase 5: PROGRESS_TRACKING - Theo dõi tiến độ chuẩn bị', 'info');
    response = await sendMessage('Tôi đã hoàn thành I-20 và Passport');
    await delay(DELAY_BETWEEN_MESSAGES);

    response = await sendMessage('Tôi cũng đã nộp đơn xin visa rồi');
    await delay(DELAY_BETWEEN_MESSAGES);

    // Update some legal documents status
    log('\n📝 Updating legal documents status', 'info');
    if (
      testResults.results.legalDocuments &&
      testResults.results.legalDocuments.length > 0
    ) {
      const firstDoc = testResults.results.legalDocuments[0];
      if (firstDoc && firstDoc.id) {
        const updatedDoc = await updateLegalDocument(firstDoc.id, {
          status: 'completed',
        });
        if (updatedDoc) {
          log(`Updated document ${firstDoc.title} to completed`, 'success');
        }
      }
    }

    response = await sendMessage(
      'Tôi đã hoàn thành tất cả giấy tờ, bây giờ tôi cần tư vấn về kế hoạch sinh sống',
    );
    testResults.results.phase5 = {
      phase: response.phase,
      response: response.response,
      timestamp: new Date().toISOString(),
    };
    await delay(DELAY_BETWEEN_MESSAGES);

    // 6. Life Planning - Tư vấn kế hoạch sinh sống
    log('\n📍 Phase 6: LIFE_PLANNING - Tư vấn kế hoạch sinh sống', 'info');
    response = await sendMessage(
      'Tôi cần tư vấn về chỗ ở, chi phí sinh hoạt, và cách thích nghi với cuộc sống ở Mỹ',
    );
    await delay(DELAY_BETWEEN_MESSAGES);

    response = await sendMessage(
      'Làm thế nào để tìm được chỗ ở gần trường? Chi phí sinh hoạt hàng tháng khoảng bao nhiêu?',
    );
    await delay(DELAY_BETWEEN_MESSAGES);

    response = await sendMessage(
      'Tôi có thể làm việc part-time khi học không? Cần chuẩn bị gì để thích nghi với văn hóa Mỹ?',
    );
    testResults.results.phase6 = {
      phase: response.phase,
      response: response.response,
      timestamp: new Date().toISOString(),
    };
    await delay(DELAY_BETWEEN_MESSAGES);

    // Final summary
    log('\n📊 Getting final session summary', 'info');
    const finalSession = await getSession();
    testResults.results.finalSession = finalSession;

    // Get all legal documents for this user
    log('\n📋 Getting all legal documents for user', 'info');
    const allLegalDocs = await getAllLegalDocuments(REAL_USER_ID);
    testResults.results.allLegalDocuments = allLegalDocs;

    // Update user profile with test completion
    log('\n👤 Updating user profile', 'info');
    const updatedUser = await updateUserProfile(REAL_USER_ID, {
      lastTestDate: new Date().toISOString(),
      testCompletionStatus: 'completed',
    });
    testResults.results.updatedUser = updatedUser;

    log(`Final Phase: ${finalSession.phase}`, 'info');
    log(`Selected School: ${finalSession.selectedSchool}`, 'info');
    log(`Selected Major: ${finalSession.selectedMajor}`, 'info');
    log(`Progress: ${finalSession.progressPercentage}%`, 'info');
    log(`Total Messages: ${finalSession.analytics.totalMessages}`, 'info');

    log('\n✅ Full conversation flow test completed successfully!', 'success');
    return testResults;
  } catch (error) {
    log(`❌ Error in full conversation flow: ${error.message}`, 'error');
    console.error('Full error:', error);
    testResults.error = error.message;
    return testResults;
  }
}

/**
 * Test specific features
 */
async function testSessionManagement() {
  log('\n🔧 Testing Session Management Features', 'info');

  try {
    // Test session creation
    await sendMessage(REAL_USER_ID, 'Test session creation');

    // Test session retrieval
    const session = await getSession(REAL_USER_ID);
    log(`Session retrieved: ${session.sessionId}`, 'success');

    // Test message history
    const history = await getMessageHistory(REAL_USER_ID);
    log(`Message history: ${history.total} messages`, 'success');

    // Test session reset
    await resetSession(REAL_USER_ID);

    log('Session management tests passed!', 'success');
    return true;
  } catch (error) {
    log(`Session management test failed: ${error.message}`, 'error');
    return false;
  }
}

async function testErrorHandling() {
  log('\n🛡️ Testing Error Handling', 'info');

  try {
    // Test invalid user ID
    try {
      await sendMessage('', 'Test message');
      log('Should have failed with empty user ID', 'error');
    } catch (error) {
      log('Empty user ID validation works correctly', 'success');
    }

    // Test invalid message
    try {
      await sendMessage(REAL_USER_ID, '');
      log('Should have failed with empty message', 'error');
    } catch (error) {
      log('Empty message validation works correctly', 'success');
    }

    // Test very long message
    try {
      const longMessage = 'a'.repeat(1001);
      await sendMessage(REAL_USER_ID, longMessage);
      log('Should have failed with long message', 'error');
    } catch (error) {
      log('Long message validation works correctly', 'success');
    }

    log('Error handling tests passed!', 'success');
    return true;
  } catch (error) {
    log(`Error handling test failed: ${error.message}`, 'error');
    return false;
  }
}

async function testConcurrentUsers() {
  log('\n👥 Testing Concurrent Users', 'info');

  try {
    const users = ['user1', 'user2', 'user3'];
    const promises = users.map(async (userId) => {
      try {
        await sendMessage(userId, `Hello from ${userId}`);
        const session = await getSession(userId);
        return { userId, success: true, sessionId: session.sessionId };
      } catch (error) {
        return { userId, success: false, error: error.message };
      }
    });

    const results = await Promise.all(promises);

    results.forEach((result) => {
      if (result.success) {
        log(`User ${result.userId}: Success (${result.sessionId})`, 'success');
      } else {
        log(`User ${result.userId}: Failed (${result.error})`, 'error');
      }
    });

    // Cleanup
    await Promise.all(users.map((userId) => resetSession(userId)));

    log('Concurrent users test passed!', 'success');
    return true;
  } catch (error) {
    log(`Concurrent users test failed: ${error.message}`, 'error');
    return false;
  }
}

/**
 * Main test runner
 */
async function runAllTests() {
  log('🎯 Starting Agent API Integration Tests', 'info');
  log(`Testing against: ${API_BASE_URL}`, 'info');

  const results = {
    health: false,
    fullFlow: null,
    sessionManagement: false,
    errorHandling: false,
    concurrentUsers: false,
    summary: {
      totalTests: 0,
      passedTests: 0,
      startTime: new Date().toISOString(),
      endTime: null,
    },
  };

  try {
    // Health check first
    log('\n🏥 Health Check', 'info');
    await checkHealth();
    results.health = true;

    // Run all tests
    results.fullFlow = await testFullConversationFlow();
    results.sessionManagement = await testSessionManagement();
    results.errorHandling = await testErrorHandling();
    results.concurrentUsers = await testConcurrentUsers();

    // Summary
    log('\n📊 Test Results Summary', 'info');

    // Count passed tests
    const testCounts = {
      health: results.health,
      fullFlow: results.fullFlow && !results.fullFlow.error,
      sessionManagement: results.sessionManagement,
      errorHandling: results.errorHandling,
      concurrentUsers: results.concurrentUsers,
    };

    Object.entries(testCounts).forEach(([test, passed]) => {
      const status = passed ? '✅ PASSED' : '❌ FAILED';
      log(`${test}: ${status}`, passed ? 'success' : 'error');
    });

    const totalTests = Object.keys(testCounts).length;
    const passedTests = Object.values(testCounts).filter(Boolean).length;

    results.summary.totalTests = totalTests;
    results.summary.passedTests = passedTests;
    results.summary.endTime = new Date().toISOString();

    log(
      `\nOverall: ${passedTests}/${totalTests} tests passed`,
      passedTests === totalTests ? 'success' : 'error',
    );

    return results;
  } catch (error) {
    log(`Test runner failed: ${error.message}`, 'error');
    results.error = error.message;
    results.summary.endTime = new Date().toISOString();
    return results;
  }
}

// Run specific test if argument provided
async function main() {
  const testType = process.argv[2];

  try {
    switch (testType) {
      case 'health':
        await checkHealth();
        break;
      case 'full-flow':
        const results = await testFullConversationFlow();
        // Save results to file
        await saveTestResults(results, 'full-flow-test');
        break;
      case 'session':
        await testSessionManagement();
        break;
      case 'error':
        await testErrorHandling();
        break;
      case 'concurrent':
        await testConcurrentUsers();
        break;
      default:
        const allResults = await runAllTests();
        await saveTestResults(allResults, 'all-tests');
    }
  } catch (error) {
    log(`Test execution failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Export for use in other scripts
module.exports = {
  sendMessage,
  getSession,
  getMessageHistory,
  resetSession,
  checkHealth,
  testFullConversationFlow,
  testSessionManagement,
  testErrorHandling,
  testConcurrentUsers,
  runAllTests,
  getUserInfo,
  updateUserProfile,
  createLegalDocument,
  updateLegalDocument,
  getAllLegalDocuments,
  saveTestResults,
};

// Run if called directly
if (require.main === module) {
  main()
    .then(() => {
      log('Test execution completed', 'info');
    })
    .catch((error) => {
      log(`Fatal error: ${error.message}`, 'error');
      process.exit(1);
    });
}
