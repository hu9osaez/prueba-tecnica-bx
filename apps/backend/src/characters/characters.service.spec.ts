import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';

import { CharactersService } from './characters.service';
import { Character, CharacterDocument } from './schemas';
import { ExternalService } from '../external/external.service';

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

const getMockExternalCharacter = (
  overrides?: Partial<{
    externalId: string;
    name: string;
    source: 'rick-morty' | 'pokemon' | 'superhero';
    imageUrl: string;
  }>,
) => {
  return {
    externalId: 'external-123',
    name: 'External Character',
    source: 'pokemon' as const,
    imageUrl: 'https://example.com/external.png',
    ...overrides,
  };
};

describe('CharactersService', () => {
  let service: CharactersService;
  let mockCharacterModel: any;
  let mockExternalService: jest.Mocked<ExternalService>;

  beforeEach(async () => {
    jest.clearAllMocks();

    // Create mock character model
    mockCharacterModel = {
      findOneAndUpdate: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      countDocuments: jest.fn(),
      aggregate: jest.fn(),
      find: jest.fn(),
      exec: jest.fn(),
    };

    // Create mock external service
    mockExternalService = {
      getRandomCharacter: jest.fn(),
      getCharacterByName: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CharactersService,
        {
          provide: 'CharacterModel',
          useValue: mockCharacterModel,
        },
        {
          provide: ExternalService,
          useValue: mockExternalService,
        },
      ],
    }).compile();

    service = module.get<CharactersService>(CharactersService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('createOrUpdate', () => {
    it('should create a new character when it does not exist', async () => {
      const externalCharacter = getMockExternalCharacter({
        name: 'Pikachu',
        externalId: 'pikachu-123',
        source: 'pokemon',
      });

      const newCharacter = getMockCharacter(externalCharacter);
      mockCharacterModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(newCharacter);

      const result = await service.createOrUpdate(externalCharacter);

      expect(mockCharacterModel.findOneAndUpdate).toHaveBeenCalledWith(
        {
          externalId: externalCharacter.externalId,
          source: externalCharacter.source,
        },
        externalCharacter,
        { upsert: true, new: true },
      );
      expect(result.name).toBe('Pikachu');
    });

    it('should update an existing character', async () => {
      const externalCharacter = getMockExternalCharacter({
        name: 'Charizard',
        externalId: 'charizard-456',
      });

      const updatedCharacter = getMockCharacter({
        name: 'Charizard Updated',
        externalId: 'charizard-456',
      });

      mockCharacterModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(updatedCharacter);

      const result = await service.createOrUpdate(externalCharacter);

      expect(result.name).toBe('Charizard Updated');
    });

    it('should handle database errors gracefully', async () => {
      const externalCharacter = getMockExternalCharacter();
      mockCharacterModel.findOneAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error('Database connection failed'));

      await expect(service.createOrUpdate(externalCharacter)).rejects.toThrow(
        'Database connection failed',
      );
    });
  });

  describe('findById', () => {
    it('should return a character when found', async () => {
      const mockCharacter = getMockCharacter({ name: 'Mewtwo' });
      const characterId = mockCharacter._id.toString();

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockCharacter),
      };

      mockCharacterModel.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findById(characterId);

      expect(mockCharacterModel.findById).toHaveBeenCalledWith(characterId);
      expect(result).toBeDefined();
      expect(result?.name).toBe('Mewtwo');
    });

    it('should return null when character not found', async () => {
      const characterId = new Types.ObjectId().toString();

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      mockCharacterModel.findById = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findById(characterId);

      expect(result).toBeNull();
    });

    it('should handle errors in findById', async () => {
      const characterId = new Types.ObjectId().toString();

      const mockQuery = {
        exec: jest.fn().mockRejectedValue(new Error('Invalid ObjectId')),
      };

      mockCharacterModel.findById = jest.fn().mockReturnValue(mockQuery);

      await expect(service.findById(characterId)).rejects.toThrow(
        'Invalid ObjectId',
      );
    });
  });

  describe('findByExternalId', () => {
    it('should return character by externalId and source', async () => {
      const mockCharacter = getMockCharacter({
        externalId: 'rick-1',
        source: 'rick-morty',
      });

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockCharacter),
      };

      mockCharacterModel.findOne = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findByExternalId('rick-1', 'rick-morty');

      expect(mockCharacterModel.findOne).toHaveBeenCalledWith({
        externalId: 'rick-1',
        source: 'rick-morty',
      });
      expect(result).toBeDefined();
      expect(result?.externalId).toBe('rick-1');
    });

    it('should return null when no match found', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      mockCharacterModel.findOne = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findByExternalId('unknown', 'pokemon');

      expect(result).toBeNull();
    });
  });

  describe('getRandomCharacter', () => {
    it('should return character from external API when count is 0', async () => {
      const externalCharacter = getMockExternalCharacter({
        name: 'Random Pokemon',
        source: 'pokemon',
      });

      const newCharacter = getMockCharacter(externalCharacter);

      mockCharacterModel.countDocuments = jest.fn().mockResolvedValue(0);
      mockExternalService.getRandomCharacter = jest
        .fn()
        .mockResolvedValue(externalCharacter);
      mockCharacterModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(newCharacter);

      const result = await service.getRandomCharacter('pokemon');

      expect(mockExternalService.getRandomCharacter).toHaveBeenCalledWith(
        'pokemon',
      );
      expect(result?.name).toBe('Random Pokemon');
    });

    it('should return character from database when count is sufficient', async () => {
      const mockCharacter = getMockCharacter({
        name: 'DB Character',
        source: 'pokemon',
      });

      mockCharacterModel.countDocuments = jest.fn().mockResolvedValue(15);
      mockCharacterModel.aggregate = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([mockCharacter]),
      });

      const result = await service.getRandomCharacter('pokemon');

      expect(mockExternalService.getRandomCharacter).not.toHaveBeenCalled();
      expect(result?.name).toBe('DB Character');
    });

    it('should exclude provided IDs from results', async () => {
      const excludeIds = [new Types.ObjectId().toString()];
      const externalCharacter = getMockExternalCharacter();

      const newCharacter = getMockCharacter(externalCharacter);

      mockCharacterModel.countDocuments = jest.fn().mockResolvedValue(5);
      mockExternalService.getRandomCharacter = jest
        .fn()
        .mockResolvedValue(externalCharacter);
      mockCharacterModel.findOne = jest.fn().mockResolvedValue(null);
      mockCharacterModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(newCharacter);

      await service.getRandomCharacter('pokemon', excludeIds);

      expect(mockCharacterModel.countDocuments).toHaveBeenCalledWith({
        source: 'pokemon',
        _id: { $nin: excludeIds },
      });
    });

    it('should handle errors in getRandomCharacter', async () => {
      mockCharacterModel.countDocuments = jest
        .fn()
        .mockRejectedValue(new Error('Database error'));

      await expect(service.getRandomCharacter()).rejects.toThrow(
        'Database error',
      );
    });
  });

  describe('findAll', () => {
    it('should return all characters', async () => {
      const mockCharacters = [
        getMockCharacter({ name: 'Char1' }),
        getMockCharacter({ name: 'Char2' }),
      ];

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockCharacters),
      };

      mockCharacterModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Char1');
    });

    it('should return empty array when no characters exist', async () => {
      const mockQuery = {
        exec: jest.fn().mockResolvedValue([]),
      };

      mockCharacterModel.find = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOrFetchByName', () => {
    it('should return character from database when found', async () => {
      const mockCharacter = getMockCharacter({ name: 'Pikachu' });

      const mockQuery = {
        exec: jest.fn().mockResolvedValue(mockCharacter),
      };

      mockCharacterModel.findOne = jest.fn().mockReturnValue(mockQuery);

      const result = await service.findOrFetchByName('Pikachu', 'pokemon');

      expect(mockCharacterModel.findOne).toHaveBeenCalledWith({
        name: { $regex: '^Pikachu$', $options: 'i' },
      });
      expect(result?.name).toBe('Pikachu');
      expect(mockExternalService.getCharacterByName).not.toHaveBeenCalled();
    });

    it('should fetch from external API when not in database', async () => {
      const externalCharacter = getMockExternalCharacter({
        name: 'Mew',
        source: 'pokemon',
      });

      const newCharacter = getMockCharacter(externalCharacter);

      const mockFindQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      mockCharacterModel.findOne = jest.fn().mockReturnValue(mockFindQuery);
      mockExternalService.getCharacterByName = jest
        .fn()
        .mockResolvedValue(externalCharacter);
      mockCharacterModel.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue(newCharacter);

      const result = await service.findOrFetchByName('Mew', 'pokemon');

      expect(mockExternalService.getCharacterByName).toHaveBeenCalledWith(
        'Mew',
        'pokemon',
      );
      expect(result?.name).toBe('Mew');
    });

    it('should return null when external API fails', async () => {
      const mockFindQuery = {
        exec: jest.fn().mockResolvedValue(null),
      };

      mockCharacterModel.findOne = jest.fn().mockReturnValue(mockFindQuery);
      mockExternalService.getCharacterByName = jest
        .fn()
        .mockRejectedValue(new Error('Character not found in API'));

      const result = await service.findOrFetchByName('Unknown', 'pokemon');

      expect(result).toBeNull();
    });

    it('should handle database errors', async () => {
      const mockQuery = {
        exec: jest.fn().mockRejectedValue(new Error('DB Error')),
      };

      mockCharacterModel.findOne = jest.fn().mockReturnValue(mockQuery);

      await expect(
        service.findOrFetchByName('Test', 'pokemon'),
      ).rejects.toThrow('DB Error');
    });
  });
});
