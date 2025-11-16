import { GET, POST } from '@/app/api/wish-items/route';
import { wishItemModel } from '@/lib/models/wish-item';

// Mock the wish item model
jest.mock('@/lib/models/wish-item', () => ({
  wishItemModel: {
    getAll: jest.fn(),
    getByStatus: jest.fn(),
    getByCategory: jest.fn(),
    create: jest.fn(),
  },
}));

describe('/api/wish-items', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all wish items', async () => {
      const mockItems = [
        {
          id: 1,
          title: 'Visit Japan',
          description: 'Travel to Japan',
          status: 'wish' as const,
          category_id: 1,
          remarks: null,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];

      (wishItemModel.getAll as jest.Mock).mockReturnValue(mockItems);

      const request = new Request('http://localhost/api/wish-items');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockItems);
      expect(wishItemModel.getAll).toHaveBeenCalledTimes(1);
    });

    it('should filter by status', async () => {
      const mockItems = [
        {
          id: 1,
          title: 'Visit Japan',
          description: 'Travel to Japan',
          status: 'in_progress' as const,
          category_id: 1,
          remarks: null,
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        },
      ];

      (wishItemModel.getByStatus as jest.Mock).mockReturnValue(mockItems);

      const request = new Request('http://localhost/api/wish-items?status=in_progress');
      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockItems);
      expect(wishItemModel.getByStatus).toHaveBeenCalledWith('in_progress');
    });
  });

  describe('POST', () => {
    it('should create a new wish item', async () => {
      const newItem = {
        id: 1,
        title: 'Visit Japan',
        description: 'Travel to Japan',
        status: 'wish' as const,
        category_id: 1,
        remarks: null,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      (wishItemModel.create as jest.Mock).mockReturnValue(newItem);

      const request = new Request('http://localhost/api/wish-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Visit Japan',
          description: 'Travel to Japan',
          status: 'wish',
          category_id: 1,
        }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(newItem);
      expect(wishItemModel.create).toHaveBeenCalled();
    });

    it('should validate input', async () => {
      const request = new Request('http://localhost/api/wish-items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: '' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });
  });
});

