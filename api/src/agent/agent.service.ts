import { Injectable, OnModuleInit } from '@nestjs/common';
import { LegalService } from '../legal/legal.service';
import { UserService } from '../user/user.service';
import { DatabaseService } from '../database/database.service';
import { Model } from 'mongoose';
import { ConversationSchema, ConversationDocument } from './schemas/conversation.schema';
import OpenAI from 'openai';

export interface ChatResponse {
    message: string;
    phase: string;
    data?: any;
    suggestions?: string[];
    progress?: any;
    conversationState?: any;
}

export interface StudentProfile {
    userId: string;
    name?: string;
    age?: number;
    gpa?: number;
    englishScore?: string;
    interestedMajors?: string[];
    preferredState?: string;
    preferredSchool?: string;
    budget?: number;
    immigrationGoal?: boolean;
}

export interface MajorRecommendation {
    name: string;
    description: string;
    careerProspects: string[];
    averageSalary: number;
    matchScore: number;
    reasons: string[];
}

export interface SchoolRecommendation {
    name: string;
    state: string;
    ranking: number;
    tuition: number;
    major: string;
    matchScore: number;
    reasons: string[];
}

@Injectable()
export class AgentService implements OnModuleInit {
    private conversationModel: Model<ConversationDocument>;
    private openai: OpenAI;

    constructor(
        private readonly legalService: LegalService,
        private readonly userService: UserService,
        private readonly databaseService: DatabaseService
    ) {
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });
    }

    async onModuleInit() {
        const connection = this.databaseService.getConnection();
        this.conversationModel = connection.model<ConversationDocument>('Conversation', ConversationSchema);
    }

    async processConversation(userId: string, userMessage: string): Promise<ChatResponse> {
        // Lấy hoặc tạo conversation state
        let conversation = await this.conversationModel.findOne({ userId }).sort({ updatedAt: -1 });

        if (!conversation) {
            conversation = new this.conversationModel({
                userId,
                phase: 'introduction',
                lastMessage: userMessage
            });
        } else {
            conversation.lastMessage = userMessage;
        }

        // Xử lý theo phase hiện tại
        let response: ChatResponse;

        switch (conversation.phase) {
            case 'introduction':
                response = await this.handleIntroduction(conversation, userMessage);
                break;

            case 'collect-info':
                response = await this.handleCollectInfo(conversation, userMessage);
                break;

            case 'recommend-majors':
                response = await this.handleRecommendMajors(conversation, userMessage);
                break;

            case 'recommend-schools':
                response = await this.handleRecommendSchools(conversation, userMessage);
                break;

            case 'legal':
                response = await this.handleLegal(conversation, userMessage);
                break;

            default:
                response = await this.handleIntroduction(conversation, userMessage);
        }

        // Cập nhật conversation state
        if (response.phase) {
            conversation.phase = response.phase as any;
        }
        if (response.data) {
            // Merge data vào conversation
            if (response.data.selectedMajor) {
                conversation.selectedMajor = response.data.selectedMajor;
            }
            if (response.data.selectedSchool) {
                conversation.selectedSchool = response.data.selectedSchool;
            }
            if (response.data.legalChecklist) {
                conversation.legalChecklist = response.data.legalChecklist;
            }
            if (response.data.userProfile) {
                conversation.userProfile = { ...conversation.userProfile, ...response.data.userProfile };
            }
            if (response.data.recommendations) {
                conversation.recommendations = response.data.recommendations;
            }
        }

        await conversation.save();

        // Thêm conversation state vào response
        response.conversationState = {
            userId: conversation.userId,
            phase: conversation.phase,
            selectedSchool: conversation.selectedSchool,
            selectedMajor: conversation.selectedMajor,
            legalChecklist: conversation.legalChecklist
        };

        return response;
    }

    private async handleIntroduction(conversation: ConversationDocument, userMessage: string): Promise<ChatResponse> {
        // Tạo response tự nhiên với OpenAI
        const aiMessage = await this.generateIntroductionResponse(userMessage);

        // Chuyển sang giai đoạn collect-info nếu user đồng ý
        if (this.isPositiveResponse(userMessage)) {
            return {
                message: aiMessage + "\n\n📝 Hãy cho tôi biết một chút về bản thân bạn nhé! Bạn có thể chia sẻ tên, email, GPA, ngành học quan tâm, v.v.",
                phase: 'collect-info',
                suggestions: ['Tôi tên là...', 'GPA của tôi là...', 'Tôi quan tâm đến ngành...']
            };
        }

        return {
            message: aiMessage,
            phase: 'introduction',
            suggestions: ['Có', 'Được', 'Bắt đầu thôi']
        };
    }

    private async handleCollectInfo(conversation: ConversationDocument, userMessage: string): Promise<ChatResponse> {
        // Extract thông tin từ message
        const extractedInfo = this.extractUserInfoFromMessage(userMessage);

        // Merge với thông tin có sẵn
        const currentProfile = conversation.userProfile || {};
        const updatedProfile = { ...currentProfile, ...extractedInfo };

        // Lấy thông tin từ user database
        const user = await this.userService.findOne(conversation.userId.toString());
        if (user) {
            updatedProfile.name = updatedProfile.name || user.fullname;
            updatedProfile.email = updatedProfile.email || user.email;
        }

        // Kiểm tra thông tin còn thiếu
        const missingInfo = this.getMissingInfo(updatedProfile);

        if (missingInfo.length > 0) {
            // Sử dụng OpenAI để tạo response tự nhiên
            const aiMessage = await this.generateInfoCollectionResponse(userMessage, missingInfo, extractedInfo);

            return {
                message: aiMessage,
                phase: 'collect-info',
                data: { userProfile: updatedProfile },
                suggestions: this.generateInfoSuggestions(missingInfo)
            };
        } else {
            // Sử dụng OpenAI để tạo response tự nhiên
            const aiMessage = await this.generateGeneralResponse(
                userMessage,
                'collect-info-complete',
                { userProfile: updatedProfile }
            );

            return {
                message: aiMessage + "\n\nBây giờ tôi sẽ phân tích và đưa ra gợi ý ngành học phù hợp. Bạn có muốn tiếp tục không?",
                phase: 'recommend-majors',
                data: { userProfile: updatedProfile },
                suggestions: ['Có, tiếp tục', 'Được', 'Bắt đầu phân tích']
            };
        }
    }

    private async handleRecommendMajors(conversation: ConversationDocument, userMessage: string): Promise<ChatResponse> {
        if (this.isPositiveResponse(userMessage)) {
            const recommendations = this.generateMajorRecommendations(conversation.userProfile);

            // Sử dụng OpenAI để tạo response tự nhiên
            const aiMessage = await this.generateMajorRecommendationResponse(userMessage, recommendations, conversation.userProfile);

            const detailedInfo = `
🎯 Dựa trên thông tin của bạn, tôi gợi ý các ngành học sau:

${recommendations.map((rec, index) => `
${index + 1}. **${rec.name}** (${rec.matchScore}% phù hợp)
   📝 ${rec.description}
   💰 Mức lương TB: $${rec.averageSalary.toLocaleString()}/năm
   🎯 Cơ hội: ${rec.careerProspects.join(', ')}
   ✅ Lý do: ${rec.reasons.join(', ')}
`).join('\n')}

Bạn có muốn chọn ngành nào để tôi gợi ý trường học không? 
Hãy nhập số thứ tự (1, 2, 3) hoặc tên ngành học.
            `;

            return {
                message: aiMessage + "\n\n" + detailedInfo,
                phase: 'recommend-majors',
                data: { recommendations },
                suggestions: recommendations.map((rec, index) => `${index + 1}. ${rec.name}`)
            };
        }

        // Xử lý chọn ngành
        const selectedMajor = this.extractMajorSelection(userMessage, conversation.recommendations?.majors || []);

        if (selectedMajor) {
            return {
                message: `✅ Tuyệt vời! Bạn đã chọn ngành **${selectedMajor}**. 

Bây giờ tôi sẽ tìm các trường đại học phù hợp với ngành này và profile của bạn.

Bạn có muốn tiếp tục không?`,
                phase: 'recommend-schools',
                data: { selectedMajor },
                suggestions: ['Có, tiếp tục', 'Được', 'Tìm trường đi']
            };
        }

        return {
            message: "Tôi không hiểu lựa chọn của bạn. Vui lòng nhập số thứ tự (1, 2, 3) hoặc tên ngành học chính xác.",
            phase: 'recommend-majors',
            suggestions: conversation.recommendations?.majors?.map((rec, index) => `${index + 1}. ${rec.name}`) || []
        };
    }

    private async handleRecommendSchools(conversation: ConversationDocument, userMessage: string): Promise<ChatResponse> {
        if (this.isPositiveResponse(userMessage)) {
            const schoolRecommendations = this.generateSchoolRecommendations(
                conversation.userProfile,
                conversation.selectedMajor || ''
            );

            // Sử dụng OpenAI để tạo response tự nhiên
            const aiMessage = await this.generateSchoolRecommendationResponse(
                userMessage,
                schoolRecommendations,
                conversation.selectedMajor || '',
                conversation.userProfile
            );

            const detailedInfo = `
🏫 Dựa trên ngành **${conversation.selectedMajor}** và profile của bạn, tôi gợi ý các trường sau:

${schoolRecommendations.map((school, index) => `
${index + 1}. **${school.name}** - ${school.state}
   🏆 Ranking: ${school.ranking}
   💰 Học phí: $${school.tuition.toLocaleString()}/năm
   📊 Phù hợp: ${school.matchScore}%
   ✅ Lý do: ${school.reasons.join(', ')}
`).join('\n')}

Bạn có muốn chọn trường nào để tôi tạo danh sách giấy tờ cần chuẩn bị không?
Hãy nhập số thứ tự (1, 2, 3) hoặc tên trường.
            `;

            return {
                message: aiMessage + "\n\n" + detailedInfo,
                phase: 'recommend-schools',
                data: { schoolRecommendations },
                suggestions: schoolRecommendations.map((school, index) => `${index + 1}. ${school.name}`)
            };
        }

        // Xử lý chọn trường
        const selectedSchool = this.extractSchoolSelection(userMessage, conversation.recommendations?.schools || []);

        if (selectedSchool) {
            // Tạo legal checklist
            const legalChecklist = this.generateLegalChecklist(selectedSchool);

            // Tạo legal document trong database
            await this.legalService.initializeLegalDocumentsForUser(conversation.userId.toString(), selectedSchool);

            const message = `✅ Tuyệt vời! Bạn đã chọn **${selectedSchool}**.

📋 Danh sách giấy tờ cần chuẩn bị:

${legalChecklist.map((doc, index) => `
${index + 1}. ${doc} - ⏳ Chưa hoàn thành
`).join('')}

**Tiến độ hiện tại: 0/${legalChecklist.length} (0%)**

Khi bạn hoàn thành giấy tờ nào, hãy nhắn cho tôi. Ví dụ: "Tôi đã làm xong Passport" hoặc "Passport đã xong".

Bạn có câu hỏi gì không?`;

            return {
                message,
                phase: 'legal',
                data: {
                    selectedSchool,
                    legalChecklist
                },
                suggestions: ['Kiểm tra tiến độ', 'Hướng dẫn làm Passport', 'Làm giấy tờ nào trước?']
            };
        }

        return {
            message: "Tôi không hiểu lựa chọn của bạn. Vui lòng nhập số thứ tự (1, 2, 3) hoặc tên trường chính xác.",
            phase: 'recommend-schools',
            suggestions: conversation.recommendations?.schools?.map((school, index) => `${index + 1}. ${school.name}`) || []
        };
    }

    private async handleLegal(conversation: ConversationDocument, userMessage: string): Promise<ChatResponse> {
        // Phân tích message để xem có cập nhật giấy tờ không
        const documentUpdate = this.extractDocumentUpdate(userMessage);

        if (documentUpdate) {
            try {
                await this.legalService.updateDocumentStatusByName(
                    conversation.userId.toString(),
                    documentUpdate.documentName,
                    'done'
                );

                const progress = await this.legalService.getDocumentProgress(conversation.userId.toString());

                // Sử dụng OpenAI để tạo response tự nhiên
                const aiMessage = await this.generateLegalDocumentResponse(userMessage, documentUpdate, progress);

                let detailedMessage = `✅ Tuyệt vời! Tôi đã cập nhật **${documentUpdate.documentName}** thành hoàn thành.

**Tiến độ hiện tại: ${progress.completed}/${progress.total} (${progress.progress}%)**`;

                if (progress.pending > 0) {
                    const pendingDocs = await this.legalService.getPendingDocuments(conversation.userId.toString());
                    detailedMessage += `\n\n📋 Giấy tờ còn lại cần chuẩn bị:
${pendingDocs.map((doc, index) => `${index + 1}. ${doc.name}`).join('\n')}

Hãy tiếp tục chuẩn bị và báo cho tôi khi hoàn thành nhé!`;
                } else {
                    detailedMessage += `\n\n🎉 **CHÚC MỪNG!** Bạn đã hoàn thành tất cả giấy tờ cần thiết!

Bây giờ bạn có thể tiến hành nộp hồ sơ du học. Chúc bạn thành công!`;
                }

                return {
                    message: aiMessage + "\n\n" + detailedMessage,
                    phase: progress.pending > 0 ? 'legal' : 'completed',
                    progress,
                    suggestions: progress.pending > 0 ? ['Kiểm tra tiến độ', 'Hướng dẫn giấy tờ tiếp theo'] : ['Cảm ơn bạn!']
                };
            } catch (error) {
                const errorMessage = await this.generateGeneralResponse(
                    userMessage,
                    'legal-error',
                    { error: error.message, documentName: documentUpdate.documentName }
                );

                return {
                    message: errorMessage,
                    phase: 'legal',
                    suggestions: ['Kiểm tra tiến độ', 'Danh sách giấy tờ']
                };
            }
        }

        // Xử lý các câu hỏi khác
        if (userMessage.toLowerCase().includes('tiến độ') ||
            userMessage.toLowerCase().includes('progress')) {

            const progress = await this.legalService.getDocumentProgress(conversation.userId.toString());
            const pendingDocs = await this.legalService.getPendingDocuments(conversation.userId.toString());

            const message = `📊 **Tiến độ hiện tại: ${progress.completed}/${progress.total} (${progress.progress}%)**

📋 Giấy tờ còn lại cần chuẩn bị:
${pendingDocs.map((doc, index) => `${index + 1}. ${doc.name}`).join('\n')}

Khi hoàn thành giấy tờ nào, hãy nhắn cho tôi nhé!`;

            return {
                message,
                phase: 'legal',
                progress,
                suggestions: ['Hướng dẫn làm giấy tờ', 'Ưu tiên giấy tờ nào?']
            };
        }

        return {
            message: `Tôi hiểu bạn đang trong giai đoạn chuẩn bị giấy tờ. 

Để cập nhật tiến độ, bạn có thể:
• Nói "Tôi đã làm xong [tên giấy tờ]"
• Hỏi "tiến độ hiện tại như thế nào?"
• Hoặc hỏi bất kỳ câu hỏi nào khác

Tôi sẵn sàng hỗ trợ bạn!`,
            phase: 'legal',
            suggestions: ['Kiểm tra tiến độ', 'Hướng dẫn làm giấy tờ', 'Danh sách giấy tờ']
        };
    }

    // Helper methods
    private isPositiveResponse(message: string): boolean {
        const lowerMessage = message.toLowerCase();
        const positiveWords = ['có', 'được', 'ok', 'sẵn sàng', 'bắt đầu', 'tiếp tục', 'yes', 'okay', 'sure'];
        return positiveWords.some(word => lowerMessage.includes(word));
    }

    private extractUserInfoFromMessage(message: string): any {
        const info: any = {};

        // Extract name
        const nameMatch = message.match(/tên\s+(là\s+)?([a-zA-ZÀ-ÿ\s]+)/i) ||
            message.match(/tôi\s+(là\s+)?([a-zA-ZÀ-ÿ\s]+)/i);
        if (nameMatch) info.name = nameMatch[2].trim();

        // Extract email
        const emailMatch = message.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
        if (emailMatch) info.email = emailMatch[0];

        // Extract phone
        const phoneMatch = message.match(/(\+?\d{1,3}[-.\s]?)?(\d{3}[-.\s]?\d{3}[-.\s]?\d{4}|\d{10})/);
        if (phoneMatch) info.phone = phoneMatch[0];

        // Extract GPA
        const gpaMatch = message.match(/GPA[:\s]*(\d+\.?\d*)/i) ||
            message.match(/điểm[:\s]*(\d+\.?\d*)/i);
        if (gpaMatch) info.gpa = parseFloat(gpaMatch[1]);

        // Extract budget
        const budgetMatch = message.match(/(\d+)[,.]?(\d+)?\s*(USD|dollar|usd|\$)/i);
        if (budgetMatch) info.budget = parseInt(budgetMatch[1] + (budgetMatch[2] || ''));

        // Extract interested majors
        const majorKeywords = ['computer science', 'business', 'engineering', 'economics', 'medicine', 'law'];
        const interestedMajors = majorKeywords.filter(major =>
            message.toLowerCase().includes(major)
        );
        if (interestedMajors.length > 0) info.interestedMajors = interestedMajors;

        return info;
    }

    private getMissingInfo(profile: any): string[] {
        const requiredFields = ['name', 'email', 'gpa', 'interestedMajors'];
        return requiredFields.filter(field => !profile[field]);
    }

    private translateMissingInfo(info: string): string {
        const translations: { [key: string]: string } = {
            'name': 'Họ và tên',
            'email': 'Email',
            'phone': 'Số điện thoại',
            'gpa': 'Điểm GPA',
            'interestedMajors': 'Ngành học quan tâm',
            'budget': 'Ngân sách dự kiến',
            'preferredState': 'Bang mong muốn'
        };

        return translations[info] || info;
    }

    private generateInfoSuggestions(missingInfo: string[]): string[] {
        const suggestions: string[] = [];

        if (missingInfo.includes('name')) suggestions.push('Tôi tên là...');
        if (missingInfo.includes('gpa')) suggestions.push('GPA của tôi là...');
        if (missingInfo.includes('interestedMajors')) suggestions.push('Tôi quan tâm đến ngành...');
        if (missingInfo.includes('budget')) suggestions.push('Ngân sách của tôi là...');

        return suggestions;
    }

    private generateMajorRecommendations(profile: any): any[] {
        const majors = [
            {
                name: 'Computer Science',
                description: 'Khoa học máy tính với focus vào phát triển phần mềm, AI, và công nghệ',
                careerProspects: ['Software Engineer', 'Data Scientist', 'Product Manager', 'AI Engineer'],
                averageSalary: 95000,
                matchScore: this.calculateMajorMatch(profile, 'Computer Science'),
                reasons: this.getMajorReasons(profile, 'Computer Science')
            },
            {
                name: 'Business Administration',
                description: 'Quản trị kinh doanh với kỹ năng lãnh đạo và quản lý',
                careerProspects: ['Manager', 'Consultant', 'Entrepreneur', 'Business Analyst'],
                averageSalary: 75000,
                matchScore: this.calculateMajorMatch(profile, 'Business Administration'),
                reasons: this.getMajorReasons(profile, 'Business Administration')
            },
            {
                name: 'Engineering',
                description: 'Kỹ thuật với nhiều chuyên ngành khác nhau',
                careerProspects: ['Engineer', 'Project Manager', 'Technical Lead', 'Research Scientist'],
                averageSalary: 85000,
                matchScore: this.calculateMajorMatch(profile, 'Engineering'),
                reasons: this.getMajorReasons(profile, 'Engineering')
            }
        ];

        return majors.sort((a, b) => b.matchScore - a.matchScore);
    }

    private calculateMajorMatch(profile: any, major: string): number {
        let score = 50; // Base score

        // GPA boost
        if (profile.gpa && profile.gpa >= 3.5) score += 20;
        else if (profile.gpa && profile.gpa >= 3.0) score += 10;

        // Interest match
        if (profile.interestedMajors?.some((interest: string) =>
            interest.toLowerCase().includes(major.toLowerCase())
        )) {
            score += 30;
        }

        return Math.min(score, 100);
    }

    private getMajorReasons(profile: any, major: string): string[] {
        const reasons: string[] = [];

        if (profile.gpa && profile.gpa >= 3.5) {
            reasons.push('GPA cao phù hợp với ngành có tính cạnh tranh');
        }

        if (profile.interestedMajors?.some((interest: string) =>
            interest.toLowerCase().includes(major.toLowerCase())
        )) {
            reasons.push('Phù hợp với sở thích đã đề cập');
        }

        if (major === 'Computer Science') {
            reasons.push('Ngành hot với nhiều cơ hội việc làm');
        }

        return reasons;
    }

    private generateSchoolRecommendations(profile: any, selectedMajor: string): any[] {
        const schools = [
            {
                name: 'Stanford University',
                state: 'California',
                ranking: 5,
                tuition: 55000,
                matchScore: this.calculateSchoolMatch(profile, 'Stanford University'),
                reasons: this.getSchoolReasons(profile, 'Stanford University')
            },
            {
                name: 'University of Texas at Austin',
                state: 'Texas',
                ranking: 42,
                tuition: 38000,
                matchScore: this.calculateSchoolMatch(profile, 'University of Texas at Austin'),
                reasons: this.getSchoolReasons(profile, 'University of Texas at Austin')
            },
            {
                name: 'Arizona State University',
                state: 'Arizona',
                ranking: 103,
                tuition: 28000,
                matchScore: this.calculateSchoolMatch(profile, 'Arizona State University'),
                reasons: this.getSchoolReasons(profile, 'Arizona State University')
            }
        ];

        return schools.sort((a, b) => b.matchScore - a.matchScore);
    }

    private calculateSchoolMatch(profile: any, schoolName: string): number {
        let score = 60; // Base score

        // GPA matching
        if (profile.gpa && profile.gpa >= 3.7) score += 20;
        else if (profile.gpa && profile.gpa >= 3.3) score += 15;
        else if (profile.gpa && profile.gpa >= 3.0) score += 10;

        // Budget consideration
        if (profile.budget) {
            if (schoolName.includes('Arizona') && profile.budget >= 30000) score += 15;
            if (schoolName.includes('Texas') && profile.budget >= 40000) score += 15;
            if (schoolName.includes('Stanford') && profile.budget >= 60000) score += 15;
        }

        return Math.min(score, 100);
    }

    private getSchoolReasons(profile: any, schoolName: string): string[] {
        const reasons: string[] = [];

        if (schoolName.includes('Stanford')) {
            reasons.push('Trường danh tiếng với chương trình mạnh');
        } else if (schoolName.includes('Texas')) {
            reasons.push('Chất lượng tốt với chi phí hợp lý');
        } else if (schoolName.includes('Arizona')) {
            reasons.push('Dễ đậu với học phí thấp');
        }

        return reasons;
    }

    private generateLegalChecklist(school: string): string[] {
        const commonDocs = [
            'Passport',
            'I-20',
            'DS-160',
            'SEVIS Receipt',
            'Visa Application',
            'Financial Documents',
            'Academic Transcripts',
            'English Proficiency'
        ];

        // Có thể customize theo trường
        if (school.includes('Stanford')) {
            commonDocs.push('Additional Essays');
        }

        return commonDocs;
    }

    private extractMajorSelection(message: string, recommendations: any[]): string | null {
        if (!recommendations) return null;

        // Check for number selection
        const numberMatch = message.match(/\d+/);
        if (numberMatch) {
            const index = parseInt(numberMatch[0]) - 1;
            if (index >= 0 && index < recommendations.length) {
                return recommendations[index].name;
            }
        }

        // Check for major name
        const lowerMessage = message.toLowerCase();
        for (const rec of recommendations) {
            if (lowerMessage.includes(rec.name.toLowerCase())) {
                return rec.name;
            }
        }

        return null;
    }

    private extractSchoolSelection(message: string, recommendations: any[]): string | null {
        if (!recommendations) return null;

        // Check for number selection
        const numberMatch = message.match(/\d+/);
        if (numberMatch) {
            const index = parseInt(numberMatch[0]) - 1;
            if (index >= 0 && index < recommendations.length) {
                return recommendations[index].name;
            }
        }

        // Check for school name
        const lowerMessage = message.toLowerCase();
        for (const rec of recommendations) {
            if (lowerMessage.includes(rec.name.toLowerCase())) {
                return rec.name;
            }
        }

        return null;
    }

    private extractDocumentUpdate(message: string): { documentName: string } | null {
        const lowerMessage = message.toLowerCase();

        // Common document names
        const documents = [
            'passport', 'hộ chiếu',
            'i-20', 'i20',
            'ds-160', 'ds160',
            'sevis receipt', 'sevis fee',
            'visa application', 'visa',
            'financial documents', 'tài chính',
            'academic transcripts', 'bảng điểm',
            'english proficiency', 'tiếng anh'
        ];

        const completionPhrases = [
            'đã làm xong', 'đã hoàn thành', 'đã xong', 'hoàn thành',
            'done', 'finished', 'completed', 'ready'
        ];

        // Check if message contains completion phrase
        const hasCompletionPhrase = completionPhrases.some(phrase =>
            lowerMessage.includes(phrase)
        );

        if (hasCompletionPhrase) {
            // Find which document is mentioned
            for (const doc of documents) {
                if (lowerMessage.includes(doc)) {
                    return { documentName: this.normalizeDocumentName(doc) };
                }
            }
        }

        return null;
    }

    private normalizeDocumentName(name: string): string {
        const mapping: { [key: string]: string } = {
            'passport': 'Passport',
            'hộ chiếu': 'Passport',
            'i-20': 'I-20',
            'i20': 'I-20',
            'ds-160': 'DS-160',
            'ds160': 'DS-160',
            'sevis receipt': 'SEVIS Receipt',
            'sevis fee': 'SEVIS Receipt',
            'visa application': 'Visa Application',
            'visa': 'Visa Application',
            'financial documents': 'Financial Documents',
            'tài chính': 'Financial Documents',
            'academic transcripts': 'Academic Transcripts',
            'bảng điểm': 'Academic Transcripts',
            'english proficiency': 'English Proficiency',
            'tiếng anh': 'English Proficiency'
        };

        return mapping[name.toLowerCase()] || name;
    }

    async getConversationState(userId: string): Promise<any> {
        const conversation = await this.conversationModel.findOne({ userId }).sort({ updatedAt: -1 });

        if (!conversation) {
            return {
                phase: 'introduction',
                message: 'Chưa có cuộc hội thoại. Hãy bắt đầu bằng cách nói "Xin chào"!',
                isNew: true
            };
        }

        return {
            userId: conversation.userId,
            phase: conversation.phase,
            selectedSchool: conversation.selectedSchool,
            selectedMajor: conversation.selectedMajor,
            legalChecklist: conversation.legalChecklist,
            lastMessage: conversation.lastMessage,
            updatedAt: conversation.updatedAt
        };
    }

    async resetConversation(userId: string): Promise<any> {
        await this.conversationModel.deleteMany({ userId });

        return {
            message: "Cuộc hội thoại đã được reset. Chúng ta có thể bắt đầu lại từ đầu!",
            phase: 'introduction'
        };
    }

    // OpenAI Helper Methods
    private async generateAIResponse(systemPrompt: string, userMessage: string, context?: any): Promise<string> {
        try {
            const messages: any[] = [
                {
                    role: 'system',
                    content: systemPrompt
                }
            ];

            if (context) {
                messages.push({
                    role: 'system',
                    content: `Context: ${JSON.stringify(context)}`
                });
            }

            messages.push({
                role: 'user',
                content: userMessage
            });

            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: messages,
                max_tokens: 500,
                temperature: 0.7,
            });

            return completion.choices[0]?.message?.content || '';
        } catch (error) {
            console.error('OpenAI API Error:', error);
            return 'Xin lỗi, tôi gặp sự cố kỹ thuật. Vui lòng thử lại sau.';
        }
    }

    private async generateIntroductionResponse(userMessage: string): Promise<string> {
        const systemPrompt = `
Bạn là AI Agent chuyên tư vấn du học Mỹ tên là Scholar AI. Nhiệm vụ của bạn là:
1. Chào hỏi thân thiện bằng tiếng Việt
2. Giới thiệu về dịch vụ tư vấn du học
3. Khuyến khích người dùng bắt đầu quá trình tư vấn

Phong cách: Thân thiện, chuyên nghiệp, nhiệt tình
Ngôn ngữ: Tiếng Việt
Độ dài: 3-5 câu
Kết thúc: Hỏi xem người dùng có muốn bắt đầu không

Các dịch vụ chính:
- Tư vấn ngành học phù hợp
- Gợi ý trường đại học
- Hướng dẫn giấy tờ pháp lý
- Theo dõi tiến độ chuẩn bị
`;

        return await this.generateAIResponse(systemPrompt, userMessage);
    }

    private async generateInfoCollectionResponse(userMessage: string, missingInfo: string[], extractedInfo: any): Promise<string> {
        const systemPrompt = `
Bạn là AI Agent thu thập thông tin du học. Nhiệm vụ:
1. Cảm ơn thông tin đã cung cấp
2. Yêu cầu thông tin còn thiếu một cách tự nhiên
3. Khuyến khích người dùng cung cấp thêm

Phong cách: Thân thiện, khuyến khích
Ngôn ngữ: Tiếng Việt
Độ dài: 2-4 câu

Thông tin đã có: ${JSON.stringify(extractedInfo)}
Thông tin còn thiếu: ${missingInfo.join(', ')}

Hãy tạo câu hỏi tự nhiên để thu thập thông tin còn thiếu.
`;

        return await this.generateAIResponse(systemPrompt, userMessage);
    }

    private async generateMajorRecommendationResponse(userMessage: string, recommendations: any[], userProfile: any): Promise<string> {
        const systemPrompt = `
Bạn là AI Agent tư vấn ngành học. Nhiệm vụ:
1. Phân tích profile của học sinh
2. Giới thiệu các ngành học phù hợp
3. Giải thích lý do khuyến nghị
4. Khuyến khích chọn ngành

Phong cách: Chuyên nghiệp, phân tích, khuyến khích
Ngôn ngữ: Tiếng Việt
Độ dài: 4-6 câu

Profile học sinh: ${JSON.stringify(userProfile)}
Ngành học đề xuất: ${JSON.stringify(recommendations)}

Hãy tạo lời giới thiệu hấp dẫn về các ngành học phù hợp.
`;

        return await this.generateAIResponse(systemPrompt, userMessage);
    }

    private async generateSchoolRecommendationResponse(userMessage: string, recommendations: any[], selectedMajor: string, userProfile: any): Promise<string> {
        const systemPrompt = `
Bạn là AI Agent tư vấn trường học. Nhiệm vụ:
1. Giới thiệu các trường đại học phù hợp
2. Phân tích ưu nhược điểm từng trường
3. Đưa ra khuyến nghị dựa trên profile
4. Khuyến khích chọn trường

Phong cách: Chuyên nghiệp, phân tích chi tiết
Ngôn ngữ: Tiếng Việt
Độ dài: 5-7 câu

Ngành học đã chọn: ${selectedMajor}
Profile học sinh: ${JSON.stringify(userProfile)}
Trường đại học đề xuất: ${JSON.stringify(recommendations)}

Hãy tạo lời giới thiệu chi tiết về các trường phù hợp.
`;

        return await this.generateAIResponse(systemPrompt, userMessage);
    }

    private async generateLegalDocumentResponse(userMessage: string, documentUpdate: any, progress: any): Promise<string> {
        const systemPrompt = `
Bạn là AI Agent hướng dẫn giấy tờ pháp lý du học. Nhiệm vụ:
1. Cập nhật tiến độ giấy tờ
2. Khuyến khích và động viên
3. Hướng dẫn bước tiếp theo
4. Nhắc nhở giấy tờ quan trọng

Phong cách: Hỗ trợ, khuyến khích, hướng dẫn rõ ràng
Ngôn ngữ: Tiếng Việt
Độ dài: 3-5 câu

Cập nhật giấy tờ: ${JSON.stringify(documentUpdate)}
Tiến độ hiện tại: ${JSON.stringify(progress)}

Hãy tạo phản hồi động viên và hướng dẫn tiếp theo.
`;

        return await this.generateAIResponse(systemPrompt, userMessage);
    }

    private async generateGeneralResponse(userMessage: string, phase: string, context?: any): Promise<string> {
        const systemPrompt = `
Bạn là AI Agent tư vấn du học Scholar AI. Nhiệm vụ:
1. Trả lời câu hỏi của người dùng
2. Cung cấp thông tin hữu ích
3. Hướng dẫn bước tiếp theo
4. Giữ ngữ cảnh hội thoại

Phong cách: Thân thiện, hữu ích, chuyên nghiệp
Ngôn ngữ: Tiếng Việt
Độ dài: 2-4 câu

Giai đoạn hiện tại: ${phase}
Context: ${JSON.stringify(context)}

Hãy trả lời câu hỏi một cách tự nhiên và hữu ích.
`;

        return await this.generateAIResponse(systemPrompt, userMessage);
    }
}
