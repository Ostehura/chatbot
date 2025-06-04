import fetch from 'node-fetch';
import { Mistral } from '@mistralai/mistralai';
import { ContentChunk } from '@mistralai/mistralai/models/components/contentchunk.js';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from 'src/message/message.entity';
import { Repository } from 'typeorm';
import { Role } from '@mistralai/mistralai/models/components';

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

interface MistralRequestOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
  prompt: string;
}

// MistralService to handle API interactions
@Injectable()
export class MistralService {
  private readonly apiUrl: string = 'https://api.mistral.ai/v1/completions';
  private readonly maxRetries: number = 3;

  constructor(private readonly apiKey: string) {
    this.apiKey = apiKey;
  }

  async getResponse(
    messages: Message[],
    options: Partial<MistralRequestOptions> = {},
  ): Promise<string> {
    let retryCount = 0;

    while (retryCount < this.maxRetries) {
      try {
        // Send the request to the MistralAI API
        const client = new Mistral({ apiKey: this.apiKey });

        // Other free models: https://mistral.ai/technology/#pricing
        const modelResponse = await client.chat.complete({
          model: 'open-mixtral-8x22b',
          messages: messages.map((m) => {
            return {
              content: m.text,
              role:
                m.author > 0 ? 'user' : m.author == 0 ? 'assistant' : 'system',
            };
          }),
        });

        const modelResponseContent =
          modelResponse.choices[0].message.content.toString();

        return modelResponseContent.toString();
      } catch (error: any) {
        if (error.message.includes('429')) {
          // Handle rate limit error with exponential backoff
          retryCount++;
          const delay = Math.pow(2, retryCount) * 1000;
          console.log(
            `Rate limited! Retrying after ${delay / 1000} seconds...`,
          );
          await sleep(delay);
        } else {
          console.error('Error in MistralService:', error.message);
          throw error;
        }
      }
    }

    throw new Error('Max retries reached. Please try again later.');
  }
}
