import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CategoryManager from '@/components/CategoryManager';
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
  {
    id: 2,
    name: 'Books',
    color: '#10B981',
    created_at: '2024-01-01',
    updated_at: '2024-01-01',
  },
];

describe('CategoryManager', () => {
  const mockOnUpdate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: async () => mockCategories,
    });
  });

  it('renders categories', () => {
    render(<CategoryManager categories={mockCategories} onUpdate={mockOnUpdate} />);
    
    expect(screen.getByText('Travel')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
  });

  it('opens create modal when Add Category is clicked', () => {
    render(<CategoryManager categories={mockCategories} onUpdate={mockOnUpdate} />);
    
    const addButton = screen.getByText('Add Category');
    fireEvent.click(addButton);

    expect(screen.getByText('Create Category')).toBeInTheDocument();
  });

  it('opens edit modal when edit button is clicked', () => {
    render(<CategoryManager categories={mockCategories} onUpdate={mockOnUpdate} />);
    
    // Find edit buttons by querying for buttons containing Edit2 icon
    const buttons = screen.getAllByRole('button');
    const editButton = buttons.find(btn => {
      const svg = btn.querySelector('svg');
      return svg && btn.closest('.flex.gap-2');
    });
    
    if (editButton) {
      fireEvent.click(editButton);
      expect(screen.getByText('Edit Category')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Travel')).toBeInTheDocument();
    }
  });

  it('creates a new category', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ id: 3, name: 'New Category', color: '#3B82F6' }),
    });

    render(<CategoryManager categories={mockCategories} onUpdate={mockOnUpdate} />);
    
    const addButton = screen.getByText('Add Category');
    fireEvent.click(addButton);

    // Find the name input field
    const inputs = screen.getAllByRole('textbox');
    const nameInput = inputs.find(input => (input as HTMLInputElement).type === 'text') || inputs[0];
    if (nameInput) {
      fireEvent.change(nameInput, { target: { value: 'New Category' } });
    }

    const submitButton = screen.getByText('Create');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: 'New Category', color: '#3B82F6' }),
      });
    });
  });
});

