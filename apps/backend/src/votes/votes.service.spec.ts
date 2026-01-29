import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';

import { VotesService } from './votes.service';
import { Vote, VoteDocument } from './schemas';
import { CharactersService } from '../characters/characters.service';
import { Character, CharacterDocument } from '../characters/schemas';

// Factory Pattern for Mock Data
const getMockCharacter = (
  overrides?: Partial<Character>,
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

describe('VotesService', () => {
  let service: VotesService;
  let mockVoteModel: any;
  let mockCharactersService: jest.Mocked<CharactersService>;

  beforeEach(async () => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Create mock vote model - proper Mongoose model mock
    mockVoteModel = jest.fn().mockImplementation((doc) => ({
      ...doc,
      save: jest.fn().mockResolvedValue({ ...doc, _id: new Types.ObjectId() }),
    }));

    mockVoteModel.find = jest.fn();
    mockVoteModel.countDocuments = jest.fn();
    mockVoteModel.findOne = jest.fn();

    // Create mock characters service
    mockCharactersService = {
      findById: jest.fn(),
      findByExternalId: jest.fn(),
      createOrUpdate: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        VotesService,
        {
          provide: 'VoteModel',
          useValue: mockVoteModel,
        },
        {
          provide: CharactersService,
          useValue: mockCharactersService,
        },
      ],
    }).compile();

    service = module.get<VotesService>(VotesService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    it('should create a like vote successfully', async () => {
      const mockCharacter = getMockCharacter();
      const characterId = mockCharacter._id.toString();
      const voteType: 'like' | 'dislike' = 'like';

      mockCharactersService.findById.mockResolvedValue(mockCharacter);

      const result = await service.create(characterId, voteType);

      expect(mockCharactersService.findById).toHaveBeenCalledWith(characterId);
      expect(result).toBeDefined();
      expect(result.characterName).toBe(mockCharacter.name);
      expect(result.voteType).toBe(voteType);
    });

    it('should create a dislike vote successfully', async () => {
      const mockCharacter = getMockCharacter();
      const characterId = mockCharacter._id.toString();
      const voteType: 'like' | 'dislike' = 'dislike';

      mockCharactersService.findById.mockResolvedValue(mockCharacter);

      const result = await service.create(characterId, voteType);

      expect(result.voteType).toBe(voteType);
    });

    it('should throw NotFoundException when character does not exist', async () => {
      const characterId = new Types.ObjectId().toString();
      mockCharactersService.findById.mockResolvedValue(null);

      await expect(service.create(characterId, 'like')).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.create(characterId, 'like')).rejects.toThrow(
        'Character not found',
      );
    });

    it('should handle database errors gracefully', async () => {
      const mockCharacter = getMockCharacter();
      const characterId = mockCharacter._id.toString();
      mockCharactersService.findById.mockResolvedValue(mockCharacter);

      // Override the constructor mock for this test
      mockVoteModel.mockImplementationOnce(() => ({
        save: jest.fn().mockRejectedValue(new Error('DB Error')),
      }));

      await expect(service.create(characterId, 'like')).rejects.toThrow(
        'DB Error',
      );
    });
  });

  describe('createManual', () => {
    it('should create vote for existing character', async () => {
      const characterName = 'Pikachu';
      const source = 'pokemon';
      const voteType: 'like' | 'dislike' = 'like';

      const mockCharacter = getMockCharacter({
        name: characterName,
        externalId: characterName.toLowerCase(),
        source: source as any,
      });

      mockCharactersService.findByExternalId.mockResolvedValue(mockCharacter);

      const result = await service.createManual(
        characterName,
        source,
        voteType,
      );

      expect(mockCharactersService.findByExternalId).toHaveBeenCalledWith(
        characterName.toLowerCase(),
        source,
      );
      expect(mockCharactersService.createOrUpdate).not.toHaveBeenCalled();
      expect(result.characterName).toBe(characterName);
    });

    it('should create new character and vote when character does not exist', async () => {
      const characterName = 'Charizard';
      const source = 'pokemon';
      const voteType: 'like' | 'dislike' = 'dislike';

      const newCharacter = getMockCharacter({
        name: characterName,
        externalId: characterName.toLowerCase(),
        source: source as any,
      });

      mockCharactersService.findByExternalId.mockResolvedValue(null);
      mockCharactersService.createOrUpdate.mockResolvedValue(newCharacter);

      const result = await service.createManual(
        characterName,
        source,
        voteType,
      );

      expect(mockCharactersService.findByExternalId).toHaveBeenCalled();
      expect(mockCharactersService.createOrUpdate).toHaveBeenCalledWith({
        externalId: characterName.toLowerCase(),
        name: characterName,
        source: source,
        imageUrl: '',
      });
      expect(result.voteType).toBe(voteType);
    });

    it('should handle errors in createManual gracefully', async () => {
      const characterName = 'Bulbasaur';
      const source = 'pokemon';

      mockCharactersService.findByExternalId.mockRejectedValue(
        new Error('API Error'),
      );

      await expect(
        service.createManual(characterName, source, 'like'),
      ).rejects.toThrow('API Error');
    });
  });

  describe('findByCharacter', () => {
    it('should return votes for a character', async () => {
      const characterId = new Types.ObjectId().toString();
      const mockVotes = [
        getMockVote({ voteType: 'like' }),
        getMockVote({ voteType: 'dislike' }),
      ];

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockVotes),
      };

      mockVoteModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findByCharacter(characterId);

      expect(mockVoteModel.find).toHaveBeenCalledWith({
        characterId: expect.any(Types.ObjectId),
      });
      expect(result).toHaveLength(2);
    });

    it('should return empty array when no votes found', async () => {
      const characterId = new Types.ObjectId().toString();

      const mockQuery = {
        exec: jest.fn().mockResolvedValue([]),
      };

      mockVoteModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findByCharacter(characterId);

      expect(result).toEqual([]);
    });

    it('should handle database errors', async () => {
      const characterId = new Types.ObjectId().toString();

      const mockQuery = {
        exec: jest
          .fn()
          .mockRejectedValue(new Error('Database connection error')),
      };

      mockVoteModel.find = jest.fn().mockReturnValue(mockQuery);

      await expect(service.findByCharacter(characterId)).rejects.toThrow(
        'Database connection error',
      );
    });
  });

  describe('getVoteCounts', () => {
    it('should return correct vote counts', async () => {
      const characterId = new Types.ObjectId().toString();

      const mockLikesQuery = {
        exec: jest.fn().mockResolvedValue(5),
      };

      const mockDislikesQuery = {
        exec: jest.fn().mockResolvedValue(3),
      };

      mockVoteModel.countDocuments = jest
        .fn()
        .mockReturnValueOnce(mockLikesQuery)
        .mockReturnValueOnce(mockDislikesQuery);

      const result = await service.getVoteCounts(characterId);

      expect(mockVoteModel.countDocuments).toHaveBeenCalledTimes(2);
      expect(result).toEqual({ likes: 5, dislikes: 3 });
    });

    it('should return zero counts when no votes exist', async () => {
      const characterId = new Types.ObjectId().toString();

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(0),
      };

      mockVoteModel.countDocuments = jest.fn().mockReturnValue(mockQuery);

      const result = await service.getVoteCounts(characterId);

      expect(result).toEqual({ likes: 0, dislikes: 0 });
    });

    it('should handle errors when counting likes', async () => {
      const characterId = new Types.ObjectId().toString();

      const mockQuery = {
        exec: jest.fn().mockRejectedValue(new Error('Count error')),
      };

      mockVoteModel.countDocuments = jest.fn().mockReturnValue(mockQuery);

      await expect(service.getVoteCounts(characterId)).rejects.toThrow(
        'Count error',
      );
    });
  });
});
