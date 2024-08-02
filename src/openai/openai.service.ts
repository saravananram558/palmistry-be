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
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { join } from 'path';


@Injectable()
export class OpenaiService {
  private readonly openaiApiKey: string;
  private readonly chatAssistantId: string;
  constructor(private configService: ConfigService) {
    this.openaiApiKey = this.configService.get<string>('OPENAI_API_KEY');
    this.chatAssistantId = this.configService.get<string>('CHAT_ASSISTANT_ID');


       // Configuration
   cloudinary.config({ 
    cloud_name: 'du0ghajsy', 
    api_key: '622758451819737', 
    api_secret: 'STtN3dPmIM_LU2A54uwNWJafFO8' // Click 'View Credentials' below to copy your API secret
});
}

// async  publicImages(imagePath: string) {
//   try {
//     // Read the local image file
//     const fileStream = fs.createReadStream(imagePath);

//     // Upload the image to Cloudinary
//     const uploadResult = await cloudinary.uploader.upload_stream({ 
//       public_id: path.basename(imagePath, path.extname(imagePath)), // Use the file name without extension as the public_id
//       folder: 'your-folder-name' // Optional: specify a folder to organize images
//     }, (error, result) => {
//       if (error) {
//         throw new Error(`Failed to upload image: ${error.message}`);
//       }
//       return result;
//     });

//     // Pass the file stream to Cloudinary
//     fileStream.pipe(uploadResult);

//     // Wait for upload to complete
//     const uploadResponse = await new Promise((resolve, reject) => {
//       uploadResult.on('finish', () => resolve(uploadResult));
//       uploadResult.on('error', reject);
//     });

//     console.log('Upload Result:', uploadResponse);

//     // Optimize delivery by resizing and applying auto-format and auto-quality
//     const optimizeUrl = cloudinary.url(uploadResponse.public_id, {
//       fetch_format: 'auto',
//       quality: 'auto'
//     });

//     console.log('Optimized URL:', optimizeUrl);

//     // Transform the image: auto-crop to square aspect_ratio
//     const autoCropUrl = cloudinary.url(uploadResponse.public_id, {
//       crop: 'fill',
//       gravity: 'auto',
//       width: 500,
//       height: 500
//     });

//     console.log('Auto-cropped URL:', autoCropUrl);

//     return {
//       optimizeUrl,
//       autoCropUrl
//     };
//   } catch (error) {
//     console.error('Error processing image:', error);
//     throw error;
//   }
// }




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
    const ext = path.extname(imagePath).toLowerCase();
    let mimeType = 'image/jpeg'; // Default MIME type
    
    if (ext === '.png') mimeType = 'image/png';
    else if (ext === '.gif') mimeType = 'image/gif';
    // Add other formats if needed

    return `data:${mimeType};base64,${data.toString('base64')}`;
  } catch (error) {
    throw new Error(`Failed to read image file: ${error.message}`);
  }
}

async publicImages(imagePath: string) {
  console.log(imagePath,'imagePath')
  // Ensure the correct file path without redundant directory segments
  const filePath = join('/home/finstein-emp/Documents/palmistory-BE/palmistry-be/uploads', imagePath);

  // Check if the file exists before uploading to Cloudinary
  try {
    // Perform file existence check
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploader.upload(filePath, {
      public_id: 'palm',
    });

    console.log(uploadResult, 'Cloudinary upload result');

    // Return the URL of the uploaded image
    const optimizeUrl = cloudinary.url('palm', {
      fetch_format: 'auto',
      quality: 'auto',
    });

    return optimizeUrl;
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
}

// async  publicImage(imagepath) {
  
//   console.log(imagepath,'imagepath  checks')

//   const fileExtension = imagepath.split('.').pop().toLowerCase();

//   const uploadResult = await cloudinary.uploader
//       .upload(imagepath, {
//           public_id: 'palm',
//       })
//       .catch((error) => {
//           console.log(error);
//       });

//   console.log(uploadResult,'result$$$$');






//   return uploadResult.secure_url; // or autoCropUrlWithExtension based on your requirement
// }

async  publicImage(imagepath: string): Promise<string | undefined> {
  console.log(imagepath, 'imagepath checks');
  try {
      const uploadResult: UploadApiResponse = await cloudinary.uploader.upload(imagepath, {
          public_id: 'palm',
      });

      console.log(uploadResult, 'result$$$$');
      
      // Ensure uploadResult is not undefined and has secure_url
      if (uploadResult && uploadResult.secure_url) {
          return uploadResult.secure_url;
      } else {
          console.error('Upload result does not contain secure_url');
          return undefined;
      }
  } catch (error) {
      console.error('Error uploading image:', error);
      return undefined;
  }
}

// async storedFileData(){
//   const openai = new OpenAI({ apiKey: this.openaiApiKey });
//   // A user wants to attach a file to a specific message, let's upload it.
//   // Step 1: Upload a File with an "assistants" purpose
// const aapl10k = await openai.files.create({
//   file: fs.createReadStream("edgar/aapl-10k.pdf"),
//   purpose: "assistants",
// });

// // Step 2: Create an Assistant
// const assistant = await openai.beta.assistants.create({
//   name: "Financial Analyst Assistant",
//   instructions: "You are an expert financial analyst. Use you knowledge base to answer questions about audited financial statements.",
//   model: "gpt-4o",
//   tools: [{ type: "file_search" }],
// });

// // Step 3: Create a Thread
// const thread = await openai.beta.threads.create({
//   messages: [
//     {
//       role: "user",
//       content:
//         "How many shares of AAPL were outstanding at the end of of October 2023?",
//       // Attach the new file to the message.
//       attachments: [{ file_id: aapl10k.id, tools: [{ type: "file_search" }] }],
//     },
//   ],
// });

// // Step 4: Run the Assistant
// const run = await openai.beta.threads.runs.createAndPoll(thread.id, {
//   assistant_id: assistant.id,
// })

//   // Step 5: Periodically retrieve the Run to check on its status to see if it has moved to completed
//   const messages = await openai.beta.threads.messages.list(thread.id, {
//     run_id: run.id,
//   });


//   const message = messages.data.pop()!;
// if (message.content[0].type === "text") {
//   const { text } = message.content[0];
//   const { annotations } = text;
//   const citations: string[] = [];

//   let index = 0;
//   for (let annotation of annotations) {
//     text.value = text.value.replace(annotation.text, "[" + index + "]");
//     const { file_citation } = annotation;
//     if (file_citation) {
//       const citedFile = await openai.files.retrieve(file_citation.file_id);
//       citations.push("[" + index + "]" + citedFile.filename);
//     }
//     index++;
//   }

//   console.log(text.value);
//   console.log(citations.join("\n"));

// }

// }


async  setupAssistantAndRunQuery(url) {

  const openai = new OpenAI({ apiKey: this.openaiApiKey });
  try {
  
    const file:any = await openai.files.create({
      file: fs.createReadStream(url),
      purpose: "assistants",
    })
    
  console.log(file,'file checks')
  } catch (error) {
    console.error('Error during setup and query:', error);
  }
}




async getPalmImgDetails(imagePath: string){
  const openai = new OpenAI({ apiKey: this.openaiApiKey });
  const imgUrl = await this.publicImage(imagePath);
  this.setupAssistantAndRunQuery(imagePath)
  console.log(imgUrl,'imgUrl checks')
  // Define the URL to use in the API request
  const url = imgUrl; // Use the URL obtained from publicImage
  // const url = "https://i.postimg.cc/43xHG1XZ/ss.jpg"
  // console.log('Base64 Image:', base64Image.substring(0, 100)); // Log only the beginning of the Base64 string for debugging
  // const url= 'https://media.istockphoto.com/id/179042818/photo/man-performing-stop-gesture-with-hand.jpg?s=2048x2048&w=is&k=20&c=BHZ9aAshr4aF-NNVP_Z7xSywy9isfvrS6iAy6xyzLEo='
  // const url = 'https://thumbs.dreamstime.com/z/female-palm-15629687.jpg?ct=jpeg'
  // const url = 'https://img.freepik.com/premium-photo/hand-palm-raised-up-white-background_326533-1325.jpg?w=740'
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
