import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateLegalDto, CreateDocumentDto } from './dto/create-legal.dto';
import {
  UpdateLegalDto,
  UpdateDocumentDto,
  AddDocumentDto,
} from './dto/update-legal.dto';
import { Model } from 'mongoose';
import { LegalSchema } from './schemas/legal.schema';

@Injectable()
export class LegalService implements OnModuleInit {
  private legalModel: Model<any>;

  constructor(private databaseService: DatabaseService) {}

  async onModuleInit() {
    const connection = this.databaseService.getConnection();

    // Sử dụng schema từ file schemas/legal.schema.ts
    this.legalModel = connection.model('Legal', LegalSchema);
  }

  async create(createLegalDto: CreateLegalDto) {
    const legalDoc = new this.legalModel({
      ...createLegalDto,
      documents: createLegalDto.documents || [],
    });

    const savedDoc = await legalDoc.save();
    return savedDoc.toObject();
  }

  async findAll() {
    return await this.legalModel.find({}).exec();
  }

  async findOne(id: string) {
    const legal = await this.legalModel.findById(id).exec();
    if (!legal) {
      throw new NotFoundException(`Legal document with ID ${id} not found`);
    }
    return legal;
  }

  async findByUserId(userId: string) {
    return await this.legalModel.find({ userId }).exec();
  }

  async update(id: string, updateLegalDto: UpdateLegalDto) {
    const updatedLegal = await this.legalModel
      .findByIdAndUpdate(
        id,
        {
          ...updateLegalDto,
          updatedAt: new Date(),
        },
        { new: true },
      )
      .exec();

    if (!updatedLegal) {
      throw new NotFoundException(`Legal document with ID ${id} not found`);
    }

    return updatedLegal;
  }

  async remove(id: string) {
    const result = await this.legalModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`Legal document with ID ${id} not found`);
    }
    return { message: 'Legal document deleted successfully' };
  }

  // Document management methods
  async addDocument(legalId: string, addDocumentDto: AddDocumentDto) {
    const legal = await this.legalModel.findById(legalId).exec();
    if (!legal) {
      throw new NotFoundException(
        `Legal document with ID ${legalId} not found`,
      );
    }

    const document = {
      name: addDocumentDto.name,
      status: addDocumentDto.status || 'pending',
      note: addDocumentDto.note,
      uploadedFileUrl: addDocumentDto.uploadedFileUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    legal.documents.push(document);
    legal.updatedAt = new Date();

    const savedLegal = await legal.save();
    return savedLegal.toObject();
  }
  async updateDocument(
    legalId: string,
    documentId: string,
    updateDocumentDto: UpdateDocumentDto,
  ) {
    const legal = await this.legalModel.findById(legalId).exec();
    if (!legal) {
      throw new NotFoundException(
        `Legal document with ID ${legalId} not found`,
      );
    }

    const documentIndex = legal.documents.findIndex(
      (doc) => doc._id?.toString() === documentId,
    );
    if (documentIndex === -1) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    // Cập nhật document
    if (updateDocumentDto.name !== undefined) {
      legal.documents[documentIndex].name = updateDocumentDto.name;
    }
    if (updateDocumentDto.status !== undefined) {
      legal.documents[documentIndex].status = updateDocumentDto.status;
    }
    if (updateDocumentDto.note !== undefined) {
      legal.documents[documentIndex].note = updateDocumentDto.note;
    }
    if (updateDocumentDto.uploadedFileUrl !== undefined) {
      legal.documents[documentIndex].uploadedFileUrl =
        updateDocumentDto.uploadedFileUrl;
    }

    legal.documents[documentIndex].updatedAt = new Date();
    legal.updatedAt = new Date();

    const savedLegal = await legal.save();
    return savedLegal.toObject();
  }

  async removeDocument(legalId: string, documentId: string) {
    const legal = await this.legalModel.findById(legalId).exec();
    if (!legal) {
      throw new NotFoundException(
        `Legal document with ID ${legalId} not found`,
      );
    }

    const documentIndex = legal.documents.findIndex(
      (doc) => doc._id?.toString() === documentId,
    );
    if (documentIndex === -1) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    legal.documents.splice(documentIndex, 1);
    legal.updatedAt = new Date();

    const savedLegal = await legal.save();
    return savedLegal.toObject();
  }

  async getDocumentsByStatus(status: 'pending' | 'done' | 'expired') {
    return await this.legalModel
      .aggregate([
        { $unwind: '$documents' },
        { $match: { 'documents.status': status } },
        {
          $project: {
            _id: 1,
            userId: 1,
            visaType: 1,
            document: '$documents',
          },
        },
      ])
      .exec();
  }

  async getDocumentsByType(documentType: string) {
    return await this.legalModel
      .aggregate([
        { $unwind: '$documents' },
        { $match: { 'documents.name': documentType } },
        {
          $project: {
            _id: 1,
            userId: 1,
            visaType: 1,
            document: '$documents',
          },
        },
      ])
      .exec();
  }

  // AI Agent specific methods
  async createLegalDocumentForStudent(
    userId: string,
    school: string,
    documentNames: string[],
  ) {
    const documents = documentNames.map((name) => ({
      name,
      status: 'pending' as const,
      note: `Document required for ${school}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    const legalDoc = new this.legalModel({
      userId,
      school,
      documents,
    });

    const savedDoc = await legalDoc.save();
    return savedDoc.toObject();
  }

  async updateDocumentStatusByName(
    userId: string,
    documentName: string,
    status: 'pending' | 'done' | 'expired',
    note?: string,
  ) {
    const legal = await this.legalModel.findOne({ userId }).exec();
    if (!legal) {
      throw new NotFoundException(
        `Legal document for user ${userId} not found`,
      );
    }

    const documentIndex = legal.documents.findIndex(
      (doc) => doc.name === documentName,
    );
    if (documentIndex === -1) {
      throw new NotFoundException(
        `Document ${documentName} not found for user ${userId}`,
      );
    }

    legal.documents[documentIndex].status = status;
    legal.documents[documentIndex].updatedAt = new Date();
    if (note) {
      legal.documents[documentIndex].note = note;
    }

    legal.updatedAt = new Date();
    const savedLegal = await legal.save();
    return savedLegal.toObject();
  }

  async getPendingDocuments(userId: string) {
    const legal = await this.legalModel.findOne({ userId }).exec();
    if (!legal) {
      return [];
    }

    return legal.documents.filter((doc) => doc.status === 'pending');
  }

  async getCompletedDocuments(userId: string) {
    const legal = await this.legalModel.findOne({ userId }).exec();
    if (!legal) {
      return [];
    }

    return legal.documents.filter((doc) => doc.status === 'done');
  }

  async getDocumentProgress(userId: string) {
    const legal = await this.legalModel.findOne({ userId }).exec();
    if (!legal) {
      return {
        total: 0,
        completed: 0,
        pending: 0,
        expired: 0,
        progress: 0,
      };
    }

    const total = legal.documents.length;
    const completed = legal.documents.filter(
      (doc) => doc.status === 'done',
    ).length;
    const pending = legal.documents.filter(
      (doc) => doc.status === 'pending',
    ).length;
    const expired = legal.documents.filter(
      (doc) => doc.status === 'expired',
    ).length;
    const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      pending,
      expired,
      progress,
      school: legal.school,
    };
  }

  async getRequiredDocumentsForSchool(school: string) {
    // Predefined document requirements for different schools/states
    const commonDocuments = [
      'Passport',
      'I-20',
      'DS-160',
      'SEVIS Receipt',
      'Visa Application',
      'Financial Documents',
      'Academic Transcripts',
      'English Proficiency',
      'Health Insurance',
    ];

    // You can expand this to have school-specific requirements
    const schoolSpecificDocuments = {
      'Harvard University': [...commonDocuments, 'Harvard Application Form'],
      MIT: [...commonDocuments, 'MIT Supplemental Forms'],
      'Stanford University': [...commonDocuments, 'Stanford Declaration'],
      // Add more schools as needed
    };

    return schoolSpecificDocuments[school] || commonDocuments;
  }

  async initializeLegalDocumentsForUser(userId: string, school: string) {
    // Check if user already has legal documents
    const existing = await this.legalModel.findOne({ userId }).exec();
    if (existing) {
      return existing.toObject();
    }

    // Get required documents for the school
    const requiredDocuments = await this.getRequiredDocumentsForSchool(school);

    // Create legal document entry
    return await this.createLegalDocumentForStudent(
      userId,
      school,
      requiredDocuments,
    );
  }

  async addMissingDocuments(userId: string, newDocumentNames: string[]) {
    const legal = await this.legalModel.findOne({ userId }).exec();
    if (!legal) {
      throw new NotFoundException(
        `Legal document for user ${userId} not found`,
      );
    }

    // Filter out documents that already exist
    const existingDocNames = legal.documents.map((doc) => doc.name);
    const documentsToAdd = newDocumentNames.filter(
      (name) => !existingDocNames.includes(name),
    );

    if (documentsToAdd.length === 0) {
      return legal.toObject();
    }

    // Add new documents
    const newDocuments = documentsToAdd.map((name) => ({
      name,
      status: 'pending' as const,
      note: `Additional document required for ${legal.school}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    legal.documents.push(...newDocuments);
    legal.updatedAt = new Date();

    const savedLegal = await legal.save();
    return savedLegal.toObject();
  }
}
