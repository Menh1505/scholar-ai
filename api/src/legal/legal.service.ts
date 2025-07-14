import { Injectable, OnModuleInit, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { CreateLegalDto, CreateDocumentDto } from './dto/create-legal.dto';
import { UpdateLegalDto, UpdateDocumentDto, AddDocumentDto } from './dto/update-legal.dto';
import { Model, Schema } from 'mongoose';

@Injectable()
export class LegalService implements OnModuleInit {
  private legalModel: Model<any>;

  constructor(private databaseService: DatabaseService) { }

  async onModuleInit() {
    const connection = this.databaseService.getConnection();

    // Tạo schema cho legal documents
    const legalSchema = new Schema({
      userId: { type: String, required: true },
      visaType: { type: String, required: true },
      documents: [{
        name: { type: String, required: true },
        status: {
          type: String,
          enum: ['pending', 'done', 'expired'],
          default: 'pending'
        },
        note: String,
        uploadedFileUrl: String,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now }
      }],
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now }
    });

    // Tạo indexes
    legalSchema.index({ userId: 1 });
    legalSchema.index({ 'documents.name': 1 });
    legalSchema.index({ 'documents.status': 1 });

    this.legalModel = connection.model('Legal', legalSchema);
  }

  async create(createLegalDto: CreateLegalDto) {
    const legalDoc = new this.legalModel({
      ...createLegalDto,
      documents: createLegalDto.documents || []
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
    const updatedLegal = await this.legalModel.findByIdAndUpdate(
      id,
      {
        ...updateLegalDto,
        updatedAt: new Date()
      },
      { new: true }
    ).exec();

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
      throw new NotFoundException(`Legal document with ID ${legalId} not found`);
    }

    const document = {
      name: addDocumentDto.name,
      status: addDocumentDto.status || 'pending',
      note: addDocumentDto.note,
      uploadedFileUrl: addDocumentDto.uploadedFileUrl,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    legal.documents.push(document);
    legal.updatedAt = new Date();

    const savedLegal = await legal.save();
    return savedLegal.toObject();
  }

  async updateDocument(legalId: string, documentId: string, updateDocumentDto: UpdateDocumentDto) {
    const legal = await this.legalModel.findById(legalId).exec();
    if (!legal) {
      throw new NotFoundException(`Legal document with ID ${legalId} not found`);
    }

    const documentIndex = legal.documents.findIndex(doc => doc._id.toString() === documentId);
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
      legal.documents[documentIndex].uploadedFileUrl = updateDocumentDto.uploadedFileUrl;
    }

    legal.documents[documentIndex].updatedAt = new Date();
    legal.updatedAt = new Date();

    const savedLegal = await legal.save();
    return savedLegal.toObject();
  }

  async removeDocument(legalId: string, documentId: string) {
    const legal = await this.legalModel.findById(legalId).exec();
    if (!legal) {
      throw new NotFoundException(`Legal document with ID ${legalId} not found`);
    }

    const documentIndex = legal.documents.findIndex(doc => doc._id.toString() === documentId);
    if (documentIndex === -1) {
      throw new NotFoundException(`Document with ID ${documentId} not found`);
    }

    legal.documents.splice(documentIndex, 1);
    legal.updatedAt = new Date();

    const savedLegal = await legal.save();
    return savedLegal.toObject();
  }

  async getDocumentsByStatus(status: 'pending' | 'done' | 'expired') {
    return await this.legalModel.aggregate([
      { $unwind: '$documents' },
      { $match: { 'documents.status': status } },
      {
        $project: {
          _id: 1,
          userId: 1,
          visaType: 1,
          document: '$documents'
        }
      }
    ]).exec();
  }

  async getDocumentsByType(documentType: string) {
    return await this.legalModel.aggregate([
      { $unwind: '$documents' },
      { $match: { 'documents.name': documentType } },
      {
        $project: {
          _id: 1,
          userId: 1,
          visaType: 1,
          document: '$documents'
        }
      }
    ]).exec();
  }
}
