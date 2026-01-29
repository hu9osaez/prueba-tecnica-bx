import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';

import { VotesService } from './votes.service';
import { CreateVoteDto, CreateManualVoteDto } from './dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @Throttle({
    default: {
      limit: 20,
      ttl: 60000,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async createVote(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(
      createVoteDto.characterId,
      createVoteDto.voteType,
    );
  }

  @Post('manual')
  @Throttle({
    default: {
      limit: 20,
      ttl: 60000,
    },
  })
  @HttpCode(HttpStatus.CREATED)
  async createManualVote(@Body() createManualVoteDto: CreateManualVoteDto) {
    return this.votesService.createManual(
      createManualVoteDto.characterName,
      createManualVoteDto.source,
      createManualVoteDto.voteType,
    );
  }
}
