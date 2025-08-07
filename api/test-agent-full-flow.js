const axios = require('axios');
const colors = require('colors');

// Configuration
const BASE_URL = 'http://localhost:3999/api';
const JWT_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODg3MmI0MDcyZjU1ZDhhNmYwZDVkMWUiLCJpYXQiOjE3NTQ0NTc4MzAsImV4cCI6MTc1NTA2MjYzMH0.H37rJw9VjtVhVHDRHfRS37TsJFHCrFTwIE1PRh2lhnw';
const DELAY_BETWEEN_MESSAGES = 3000; // 3 seconds between messages

// API Client setup
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${JWT_TOKEN}`,
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Test results storage
const testResults = {
  startTime: new Date(),
  endTime: null,
  phases: {},
  logs: [],
  success: false,
  totalMessages: 0,
  errors: [],
};

// Student profile for testing
const STUDENT_PROFILE = {
  name: 'Nguyễn Minh Anh',
  age: '22',
  education: 'mới tốt nghiệp đại học',
  major: 'Kỹ thuật Phần mềm',
  gpa: '3.5',
  targetCountry: 'Hoa Kỳ',
  targetMajor: 'Computer Science',
  budget: '50000 USD',
  ielts: '7.0',
  dreamSchool: 'Stanford University',
  timeline: 'Fall 2025',
};

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

  testResults.logs.push(logEntry);

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
    default:
      console.log(`[${timestamp}] ${message}`);
  }
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * API Functions
 */
async function sendMessage(message) {
  try {
    log(`Sending message: "${message}"`, 'user');
    testResults.totalMessages++;

    const response = await apiClient.post('/agent/message', {
      message,
    });

    const data = response.data;
    log(`Response received - Timestamp: ${data.timestamp}`, 'success');
    log(`Agent Response: ${data.response}`, 'agent');

    return data;
  } catch (error) {
    log(`Error sending message: ${error.message}`, 'error');
    testResults.errors.push({
      message,
      error: error.message,
      timestamp: new Date(),
    });
    if (error.response) {
      log(`Error details: ${JSON.stringify(error.response.data)}`, 'error');
    }
    throw error;
  }
}

async function getSession() {
  try {
    const response = await apiClient.get('/agent/session/history');
    log(`Session retrieved: ${response.data.total} messages`, 'database');
    return response.data;
  } catch (error) {
    log(`Error getting session: ${error.message}`, 'error');
    throw error;
  }
}

async function resetSession() {
  try {
    await apiClient.delete('/agent/session');
    log('Session reset successfully', 'success');
  } catch (error) {
    log(`Error resetting session: ${error.message}`, 'info');
    // It's okay if reset fails, maybe there's no session to reset
  }
}

async function healthCheck() {
  try {
    const response = await apiClient.get('/agent/health');
    log(`Health check passed: ${response.data.status}`, 'success');
    return response.data;
  } catch (error) {
    log(`Health check failed: ${error.message}`, 'error');
    throw error;
  }
}

/**
 * Test Phases
 */

// Phase 1: COLLECT_INFO - Thu thập thông tin cơ bản
async function testPhaseCollectInfo() {
  log('\n🚀 PHASE 1: COLLECT_INFO - Thu thập thông tin cơ bản', 'phase');

  const phaseResults = {
    phase: 'collect_info',
    messages: [],
    startTime: new Date(),
  };

  // Tin nhắn giới thiệu đầu tiên
  let response = await sendMessage('Xin chào! Tôi muốn tư vấn về du học');
  phaseResults.messages.push({
    user: 'Xin chào! Tôi muốn tư vấn về du học',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Cung cấp thông tin cá nhân từng bước
  response = await sendMessage(
    `Tên tôi là ${STUDENT_PROFILE.name}, ${STUDENT_PROFILE.age} tuổi`,
  );
  phaseResults.messages.push({
    user: `Tên tôi là ${STUDENT_PROFILE.name}, ${STUDENT_PROFILE.age} tuổi`,
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  response = await sendMessage(
    `Tôi ${STUDENT_PROFILE.education}, chuyên ngành ${STUDENT_PROFILE.major}, GPA ${STUDENT_PROFILE.gpa}`,
  );
  phaseResults.messages.push({
    user: `Tôi ${STUDENT_PROFILE.education}, chuyên ngành ${STUDENT_PROFILE.major}, GPA ${STUDENT_PROFILE.gpa}`,
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  response = await sendMessage(
    `Tôi muốn đi du học ${STUDENT_PROFILE.targetCountry}, ngân sách khoảng ${STUDENT_PROFILE.budget}`,
  );
  phaseResults.messages.push({
    user: `Tôi muốn đi du học ${STUDENT_PROFILE.targetCountry}, ngân sách khoảng ${STUDENT_PROFILE.budget}`,
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  response = await sendMessage(
    `Tôi có IELTS ${STUDENT_PROFILE.ielts}, muốn học ${STUDENT_PROFILE.targetMajor}`,
  );
  phaseResults.messages.push({
    user: `Tôi có IELTS ${STUDENT_PROFILE.ielts}, muốn học ${STUDENT_PROFILE.targetMajor}`,
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  phaseResults.endTime = new Date();
  testResults.phases.collect_info = phaseResults;

  log('✅ Phase COLLECT_INFO completed', 'success');
  return phaseResults;
}

// Phase 2: SELECT_SCHOOL - Gợi ý trường học
async function testPhaseSelectSchool() {
  log('\n🎓 PHASE 2: SELECT_SCHOOL - Gợi ý trường học', 'phase');

  const phaseResults = {
    phase: 'select_school',
    messages: [],
    startTime: new Date(),
  };

  // Yêu cầu gợi ý trường học
  let response = await sendMessage(
    'Bạn có thể gợi ý cho tôi một số trường đại học phù hợp không?',
  );
  phaseResults.messages.push({
    user: 'Bạn có thể gợi ý cho tôi một số trường đại học phù hợp không?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Hỏi thêm về các trường cụ thể
  response = await sendMessage(
    'Tôi quan tâm đến Stanford University. Bạn có thể cho tôi biết thêm thông tin không?',
  );
  phaseResults.messages.push({
    user: 'Tôi quan tâm đến Stanford University. Bạn có thể cho tôi biết thêm thông tin không?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // So sánh các trường
  response = await sendMessage(
    'MIT và Stanford khác nhau như thế nào? Trường nào phù hợp với tôi hơn?',
  );
  phaseResults.messages.push({
    user: 'MIT và Stanford khác nhau như thế nào? Trường nào phù hợp với tôi hơn?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Quyết định chọn trường
  response = await sendMessage(
    `Tôi quyết định chọn ${STUDENT_PROFILE.dreamSchool} để apply. Bây giờ tôi cần làm gì?`,
  );
  phaseResults.messages.push({
    user: `Tôi quyết định chọn ${STUDENT_PROFILE.dreamSchool} để apply. Bây giờ tôi cần làm gì?`,
    agent: response.response,
    timestamp: response.timestamp,
    selectedSchool: STUDENT_PROFILE.dreamSchool,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  phaseResults.endTime = new Date();
  testResults.phases.select_school = phaseResults;

  log('✅ Phase SELECT_SCHOOL completed', 'success');
  return phaseResults;
}

// Phase 3: LEGAL_CHECKLIST - Quản lý giấy tờ pháp lý
async function testPhaseLegalChecklist() {
  log('\n📋 PHASE 3: LEGAL_CHECKLIST - Quản lý giấy tờ pháp lý', 'phase');

  const phaseResults = {
    phase: 'legal_checklist',
    messages: [],
    startTime: new Date(),
  };

  // Hỏi về giấy tờ cần chuẩn bị
  let response = await sendMessage(
    'Tôi cần chuẩn bị những giấy tờ gì để du học Mỹ?',
  );
  phaseResults.messages.push({
    user: 'Tôi cần chuẩn bị những giấy tờ gì để du học Mỹ?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Yêu cầu tạo danh sách chi tiết
  response = await sendMessage(
    'Hãy tạo cho tôi danh sách chi tiết các giấy tờ cần chuẩn bị cho Stanford University',
  );
  phaseResults.messages.push({
    user: 'Hãy tạo cho tôi danh sách chi tiết các giấy tờ cần chuẩn bị cho Stanford University',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Hỏi về quy trình visa
  response = await sendMessage(
    'Quy trình xin visa F-1 như thế nào? Tôi cần làm gì trước tiên?',
  );
  phaseResults.messages.push({
    user: 'Quy trình xin visa F-1 như thế nào? Tôi cần làm gì trước tiên?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Báo cáo tiến độ chuẩn bị
  response = await sendMessage(
    'Tôi đã có hộ chiếu và bằng tốt nghiệp đại học. Còn thiếu gì nữa?',
  );
  phaseResults.messages.push({
    user: 'Tôi đã có hộ chiếu và bằng tốt nghiệp đại học. Còn thiếu gì nữa?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  phaseResults.endTime = new Date();
  testResults.phases.legal_checklist = phaseResults;

  log('✅ Phase LEGAL_CHECKLIST completed', 'success');
  return phaseResults;
}

// Phase 4: LIFE_PLANNING - Tư vấn sinh sống
async function testPhaseLifePlanning() {
  log('\n🏠 PHASE 4: LIFE_PLANNING - Tư vấn sinh sống', 'phase');

  const phaseResults = {
    phase: 'life_planning',
    messages: [],
    startTime: new Date(),
  };

  // Hỏi về chi phí sinh hoạt
  let response = await sendMessage(
    'Chi phí sinh hoạt ở Stanford khoảng bao nhiêu một tháng?',
  );
  phaseResults.messages.push({
    user: 'Chi phí sinh hoạt ở Stanford khoảng bao nhiêu một tháng?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Hỏi về chỗ ở
  response = await sendMessage(
    'Tôi nên ở ký túc xá hay thuê nhà riêng? Ưu nhược điểm như thế nào?',
  );
  phaseResults.messages.push({
    user: 'Tôi nên ở ký túc xá hay thuê nhà riêng? Ưu nhược điểm như thế nào?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Hỏi về làm thêm
  response = await sendMessage(
    'Sinh viên F-1 có được phép làm thêm không? Tôi có thể kiếm tiền để trang trải chi phí không?',
  );
  phaseResults.messages.push({
    user: 'Sinh viên F-1 có được phép làm thêm không? Tôi có thể kiếm tiền để trang trải chi phí không?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Hỏi về kỹ năng sống
  response = await sendMessage(
    'Tôi cần chuẩn bị những kỹ năng gì để sống độc lập ở Mỹ?',
  );
  phaseResults.messages.push({
    user: 'Tôi cần chuẩn bị những kỹ năng gì để sống độc lập ở Mỹ?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  phaseResults.endTime = new Date();
  testResults.phases.life_planning = phaseResults;

  log('✅ Phase LIFE_PLANNING completed', 'success');
  return phaseResults;
}

// Phase 5: PROGRESS_TRACKING - Theo dõi tiến độ
async function testPhaseProgressTracking() {
  log('\n📊 PHASE 5: PROGRESS_TRACKING - Theo dõi tiến độ', 'phase');

  const phaseResults = {
    phase: 'progress_tracking',
    messages: [],
    startTime: new Date(),
  };

  // Quay lại hỏi về giấy tờ để trigger chuyển phase
  let response = await sendMessage(
    'Tôi đã hoàn thành đơn xin visa F-1 và đã nộp. Bây giờ tôi cần làm gì tiếp theo?',
  );
  phaseResults.messages.push({
    user: 'Tôi đã hoàn thành đơn xin visa F-1 và đã nộp. Bây giờ tôi cần làm gì tiếp theo?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Báo cáo tiến độ chuẩn bị
  response = await sendMessage(
    'Tôi đã làm xong các giấy tờ: hộ chiếu, bằng tốt nghiệp, DS-160, đã đóng phí SEVIS. Còn gì nữa không?',
  );
  phaseResults.messages.push({
    user: 'Tôi đã làm xong các giấy tờ: hộ chiếu, bằng tốt nghiệp, DS-160, đã đóng phí SEVIS. Còn gì nữa không?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  // Hỏi về timeline
  response = await sendMessage(
    'Timeline chuẩn bị cho kỳ Fall 2025 như thế nào? Tôi có đang đúng tiến độ không?',
  );
  phaseResults.messages.push({
    user: 'Timeline chuẩn bị cho kỳ Fall 2025 như thế nào? Tôi có đang đúng tiến độ không?',
    agent: response.response,
    timestamp: response.timestamp,
  });
  await delay(DELAY_BETWEEN_MESSAGES);

  phaseResults.endTime = new Date();
  testResults.phases.progress_tracking = phaseResults;

  log('✅ Phase PROGRESS_TRACKING completed', 'success');
  return phaseResults;
}

// Test phase transitions
async function testPhaseTransitions() {
  log('\n🔄 TESTING PHASE TRANSITIONS', 'phase');

  // Test chuyển từ life_planning về legal_checklist
  let response = await sendMessage(
    'Tôi cần xem lại danh sách giấy tờ visa một lần nữa',
  );
  await delay(DELAY_BETWEEN_MESSAGES);

  // Test chuyển từ legal về life_planning
  response = await sendMessage('Chi phí ăn uống ở Stanford như thế nào?');
  await delay(DELAY_BETWEEN_MESSAGES);

  // Test chuyển về select_school
  response = await sendMessage(
    'Tôi đang phân vân giữa Stanford và MIT. Bạn có thể tư vấn lại không?',
  );
  await delay(DELAY_BETWEEN_MESSAGES);

  log('✅ Phase transitions tested', 'success');
}

/**
 * Main test function
 */
async function runFullFlowTest() {
  try {
    log('🚀 Starting Full Flow Test for Agent /api/agent/message', 'info');
    log(
      `📋 Student Profile: ${STUDENT_PROFILE.name}, ${STUDENT_PROFILE.age} tuổi, ${STUDENT_PROFILE.education}`,
      'info',
    );
    log(
      `🎯 Target: ${STUDENT_PROFILE.targetMajor} tại ${STUDENT_PROFILE.dreamSchool}, ${STUDENT_PROFILE.targetCountry}`,
      'info',
    );
    log(`💰 Budget: ${STUDENT_PROFILE.budget}`, 'info');

    // Health check
    await healthCheck();

    // Reset session để bắt đầu clean
    await resetSession();
    await delay(1000);

    // Run all phases in sequence
    await testPhaseCollectInfo();
    await testPhaseSelectSchool();
    await testPhaseLegalChecklist();
    await testPhaseLifePlanning();
    await testPhaseProgressTracking();

    // Test phase transitions
    await testPhaseTransitions();

    // Final session check
    const finalSession = await getSession();
    log(
      `📊 Final session has ${finalSession.total} total messages`,
      'database',
    );

    testResults.success = true;
    testResults.endTime = new Date();

    log('\n🎉 FULL FLOW TEST COMPLETED SUCCESSFULLY!', 'success');
  } catch (error) {
    log(`❌ Test failed: ${error.message}`, 'error');
    testResults.success = false;
    testResults.endTime = new Date();
    testResults.errors.push({
      phase: 'main',
      error: error.message,
      timestamp: new Date(),
    });
  }
}

/**
 * Generate test report
 */
function generateTestReport() {
  const duration = testResults.endTime - testResults.startTime;
  const report = {
    ...testResults,
    duration: Math.round(duration / 1000), // seconds
    student_profile: STUDENT_PROFILE,
  };

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const filename = `test-result/agent-full-flow-test-${timestamp}.json`;

  require('fs').writeFileSync(filename, JSON.stringify(report, null, 2));

  console.log('\n📄 TEST REPORT:'.blue);
  console.log(`Duration: ${report.duration} seconds`.green);
  console.log(`Total Messages: ${report.totalMessages}`.green);
  console.log(`Success: ${report.success ? '✅' : '❌'}`.green);
  console.log(`Errors: ${report.errors.length}`.yellow);
  console.log(`Report saved to: ${filename}`.blue);

  if (report.phases) {
    console.log('\n📊 PHASE SUMMARY:'.blue);
    Object.keys(report.phases).forEach((phase) => {
      const phaseData = report.phases[phase];
      const phaseDuration = phaseData.endTime - phaseData.startTime;
      console.log(
        `  ${phase}: ${phaseData.messages.length} messages, ${Math.round(phaseDuration / 1000)}s`
          .cyan,
      );
    });
  }

  return report;
}

/**
 * Run the test
 */
if (require.main === module) {
  runFullFlowTest()
    .then(() => {
      generateTestReport();
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      generateTestReport();
      process.exit(1);
    });
}

module.exports = {
  runFullFlowTest,
  testResults,
  STUDENT_PROFILE,
};
