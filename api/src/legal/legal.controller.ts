import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { LegalService } from './legal.service';
import { CreateLegalDto } from './dto/create-legal.dto';
import { UpdateLegalDto, UpdateDocumentDto, AddDocumentDto } from './dto/update-legal.dto';
import { AuthRequired } from '../auth/decorators/auth-required.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('legal')
@AuthRequired()
export class LegalController {
  constructor(private readonly legalService: LegalService) { }

  @Post()
  create(@Body() createLegalDto: CreateLegalDto) {
    return this.legalService.create(createLegalDto);
  }

  @Get()
  findAll() {
    return this.legalService.findAll();
  }

  @Get('user/:userId')
  findByUserId(@Param('userId') userId: string) {
    return this.legalService.findByUserId(userId);
  }

  @Get('documents/status/:status')
  getDocumentsByStatus(@Param('status') status: 'pending' | 'done' | 'expired') {
    return this.legalService.getDocumentsByStatus(status);
  }

  @Get('documents/type/:type')
  getDocumentsByType(@Param('type') type: string) {
    return this.legalService.getDocumentsByType(type);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.legalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLegalDto: UpdateLegalDto) {
    return this.legalService.update(id, updateLegalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.legalService.remove(id);
  }

  // Document management endpoints
  @Post(':id/documents')
  addDocument(@Param('id') id: string, @Body() addDocumentDto: AddDocumentDto) {
    return this.legalService.addDocument(id, addDocumentDto);
  }

  @Patch(':id/documents/:documentId')
  updateDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string,
    @Body() updateDocumentDto: UpdateDocumentDto
  ) {
    return this.legalService.updateDocument(id, documentId, updateDocumentDto);
  }

  @Delete(':id/documents/:documentId')
  removeDocument(
    @Param('id') id: string,
    @Param('documentId') documentId: string
  ) {
    return this.legalService.removeDocument(id, documentId);
  }

  // AI Agent specific endpoints
  @Post('agent/initialize')
  async initializeForUser(@Body() body: { userId: string; school: string }) {
    return this.legalService.initializeLegalDocumentsForUser(body.userId, body.school);
  }

  @Patch('agent/:userId/document/:documentName/status')
  async updateDocumentStatus(
    @Param('userId') userId: string,
    @Param('documentName') documentName: string,
    @Body() body: { status: 'pending' | 'done' | 'expired'; note?: string }
  ) {
    return this.legalService.updateDocumentStatusByName(userId, documentName, body.status, body.note);
  }

  @Get('agent/:userId/pending')
  async getPendingDocuments(@Param('userId') userId: string) {
    return this.legalService.getPendingDocuments(userId);
  }

  @Get('agent/:userId/completed')
  async getCompletedDocuments(@Param('userId') userId: string) {
    return this.legalService.getCompletedDocuments(userId);
  }

  @Get('agent/:userId/progress')
  async getDocumentProgress(@Param('userId') userId: string) {
    return this.legalService.getDocumentProgress(userId);
  }

  @Get('agent/school/:school/requirements')
  async getSchoolRequirements(@Param('school') school: string) {
    return this.legalService.getRequiredDocumentsForSchool(school);
  }

  @Post('agent/:userId/add-documents')
  async addMissingDocuments(
    @Param('userId') userId: string,
    @Body() body: { documentNames: string[] }
  ) {
    return this.legalService.addMissingDocuments(userId, body.documentNames);
  }
}
