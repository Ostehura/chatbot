import { Module } from '@nestjs/common';
import { MistralService } from './mistral.service';
import { MistralController } from './mistral.controller';

@Module({
  controllers: [MistralController],
  providers: [
    {
      provide: MistralService,
      useFactory: () => new MistralService('iHMP6DahaEsZRaBblYOfOSvgaONnJFMg'), // api key should be kept in .env file
    },
  ],
  exports: [MistralService],
})
export class MistralModule {}
