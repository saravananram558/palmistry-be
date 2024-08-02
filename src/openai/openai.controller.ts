import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { OpenaiService } from './openai.service';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { UpdateOpenaiDto } from './dto/update-openai.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path'; // Importing 'path' module
import { v4 as uuidv4 } from 'uuid'; // Named import for the UUID function
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs';




@Controller('openai')
@ApiBearerAuth()
@ApiTags("openai") 
export class OpenaiController {
  constructor(private readonly openaiService: OpenaiService) {}




  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  // @UseInterceptors(FileInterceptor('file', {
  //   storage: diskStorage({
  //     destination: './uploads',
  //     filename: (req, file, cb) => {
  //       const filename = path.parse(file.originalname).name.replace(/\s/g, '') + uuidv4();
  //       const extension = path.parse(file.originalname).ext;
  //       cb(null, `${filename}${extension}`);
  //     },
  //   }),
  // }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {

    console.log(file,'file checks')
       const savePath = path.join(
      '/home/finstein-emp/Documents/palmistory-BE/palmistry-be/uploads',
      file.originalname,
    );

    if (!file) {
      throw new BadRequestException('File is missing');
    }
console.log(file,'file checks')
    console.log('File path:', savePath); // Debugging line to check file path

    try {
      fs.writeFileSync(savePath, file.buffer);
      console.log('inside try')
      const result = await this.openaiService.getPalmImgDetails(savePath);
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

