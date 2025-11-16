import { GET, POST } from '@/app/api/categories/route';
import { categoryModel } from '@/lib/models/category';

// Mock the category model
jest.mock('@/lib/models/category', () => ({
  categoryModel: {
    getAll: jest.fn(),
    create: jest.fn(),
  },
}));

describe('/api/categories', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Travel', color: '#3B82F6', created_at: '2024-01-01', updated_at: '2024-01-01' },
        { id: 2, name: 'Books', color: '#10B981', created_at: '2024-01-01', updated_at: '2024-01-01' },
      ];

      (categoryModel.getAll as jest.Mock).mockReturnValue(mockCategories);

      const request = new Request('http://localhost/api/categories');
      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockCategories);
      expect(categoryModel.getAll).toHaveBeenCalledTimes(1);
    });

    it('should handle errors', async () => {
      (categoryModel.getAll as jest.Mock).mockImplementation(() => {
        throw new Error('Database error');
      });

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe('Failed to fetch categories');
    });
  });

  describe('POST', () => {
    it('should create a new category', async () => {
      const newCategory = {
        id: 1,
        name: 'Travel',
        color: '#3B82F6',
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
      };

      (categoryModel.create as jest.Mock).mockReturnValue(newCategory);

      const request = new Request('http://localhost/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'Travel', color: '#3B82F6' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(201);
      expect(data).toEqual(newCategory);
      expect(categoryModel.create).toHaveBeenCalledWith({
        name: 'Travel',
        color: '#3B82F6',
      });
    });

    it('should validate input', async () => {
      const request = new Request('http://localhost/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: '' }),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toBe('Validation error');
    });
  });
});

