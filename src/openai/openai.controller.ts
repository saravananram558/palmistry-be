import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { UpdateOpenaiDto } from './dto/update-openai.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path from 'path';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('openai')
@ApiBearerAuth()
@ApiTags("pincone") 
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}


  @Post('upload')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, cb) => {
        const filename = path.parse(file.originalname).name.replace(/\s/g, '') + uuid();
        const extension = path.parse(file.originalname).ext;
        cb(null, `${filename}${extension}`);
      },
    }),
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File, @Body('prompt') prompt: string) {
    if (!file) {
      throw new BadRequestException('File is missing');
    }

    console.log('File path:', file.path); // Debugging line to check file path

    try {
      console.log('inside try')
      const result = await this.openaiService.analyzeImage(file.path);
      console.log(result,'result checksd')
      return result;
    } catch (error) {
      console.error('Error processing image:', error.message, error.stack);
      throw new BadRequestException('Failed to process image');
    }
  }

    @Post('chat')
    async chat(@Body('prompt') prompt: string, @Body('threadId') threadId: string) {
        const response = await this.openaiService.getAssistantOutput(prompt, threadId);
        return response;
    }


    @Get('create-thread')
    async createThread() {
      console.log('inside fun@@')
        const threadId = await this.openaiService.createThreadId();
        return { threadId };
    }

  @Post()
  create(@Body() createOpenaiDto: CreateOpenaiDto) {
    return this.openaiService.create(createOpenaiDto);
  }

  @Get()
  findAll() {
    return this.openaiService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.openaiService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOpenaiDto: UpdateOpenaiDto) {
    return this.openaiService.update(+id, updateOpenaiDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.openaiService.remove(+id);
  }
}
function uuid() {
  throw new Error('Function not implemented.');
}

