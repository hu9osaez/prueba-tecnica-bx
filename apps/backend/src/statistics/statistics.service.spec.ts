import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { StatisticsService } from './statistics.service';
import { Vote, VoteDocument } from '../votes/schemas';
import { CharacterDocument } from '../characters/schemas';
import { CharactersService } from '../characters/characters.service';

// Factory Pattern for Mock Data
const getMockCharacter = (
  overrides?: Partial<CharacterDocument>,
): CharacterDocument => {
  return {
    _id: new Types.ObjectId(),
    externalId: 'test-123',
    name: 'Test Character',
    source: 'pokemon',
    imageUrl: 'https://example.com/image.png',
    createdAt: new Date(),
    updatedAt: new Date(),
    ...overrides,
  } as CharacterDocument;
};

const getMockVote = (overrides?: Partial<Vote>): VoteDocument => {
  return {
    _id: new Types.ObjectId(),
    characterId: new Types.ObjectId(),
    characterName: 'Test Character',
    source: 'pokemon',
    voteType: 'like',
    votedAt: new Date(),
    ...overrides,
  } as VoteDocument;
};

describe('StatisticsService', () => {
  let service: StatisticsService;
  let mockVoteModel: any;
  let mockCharacterModel: any;
  let mockCharactersService: jest.Mocked<CharactersService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create mock vote model
    mockVoteModel = {
      aggregate: jest.fn(),
      find: jest.fn(),
      findOne: jest.fn(),
      countDocuments: jest.fn(),
    };

    // Create mock character model
    mockCharacterModel = {
      findById: jest.fn(),
      aggregate: jest.fn(),
    };

    // Create mock characters service
    mockCharactersService = {
      findOrFetchByName: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StatisticsService,
        {
          provide: 'VoteModel',
          useValue: mockVoteModel,
        },
        {
          provide: 'CharacterModel',
          useValue: mockCharacterModel,
        },
        {
          provide: CharactersService,
          useValue: mockCharactersService,
        },
      ],
    }).compile();

    service = module.get<StatisticsService>(StatisticsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getMostLiked', () => {
    it('should return character with most likes', async () => {
      const characterId = new Types.ObjectId();
      const mockCharacter = getMockCharacter({
        _id: characterId,
        name: 'Pikachu',
      });

      const aggregateResult = [
        {
          _id: characterId,
          count: 10,
          characterName: 'Pikachu',
          source: 'pokemon',
        },
      ];

      mockVoteModel.aggregate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(aggregateResult),
      });

      const mockFindQuery = {
        exec: jest.fn().mockResolvedValue(mockCharacter),
      };

      mockCharacterModel.findById = jest.fn().mockReturnValue(mockFindQuery);

      const result = await service.getMostLiked();

      expect(mockVoteModel.aggregate).toHaveBeenCalled();
      expect(result).toBeDefined();
      expect(result?.character.name).toBe('Pikachu');
      expect(result?.likes).toBe(10);
    });

    it('should return null when no votes exist', async () => {
      mockVoteModel.aggregate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getMostLiked();

      expect(result).toBeNull();
      expect(mockCharacterModel.findById).not.toHaveBeenCalled();
    });

    it('should return null when character not found', async () => {
      const characterId = new Types.ObjectId();

      const aggregateResult = [
        {
          _id: characterId,
          count: 5,
          characterName: 'Unknown',
          source: 'pokemon',
        },
      ];

      mockVoteModel.aggregate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(aggregateResult),
      });

      const mockFindQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      mockCharacterModel.findById = jest.fn().mockReturnValue(mockFindQuery);

      const result = await service.getMostLiked();

      expect(result).toBeNull();
    });

    it('should handle errors in getMostLiked', async () => {
      mockVoteModel.aggregate = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Aggregation error')),
      });

      await expect(service.getMostLiked()).rejects.toThrow('Aggregation error');
    });
  });

  describe('getMostDisliked', () => {
    it('should return character with most dislikes', async () => {
      const characterId = new Types.ObjectId();
      const mockCharacter = getMockCharacter({
        _id: characterId,
        name: 'Charizard',
      });

      const aggregateResult = [
        {
          _id: characterId,
          count: 8,
          characterName: 'Charizard',
          source: 'pokemon',
        },
      ];

      mockVoteModel.aggregate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(aggregateResult),
      });

      const mockFindQuery = {
        exec: jest.fn().mockResolvedValue(mockCharacter),
      };

      mockCharacterModel.findById = jest.fn().mockReturnValue(mockFindQuery);

      const result = await service.getMostDisliked();

      expect(result).toBeDefined();
      expect(result?.character.name).toBe('Charizard');
      expect(result?.dislikes).toBe(8);
    });

    it('should return null when no dislike votes exist', async () => {
      mockVoteModel.aggregate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await service.getMostDisliked();

      expect(result).toBeNull();
    });

    it('should handle errors in getMostDisliked', async () => {
      mockVoteModel.aggregate = jest.fn().mockReturnValue({
        exec: jest.fn().mockRejectedValue(new Error('Database error')),
      });

      await expect(service.getMostDisliked()).rejects.toThrow('Database error');
    });
  });

  describe('getLastEvaluated', () => {
    it('should return the most recent vote', async () => {
      const mockVote = getMockVote({
        voteType: 'like',
        characterName: 'Mewtwo',
        source: 'pokemon',
        votedAt: new Date('2024-01-15T10:00:00Z'),
      });

      const mockCharacter = getMockCharacter({
        name: 'Mewtwo',
        imageUrl: 'https://example.com/mewtwo.png',
      });

      const mockFindQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockVote),
      };

      mockVoteModel.findOne = jest.fn().mockReturnValue(mockFindQuery);

      const mockCharacterQuery = {
        exec: jest.fn().mockResolvedValue(mockCharacter),
      };

      mockCharacterModel.findById = jest
        .fn()
        .mockReturnValue(mockCharacterQuery);

      const result = await service.getLastEvaluated();

      expect(result).toBeDefined();
      expect(result?.vote.character.name).toBe('Mewtwo');
      expect(result?.vote.voteType).toBe('like');
    });

    it('should return null when no votes exist', async () => {
      const mockFindQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(null),
      };

      mockVoteModel.findOne = jest.fn().mockReturnValue(mockFindQuery);

      const result = await service.getLastEvaluated();

      expect(result).toBeNull();
      expect(mockCharacterModel.findById).not.toHaveBeenCalled();
    });

    it('should handle errors in getLastEvaluated', async () => {
      const mockFindQuery = {
        populate: jest.fn().mockReturnThis(),
        sort: jest.fn().mockReturnThis(),
        lean: jest.fn().mockReturnThis(),
        exec: jest.fn().mockRejectedValue(new Error('Query error')),
      };

      mockVoteModel.findOne = jest.fn().mockReturnValue(mockFindQuery);

      await expect(service.getLastEvaluated()).rejects.toThrow('Query error');
    });
  });

  describe('getPikachuStats', () => {
    it('should return Pikachu stats with votes', async () => {
      const mockPikachu = getMockCharacter({
        name: 'Pikachu',
        externalId: 'pikachu',
        source: 'pokemon',
        imageUrl: 'https://example.com/pikachu.png',
      });

      const mockVotes = [
        getMockVote({
          voteType: 'like',
          votedAt: new Date('2024-01-10T10:00:00Z'),
        }),
        getMockVote({
          voteType: 'dislike',
          votedAt: new Date('2024-01-12T14:00:00Z'),
        }),
        getMockVote({
          voteType: 'like',
          votedAt: new Date('2024-01-14T09:00:00Z'),
        }),
      ];

      mockCharactersService.findOrFetchByName.mockResolvedValue(mockPikachu);

      const mockFindQuery = {
        exec: jest.fn().mockResolvedValue(mockVotes),
      };

      mockVoteModel.find = jest.fn().mockReturnValue(mockFindQuery);

      const result = await service.getPikachuStats();

      expect(mockCharactersService.findOrFetchByName).toHaveBeenCalledWith(
        'pikachu',
        'pokemon',
      );
      expect(result.character.name).toBe('Pikachu');
      expect(result.character.exists).toBe(true);
      expect(result.character.imageUrl).toBeDefined();
      expect(result.statistics).toBeDefined();
      expect(result.statistics?.likes).toBe(2);
      expect(result.statistics?.dislikes).toBe(1);
      expect(result.statistics?.netScore).toBe(1);
      expect(result.statistics?.totalVotes).toBe(3);
    });

    it('should return Pikachu character without stats when no votes exist', async () => {
      const mockPikachu = getMockCharacter({
        name: 'Pikachu',
        externalId: 'pikachu',
        source: 'pokemon',
      });

      mockCharactersService.findOrFetchByName.mockResolvedValue(mockPikachu);

      const mockFindQuery = {
        exec: jest.fn().mockResolvedValue([]),
      };

      mockVoteModel.find = jest.fn().mockReturnValue(mockFindQuery);

      const result = await service.getPikachuStats();

      expect(result.character.name).toBe('Pikachu');
      expect(result.character.exists).toBe(true);
      expect(result.statistics).toBeUndefined();
    });

    it('should return Pikachu with exists=false when character not found', async () => {
      mockCharactersService.findOrFetchByName.mockResolvedValue(null);

      const mockFindQuery = {
        exec: jest.fn().mockResolvedValue([]),
      };

      mockVoteModel.find = jest.fn().mockReturnValue(mockFindQuery);

      const result = await service.getPikachuStats();

      expect(result.character.name).toBe('Pikachu');
      expect(result.character.exists).toBe(false);
      expect(result.statistics).toBeUndefined();
    });

    it('should calculate correct timestamps for votes', async () => {
      const mockPikachu = getMockCharacter({ name: 'Pikachu' });

      const firstVoteDate = new Date('2024-01-01T10:00:00Z');
      const lastVoteDate = new Date('2024-01-31T10:00:00Z');

      const mockVotes = [
        getMockVote({ voteType: 'like', votedAt: lastVoteDate }),
        getMockVote({ voteType: 'like', votedAt: firstVoteDate }),
      ];

      mockCharactersService.findOrFetchByName.mockResolvedValue(mockPikachu);

      const mockFindQuery = {
        exec: jest.fn().mockResolvedValue(mockVotes),
      };

      mockVoteModel.find = jest.fn().mockReturnValue(mockFindQuery);

      const result = await service.getPikachuStats();

      expect(result.statistics?.firstVoteAt).toBe(firstVoteDate.toISOString());
      expect(result.statistics?.lastVoteAt).toBe(lastVoteDate.toISOString());
    });

    it('should handle errors in getPikachuStats', async () => {
      mockCharactersService.findOrFetchByName.mockRejectedValue(
        new Error('Service error'),
      );

      await expect(service.getPikachuStats()).rejects.toThrow('Service error');
    });
  });
});
