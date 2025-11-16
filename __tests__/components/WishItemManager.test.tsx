import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import WishItemManager from '@/components/WishItemManager';
import { WishItem } from '@/lib/models/wish-item';
import { Category } from '@/lib/models/category';

// Mock fetch
global.fetch = jest.fn();

const mockCategories: Category[] = [
  {
    id: 1,
    name: 'Travel',
    color: '#3B82F6',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

const mockWishItems: WishItem[] = [
  {
    id: 1,
    title: 'Visit Japan',
    description: 'Travel to Japan',
    status: 'wish',
    category_id: 1,
    remarks: null,
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
  {
    id: 2,
    title: 'Read 50 books',
    description: 'Reading goal',
    status: 'in_progress',
    category_id: null,
    remarks: 'Halfway there!',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

describe('WishItemManager', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockWishItems,
    });
  });

  it('renders wish items', () => {
    render(
      <WishItemManager
        wishItems={mockWishItems}
        categories={mockCategories}
        onUpdate={mockOnUpdate}
      />
    );
    
    expect(screen.getByText('Visit Japan')).toBeInTheDocument();
    expect(screen.getByText('Read 50 books')).toBeInTheDocument();
  });

  it('filters items by status', () => {
    render(
      <WishItemManager
        wishItems={mockWishItems}
        categories={mockCategories}
        onUpdate={mockOnUpdate}
      />
    );
    
    const inProgressButton = screen.getByText('In Progress');
    fireEvent.click(inProgressButton);

    expect(screen.getByText('Read 50 books')).toBeInTheDocument();
    expect(screen.queryByText('Visit Japan')).not.toBeInTheDocument();
  });

  it('updates status when status button is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}),
    });

    render(
      <WishItemManager
        wishItems={mockWishItems}
        categories={mockCategories}
        onUpdate={mockOnUpdate}
      />
    );
    
    const inProgressButtons = screen.getAllByText('In Progress');
    fireEvent.click(inProgressButtons[0]);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/wish-items/1', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'in_progress' }),
      });
    });
  });

  it('opens create modal when Add Wish Item is clicked', () => {
    render(
      <WishItemManager
        wishItems={mockWishItems}
        categories={mockCategories}
        onUpdate={mockOnUpdate}
      />
    );
    
    const addButton = screen.getByText('Add Wish Item');
    fireEvent.click(addButton);

    expect(screen.getByText('Create Wish Item')).toBeInTheDocument();
  });
});

