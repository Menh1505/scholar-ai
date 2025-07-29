import { Injectable, Logger } from '@nestjs/common';
import { AgentSessionDocument, UserInfo } from '../schema/agent.schema';

@Injectable()
export class AgentExtractionService {
  private readonly logger = new Logger(AgentExtractionService.name);

  /**
   * Extract and update all user information from message
   */
  extractAndUpdateUserInfo(
    message: string,
    session: AgentSessionDocument,
  ): void {
    this.extractPersonalInfo(message, session);
    this.extractPassportInfo(message, session);
    this.extractEducationInfo(message, session);
    this.extractAcademicAspirations(message, session);
    this.extractFinancialInfo(message, session);
    this.extractLanguageAndCertificates(message, session);
    this.extractPlanAndTimeline(message, session);

    // Legacy method for backward compatibility
    this.extractSchoolAndMajor(message, session);
  }

  /**
   * Extract personal information
   */
  private extractPersonalInfo(
    message: string,
    session: AgentSessionDocument,
  ): void {
    const userInfo = session.userInfo;

    // Extract email
    const emailPattern = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/gi;
    const emailMatch = message.match(emailPattern);
    if (emailMatch && !userInfo.email) {
      userInfo.email = emailMatch[0];
      this.logger.log(`Extracted email: ${userInfo.email}`);
    }

    // Extract phone number (Vietnam format)
    const phonePattern = /((\+84|84|0)[1-9]\d{8,9})/gi;
    const phoneMatch = message.match(phonePattern);
    if (phoneMatch && !userInfo.phoneNumber) {
      userInfo.phoneNumber = phoneMatch[0];
      this.logger.log(`Extracted phone: ${userInfo.phoneNumber}`);
    }

    // Extract gender
    if (!userInfo.gender) {
      if (/\b(nam|male|boy)\b/gi.test(message)) {
        userInfo.gender = 'Nam';
        this.logger.log(`Extracted gender: Nam`);
      } else if (/\b(nữ|female|girl|woman)\b/gi.test(message)) {
        userInfo.gender = 'Nữ';
        this.logger.log(`Extracted gender: Nữ`);
      }
    }

    // Extract birth year/age to estimate dateOfBirth
    if (!userInfo.dateOfBirth) {
      const agePattern = /(\d{1,2})\s*(tuổi|years?\s*old|age)/gi;
      const birthYearPattern = /(19|20)\d{2}/gi;

      const ageMatch = message.match(agePattern);
      const birthYearMatch = message.match(birthYearPattern);

      if (ageMatch) {
        const ageNumMatch = ageMatch[0].match(/\d+/);
        if (ageNumMatch) {
          const age = parseInt(ageNumMatch[0]);
          const birthYear = new Date().getFullYear() - age;
          userInfo.dateOfBirth = `${birthYear}-01-01`;
          this.logger.log(`Extracted birth year from age: ${birthYear}`);
        }
      } else if (birthYearMatch) {
        userInfo.dateOfBirth = `${birthYearMatch[0]}-01-01`;
        this.logger.log(`Extracted birth year: ${birthYearMatch[0]}`);
      }
    }
  }

  /**
   * Extract passport information
   */
  private extractPassportInfo(
    message: string,
    session: AgentSessionDocument,
  ): void {
    const userInfo = session.userInfo;

    // Extract passport number (basic pattern)
    const passportPattern = /passport[:\s]*([A-Z0-9]{6,10})/gi;
    const passportMatch = message.match(passportPattern);
    if (passportMatch && !userInfo.passportNumber) {
      userInfo.passportNumber = passportMatch[0].split(/[:\s]+/)[1];
      this.logger.log(`Extracted passport: ${userInfo.passportNumber}`);
    }

    // Extract current country
    if (!userInfo.currentCountry) {
      const countryMappings = {
        'Việt Nam': /việt\s*nam|vietnam|vn\b/gi,
        'Hoa Kỳ': /hoa\s*kỳ|mỹ\b|usa|america|united\s*states/gi,
        Canada: /canada/gi,
        Úc: /úc|australia/gi,
        Anh: /anh\b|uk|united\s*kingdom|england/gi,
        Đức: /đức|germany/gi,
        Pháp: /pháp|france/gi,
      };

      for (const [country, pattern] of Object.entries(countryMappings)) {
        if (pattern.test(message)) {
          userInfo.currentCountry = country;
          this.logger.log(`Extracted current country: ${country}`);
          break;
        }
      }
    }
  }

  /**
   * Extract education information
   */
  private extractEducationInfo(
    message: string,
    session: AgentSessionDocument,
  ): void {
    const userInfo = session.userInfo;

    // Extract current education level
    if (!userInfo.currentEducationLevel) {
      if (/\b(thpt|high\s*school|lớp\s*12)\b/gi.test(message)) {
        userInfo.currentEducationLevel = 'THPT';
      } else if (/\b(cao\s*đẳng|college)\b/gi.test(message)) {
        userInfo.currentEducationLevel = 'Cao đẳng';
      } else if (/\b(đại\s*học|university|bachelor)\b/gi.test(message)) {
        userInfo.currentEducationLevel = 'Đại học';
      }

      if (userInfo.currentEducationLevel) {
        this.logger.log(
          `Extracted education level: ${userInfo.currentEducationLevel}`,
        );
      }
    }

    // Extract GPA/academic result
    if (!userInfo.academicResult) {
      const gpaPattern = /gpa[:\s]*(\d+\.?\d*)[\/\s]*(\d+)?/gi;
      const scorePattern = /điểm[:\s]*(\d+\.?\d*)[\/\s]*(\d+)/gi;

      const gpaMatch = message.match(gpaPattern);
      const scoreMatch = message.match(scorePattern);

      if (gpaMatch) {
        userInfo.academicResult = gpaMatch[0];
        this.logger.log(`Extracted GPA: ${userInfo.academicResult}`);
      } else if (scoreMatch) {
        userInfo.academicResult = scoreMatch[0];
        this.logger.log(`Extracted score: ${userInfo.academicResult}`);
      }
    }
  }

  /**
   * Extract academic aspirations
   */
  private extractAcademicAspirations(
    message: string,
    session: AgentSessionDocument,
  ): void {
    const userInfo = session.userInfo;

    // Extract desired education level
    if (!userInfo.desiredEducationLevel) {
      if (/\b(thạc\s*sĩ|master)\b/gi.test(message)) {
        userInfo.desiredEducationLevel = 'Thạc sĩ';
      } else if (/\b(tiến\s*sĩ|phd|doctorate)\b/gi.test(message)) {
        userInfo.desiredEducationLevel = 'Tiến sĩ';
      } else if (/\b(cử\s*nhân|bachelor)\b/gi.test(message)) {
        userInfo.desiredEducationLevel = 'Cử nhân';
      } else if (/\b(cao\s*đẳng|associate)\b/gi.test(message)) {
        userInfo.desiredEducationLevel = 'Cao đẳng';
      }
    }

    // Extract work experience
    if (!userInfo.extracurricularsAndExperience) {
      const experiencePattern =
        /(\d+)\s*(năm|year)[s\s]*(kinh\s*nghiệm|experience|làm\s*việc)/gi;
      const experienceMatch = message.match(experiencePattern);
      if (experienceMatch) {
        userInfo.extracurricularsAndExperience = experienceMatch[0];
        this.logger.log(
          `Extracted experience: ${userInfo.extracurricularsAndExperience}`,
        );
      }
    }

    // Extract career goal from context
    if (!userInfo.careerGoal) {
      const careerKeywords = [
        'software engineer',
        'developer',
        'data scientist',
        'business analyst',
        'kỹ sư phần mềm',
        'lập trình viên',
        'nhà phân tích',
        'quản lý',
      ];

      for (const keyword of careerKeywords) {
        if (new RegExp(keyword, 'gi').test(message)) {
          userInfo.careerGoal = keyword;
          this.logger.log(`Extracted career goal: ${keyword}`);
          break;
        }
      }
    }
  }

  /**
   * Extract financial information
   */
  private extractFinancialInfo(
    message: string,
    session: AgentSessionDocument,
  ): void {
    const userInfo = session.userInfo;

    // Extract budget
    if (!userInfo.estimatedBudget) {
      const budgetPattern =
        /(\d+[.,]?\d*)\s*(k|thousand|nghìn|triệu|million|tỷ|billion)?\s*(usd|dollar|vnd|đồng)/gi;
      const budgetMatch = message.match(budgetPattern);
      if (budgetMatch) {
        const fullMatch = budgetMatch[0];
        const amountMatch = fullMatch.match(/[\d.,]+/);
        if (amountMatch) {
          const amount = parseFloat(amountMatch[0].replace(',', '.'));

          let multiplier = 1;
          if (/k|thousand|nghìn/gi.test(fullMatch)) multiplier = 1000;
          else if (/million|triệu/gi.test(fullMatch)) multiplier = 1000000;
          else if (/billion|tỷ/gi.test(fullMatch)) multiplier = 1000000000;

          userInfo.estimatedBudget = amount * multiplier;
          this.logger.log(`Extracted budget: ${userInfo.estimatedBudget}`);
        }
      }
    }

    // Extract funding source
    if (!userInfo.fundingSource) {
      if (/\b(tự\s*túc|self.*fund|own.*money)\b/gi.test(message)) {
        userInfo.fundingSource = 'Tự túc';
      } else if (/\b(gia\s*đình|family.*fund|parents.*pay)\b/gi.test(message)) {
        userInfo.fundingSource = 'Gia đình tài trợ';
      } else if (/\b(học\s*bổng|scholarship)\b/gi.test(message)) {
        userInfo.fundingSource = 'Học bổng';
      }
    }

    // Extract scholarship need
    if (
      userInfo.needsScholarship === null ||
      userInfo.needsScholarship === undefined
    ) {
      if (
        /\b(cần.*học\s*bổng|need.*scholarship|want.*scholarship)\b/gi.test(
          message,
        )
      ) {
        userInfo.needsScholarship = true;
      } else if (
        /\b(không.*cần.*học\s*bổng|no.*scholarship|don't.*need.*scholarship)\b/gi.test(
          message,
        )
      ) {
        userInfo.needsScholarship = false;
      }
    }
  }

  /**
   * Extract language and certificates
   */
  private extractLanguageAndCertificates(
    message: string,
    session: AgentSessionDocument,
  ): void {
    const userInfo = session.userInfo;

    // Initialize certificates if not exists
    if (!userInfo.certificates) {
      userInfo.certificates = {
        ielts: null,
        toefl: null,
        duolingo: null,
        testDaf: null,
      };
    }

    // Extract IELTS score
    const ieltsPattern = /ielts[:\s]*(\d+\.?\d*)/gi;
    const ieltsMatch = message.match(ieltsPattern);
    if (ieltsMatch && !userInfo.certificates.ielts) {
      const scoreMatch = ieltsMatch[0].match(/\d+\.?\d*/);
      if (scoreMatch) {
        userInfo.certificates.ielts = parseFloat(scoreMatch[0]);
        this.logger.log(`Extracted IELTS: ${userInfo.certificates.ielts}`);
      }
    }

    // Extract TOEFL score
    const toeflPattern = /toefl[:\s]*(\d+)/gi;
    const toeflMatch = message.match(toeflPattern);
    if (toeflMatch && !userInfo.certificates.toefl) {
      const scoreMatch = toeflMatch[0].match(/\d+/);
      if (scoreMatch) {
        userInfo.certificates.toefl = parseInt(scoreMatch[0]);
        this.logger.log(`Extracted TOEFL: ${userInfo.certificates.toefl}`);
      }
    }

    // Extract Duolingo score
    const duolingoPattern = /duolingo[:\s]*(\d+)/gi;
    const duolingoMatch = message.match(duolingoPattern);
    if (duolingoMatch && !userInfo.certificates.duolingo) {
      const scoreMatch = duolingoMatch[0].match(/\d+/);
      if (scoreMatch) {
        userInfo.certificates.duolingo = parseInt(scoreMatch[0]);
        this.logger.log(
          `Extracted Duolingo: ${userInfo.certificates.duolingo}`,
        );
      }
    }

    // Extract study language
    if (!userInfo.studyLanguage) {
      const languageMappings = {
        'Tiếng Anh': /tiếng\s*anh|english/gi,
        'Tiếng Đức': /tiếng\s*đức|german/gi,
        'Tiếng Pháp': /tiếng\s*pháp|french/gi,
        'Tiếng Nhật': /tiếng\s*nhật|japanese/gi,
        'Tiếng Hàn': /tiếng\s*hàn|korean/gi,
      };

      for (const [language, pattern] of Object.entries(languageMappings)) {
        if (pattern.test(message)) {
          userInfo.studyLanguage = language;
          this.logger.log(`Extracted study language: ${language}`);
          break;
        }
      }
    }
  }

  /**
   * Extract plan and timeline
   */
  private extractPlanAndTimeline(
    message: string,
    session: AgentSessionDocument,
  ): void {
    const userInfo = session.userInfo;

    // Extract intended intake time
    if (!userInfo.intendedIntakeTime) {
      const timePatterns = [
        /fall\s*20\d{2}|autumn\s*20\d{2}/gi,
        /spring\s*20\d{2}/gi,
        /summer\s*20\d{2}/gi,
        /tháng\s*\d+[\/\-\s]*20\d{2}/gi,
        /năm\s*20\d{2}/gi,
      ];

      for (const pattern of timePatterns) {
        const match = message.match(pattern);
        if (match) {
          userInfo.intendedIntakeTime = match[0];
          this.logger.log(`Extracted intake time: ${match[0]}`);
          break;
        }
      }
    }

    // Extract current progress
    if (!userInfo.currentProgress) {
      const progressIndicators = [
        'đang chuẩn bị',
        'đã có',
        'chưa có',
        'đang làm',
        'preparing',
        'have',
        "don't have",
        'working on',
      ];

      for (const indicator of progressIndicators) {
        if (new RegExp(indicator, 'gi').test(message)) {
          userInfo.currentProgress = message.substring(0, 100); // First 100 chars as progress summary
          this.logger.log(`Extracted progress: ${userInfo.currentProgress}`);
          break;
        }
      }
    }
  }

  /**
   * Legacy method for backward compatibility
   */
  extractSchoolAndMajor(message: string, session: AgentSessionDocument): void {
    // Improved extraction logic with better patterns
    const messageLower = message.toLowerCase();

    // Enhanced school extraction with full names
    const schoolMappings = {
      'stanford university': /stanford\s*university/i,
      stanford: /stanford/i,
      'harvard university': /harvard\s*university/i,
      harvard: /harvard/i,
      mit: /mit|massachusetts institute of technology/i,
      'uc berkeley': /uc\s*berkeley|university of california.*berkeley/i,
      ucla: /ucla|university of california.*los angeles/i,
      'columbia university': /columbia\s*university/i,
      'new york university': /new york university|nyu/i,
      'cornell university': /cornell\s*university/i,
      'university of california': /university of california/i,
      'california institute of technology':
        /california institute of technology|caltech/i,
    };

    // Enhanced major extraction
    const majorMappings = {
      'computer science': /computer\s*science/i,
      'computer engineering': /computer\s*engineering/i,
      'software engineering': /software\s*engineering/i,
      'information technology': /information\s*technology|công nghệ thông tin/i,
      'electrical engineering': /electrical\s*engineering/i,
      'mechanical engineering': /mechanical\s*engineering/i,
      'business administration': /business\s*administration|mba/i,
      economics: /economics|kinh tế/i,
      medicine: /medicine|y khoa/i,
      engineering: /engineering|kỹ thuật/i,
    };

    // Extract school information and update userInfo
    if (
      !session.userInfo.preferredStudyCountry &&
      !session.userInfo.schoolSelectionCriteria
    ) {
      for (const [schoolName, pattern] of Object.entries(schoolMappings)) {
        if (pattern.test(message)) {
          if (!session.userInfo.schoolSelectionCriteria) {
            session.userInfo.schoolSelectionCriteria = schoolName;
          }
          // Determine country based on school
          if (
            schoolName.includes('stanford') ||
            schoolName.includes('harvard') ||
            schoolName.includes('mit') ||
            schoolName.includes('berkeley') ||
            schoolName.includes('ucla') ||
            schoolName.includes('columbia') ||
            schoolName.includes('cornell') ||
            schoolName.includes('california')
          ) {
            session.userInfo.preferredStudyCountry = 'Hoa Kỳ';
          }
          console.log(`Extracted school preference: ${schoolName}`);
          break;
        }
      }
    }

    // Extract major and update userInfo
    if (!session.userInfo.dreamMajor) {
      for (const [majorName, pattern] of Object.entries(majorMappings)) {
        if (pattern.test(message)) {
          session.userInfo.dreamMajor = majorName;
          console.log(`Extracted major: ${majorName}`);
          break;
        }
      }
    }
  }
}
