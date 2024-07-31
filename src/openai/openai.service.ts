import { Injectable } from '@nestjs/common';
import { CreateOpenaiDto } from './dto/create-openai.dto';
import { UpdateOpenaiDto } from './dto/update-openai.dto';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { createReadStream, createWriteStream } from 'fs';
import * as path from 'path';
import * as FormData from 'form-data';
import * as fs from 'fs';
import OpenAI from 'openai';

@Injectable()
export class OpenaiService {
  private readonly openaiApiKey: string;
  private readonly chatAssistantId: string;
  constructor(private configService: ConfigService) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.chatAssistantId = this.configService.get<string>('CHAT_ASSISTANT_ID');
}



async createThreadId(): Promise<string> {
  try {
    const openai = new OpenAI({ apiKey: this.openaiApiKey });

    // Assuming the method for creating threads is available
    const response = await openai.beta.threads.create(); // Adjust based on the actual method

    console.log('Thread created:', response);
    return response.id; // Adjust based on actual response
  } catch (error) {
    console.error('Error creating thread:', error.response ? error.response.data : error.message);
    throw new Error('Failed to create thread');
  }
}


async encodeImage(imagePath: string): Promise<string> {
  try {
    const data = await fs.promises.readFile(imagePath);
    return `data:image/jpeg;base64,${data.toString('base64')}`;
  } catch (error) {
    throw new Error(`Failed to read image file: ${error.message}`);
  }
}


async getImageDetails(imagePath: string){
  const openai = new OpenAI({ apiKey: this.openaiApiKey });

  console.log(imagePath,'imagepath checks')
  const file = await openai.files.create({
    file: fs.createReadStream('/home/finstein-emp/Documents/palmistory-BE/palmistry-be/assets/palm-reas.jpeg'),
    purpose: "vision",
  });
  console.log(file,'file checks')
    // Use a publicly accessible URL for comparison
    const referenceImageUrl = "https://example.com/reference-image.jpeg"; // Replace with actual URL
  const thread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": [
          {
            "type": "text",
            "text": "What is the difference between these images?"
          },
          {
            "type": "image_url",
            "image_url": {"url": referenceImageUrl}
          },
          {
            "type": "image_file",
            "image_file": {"file_id": file.id}
          },
        ],
        
      }
    ],
  });

  console.log(thread, 'thread checks');
  // return thread;
  // Check for results (example, adjust according to API documentation)
  const stream = await openai.beta.threads.runs.stream(thread.id, {
    assistant_id: this.chatAssistantId
  });

  console.log(stream, 'stream checks');
  let assistantOutput = '';
  // Handle the streaming response
  assistantOutput = await new Promise<string>((resolve, reject) => {
    stream
      .on('textCreated', (text) => {
        console.log('\nassistant >', text); // Adjust if needed
      })
      .on('textDelta', (textDelta) => {
        assistantOutput += textDelta.value;
      })
      .on('end', () => {
        resolve(assistantOutput);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
  console.log(assistantOutput, 'stream checks');
  return assistantOutput;
  // return results;
}



async getPalmImgDetails(imagePath: string){
  const openai = new OpenAI({ apiKey: this.openaiApiKey });
  const base64Image = await this.encodeImage(imagePath);
  // const url = "https://i.postimg.cc/43xHG1XZ/ss.jpg"
  console.log('Base64 Image:', base64Image.substring(0, 100)); // Log only the beginning of the Base64 string for debugging
  // const url= 'https://media.istockphoto.com/id/179042818/photo/man-performing-stop-gesture-with-hand.jpg?s=2048x2048&w=is&k=20&c=BHZ9aAshr4aF-NNVP_Z7xSywy9isfvrS6iAy6xyzLEo='
  // const url = 'https://thumbs.dreamstime.com/z/female-palm-15629687.jpg?ct=jpeg'
  const url = 'https://img.freepik.com/premium-photo/hand-palm-raised-up-white-background_326533-1325.jpg?w=740'
  // const url = 'https://media.istockphoto.com/id/1359481287/photo/shot-of-an-unrecognizable-man-showing-his-palm-against-a-white-background.jpg?s=2048x2048&w=is&k=20&c=NJrOOlqKO7haktpFzvNVkP7ne9f_O-oTPO3lgTBPbO4='
  const thread = await openai.beta.threads.create({
    messages: [
      {
        "role": "user",
        "content": [
            {
              "type": "text",
              "text": "Explain about Palm?"
            },
            {
              "type": "image_url",
              "image_url": {
                "url": url,
                "detail": "high"
              }
            },
        ]
      }
    ]
  });
  // return thread;
  const stream = await openai.beta.threads.runs.stream(thread.id, {
    assistant_id: this.chatAssistantId
  });

  console.log(stream, 'stream checks');
  let assistantOutput = '';
  // Handle the streaming response
  assistantOutput = await new Promise<string>((resolve, reject) => {
    stream
      .on('textCreated', (text) => {
        console.log('\nassistant >', text); // Adjust if needed
      })
      .on('textDelta', (textDelta) => {
        assistantOutput += textDelta.value;
      })
      .on('end', () => {
        resolve(assistantOutput);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
  console.log(assistantOutput, 'stream checks');
  return assistantOutput;
}







async analyzeImage(imagePath: string): Promise<any> {
  console.log(imagePath,'imagePath checks in service')
  const base64Image = await this.encodeImage('/home/finstein-emp/Documents/palmistory-BE/palmistry-be/assets/palm-reas.jpeg');
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${this.openaiApiKey}`,
  };

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: "What’s in this image?"
          },
          {
            type: 'image_url',
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 300,
  };
console.log(payload,'payload checks')
  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', payload, { headers });
    console.log(response,'response checks')
    return response.data;
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    throw new Error('Failed to analyze image');
  }
}

async analyzeImages(imagePath: string): Promise<any> {
  console.log(imagePath, 'imagePath checks in service');
  const base64Image = await this.encodeImage(imagePath);
  console.log('Base64 Image:', base64Image.substring(0, 100)); // Log only the beginning of the Base64 string for debugging
  // const payload = {
  //   model: 'gpt-4o-mini',
  //   messages: [
  //     {
  //       role: 'user',
  //       content: [
  //         {
  //           type: 'text',
  //           text: 'What’s in this image?',
  //         },
  //         {
  //           type: 'image_url',
  //           image_url: {
  //             url: `data:image/jpeg;base64,${base64Image}`,
  //             detail: 'low',
  //           },
  //         },
  //       ],
  //     },
  //   ],
  //   max_tokens: 300,
  // };

  // console.log(payload, 'payload checks');

  try {
    const response = await  new OpenAI().chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "What’s in this image?" },
            {
              type: "image_url",
              image_url: {
                "url": "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Gfp-wisconsin-madison-the-nature-boardwalk.jpg/2560px-Gfp-wisconsin-madison-the-nature-boardwalk.jpg",
                "detail": "low"
              },
            },
            // {
            //   type: 'image_url',
            //   image_url: {
            //     url: base64Image,
            //     detail: 'low',
            //   },
            // },
          ],
        },
      ],
    });
    console.log(response, 'response checks');
    return response.choices[0];
  } catch (error) {
    console.error('Error analyzing image:', error.message);
    throw new Error('Failed to analyze image');
  }
}



async processImage(prompt: string): Promise<any> {
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/images/generations', // Correct endpoint for generating images
      {
        prompt: prompt, // Use the prompt to generate the image
        n: 1, // Number of images to generate
        size: '1024x1024' // Size of the generated image
      },
      {
        headers: {
          'Authorization': `Bearer ${this.openaiApiKey}`,
          'Content-Type': 'application/json'
        }
      }
    );
 // Check if the response status is 200
 if (response.status === 200 && response.data.data.length > 0) {
  // Extract the image URL
  const imageDetails = response.data.data[0];

      // Log the image details
      console.log('Generated Image Details:', imageDetails);
      return imageDetails;
} else {
  console.error('No images generated or unexpected response status');
}
  } 
  catch (error) {
    console.error('Error generating image:', error.response ? error.response.data : error.message);
    throw new Error('Failed to generate image');
  }
}

// async getAssistantOutput(prompt: string, threadId: string): Promise<string> {
//   try {
//     // Sending a message to the assistant
//     await axios.post(
//       `https://api.openai.com/v1/threads/${threadId}/messages`,
//       {
//         role: 'user',
//         content: prompt
//       },
//       {
//         headers: {
//           'Authorization': `Bearer ${this.openaiApiKey}`
//         }
//       }
//     );

//     // Retrieve the assistant's response
//     const response = await axios.get(
//       `https://api.openai.com/v1/threads/${threadId}/messages`,
//       {
//         headers: {
//           'Authorization': `Bearer ${this.openaiApiKey}`
//         }
//       }
//     );

//     // Process the response to extract text
//     const messages = response.data.messages;
//     const assistantOutput = messages
//       .filter(msg => msg.role === 'assistant')
//       .map(msg => msg.content)
//       .join('\n');

//     return assistantOutput;
//   } catch (error) {
//     console.error('Error getting assistant output:', error.response ? error.response.data : error.message);
//     throw new Error('Failed to get assistant output');
//   }
// }

async getAssistantOutput(prompt: string, threadId: string): Promise<string> {
  let assistantOutput = '';
  const openai = new OpenAI({ apiKey: this.openaiApiKey });

  try {
    // Send a message to the assistant
    await openai.beta.threads.messages.create(threadId, {
      role: 'user',
      content: prompt
    });

    // Start streaming responses
    const stream = await openai.beta.threads.runs.stream(threadId, {
      assistant_id: this.chatAssistantId
    });

    // Handle the streaming response
    assistantOutput = await new Promise<string>((resolve, reject) => {
      stream
        .on('textCreated', (text) => {
          console.log('\nassistant >', text); // Adjust if needed
        })
        .on('textDelta', (textDelta) => {
          assistantOutput += textDelta.value;
        })
        .on('end', () => {
          resolve(assistantOutput);
        })
        .on('error', (err) => {
          reject(err);
        });
    });

    return assistantOutput;

  } catch (error) {
    console.error('Error getting assistant output:', error.response ? error.response.data : error.message);
    throw new Error('Failed to get assistant output');
  }
}


  create(createOpenaiDto: CreateOpenaiDto) {
    return 'This action adds a new openai';
  }

  findAll() {
    return `This action returns all openai`;
  }

  findOne(id: number) {
    return `This action returns a #${id} openai`;
  }

  update(id: number, updateOpenaiDto: UpdateOpenaiDto) {
    return `This action updates a #${id} openai`;
  }

  remove(id: number) {
    return `This action removes a #${id} openai`;
  }
}
