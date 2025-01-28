import { Module } from "@nestjs/common";
import { MistralService } from "./mistral.service";
import { MistralController } from "./mistral.controller";

@Module({
  controllers: [MistralController],
  providers: [
    {
      provide: MistralService,
      useFactory: () => new MistralService(process.env.MISTRAL_API_KEY), // api key should be kept in .env file
    },
  ],
})
export class MistralModule {}
