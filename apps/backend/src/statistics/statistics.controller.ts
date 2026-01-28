import { Controller, Get } from '@nestjs/common';

import { StatisticsService } from './statistics.service';
import {
  MostLikedResponseDto,
  MostDislikedResponseDto,
  LastEvaluatedResponseDto,
  PikachuStatsResponseDto,
} from './dto';

@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('most-liked')
  async getMostLiked(): Promise<MostLikedResponseDto | null> {
    return this.statisticsService.getMostLiked();
  }

  @Get('most-disliked')
  async getMostDisliked(): Promise<MostDislikedResponseDto | null> {
    return this.statisticsService.getMostDisliked();
  }

  @Get('last-evaluated')
  async getLastEvaluated(): Promise<LastEvaluatedResponseDto | null> {
    return this.statisticsService.getLastEvaluated();
  }

  @Get('pikachu')
  async getPikachuStats(): Promise<PikachuStatsResponseDto> {
    return this.statisticsService.getPikachuStats();
  }
}
