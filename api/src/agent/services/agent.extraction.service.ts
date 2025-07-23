import { Injectable, Logger } from '@nestjs/common';
import { AgentSessionDocument } from '../schema/agent.schema';

@Injectable()
export class AgentExtractionService {
  private readonly logger = new Logger(AgentExtractionService.name);

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

    // Extract school
    if (!session.selectedSchool) {
      for (const [schoolName, pattern] of Object.entries(schoolMappings)) {
        if (pattern.test(message)) {
          session.selectedSchool = schoolName;
          console.log(`Extracted school: ${schoolName}`);
          break;
        }
      }
    }

    // Extract major
    if (!session.selectedMajor) {
      for (const [majorName, pattern] of Object.entries(majorMappings)) {
        if (pattern.test(message)) {
          session.selectedMajor = majorName;
          console.log(`Extracted major: ${majorName}`);
          break;
        }
      }
    }
  }
}
