import { Controller, Post, Body, HttpException, HttpStatus } from "@nestjs/common";
import { MistralService } from "./mistral.service";

class MistralRequestDto {
  prompt: string;
}

@Controller("mistral")
export class MistralController {
  constructor(private readonly mistralService: MistralService) {}

  @Post("response")
  async getMistralResponse(@Body() body: MistralRequestDto) {
    const { prompt } = body;
    if (!prompt) {
      throw new HttpException("Prompt is required.", HttpStatus.BAD_REQUEST);
    }

    try {
      const response = await this.mistralService.getResponse(prompt);
      return { response };
    } catch (error) {
      console.error("Error in MistralController:", error.message);
      throw new HttpException(
        "Failed to fetch response from Mistral API.",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
