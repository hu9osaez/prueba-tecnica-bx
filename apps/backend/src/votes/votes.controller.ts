import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';

import { VotesService } from './votes.service';
import { CreateVoteDto, CreateManualVoteDto } from './dto';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createVote(@Body() createVoteDto: CreateVoteDto) {
    return this.votesService.create(
      createVoteDto.characterId,
      createVoteDto.voteType,
    );
  }

  @Post('manual')
  @HttpCode(HttpStatus.CREATED)
  async createManualVote(@Body() createManualVoteDto: CreateManualVoteDto) {
    return this.votesService.createManual(
      createManualVoteDto.characterName,
      createManualVoteDto.source,
      createManualVoteDto.voteType,
    );
  }
}
