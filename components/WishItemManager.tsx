'use client';

import { useState, useMemo } from 'react';
import { WishItem, WishStatus } from '@/lib/models/wish-item';
import { Category } from '@/lib/models/category';
import { Plus, Trash2, X, CheckCircle2, Circle, Clock, Search, MessageSquare, ChevronDown, ArrowUpRight } from 'lucide-react';

interface WishItemManagerProps {
  wishItems: WishItem[];
  categories: Category[];
  onUpdate: () => void;
}

const statusConfig: Record<WishStatus, { label: string; icon: React.ReactNode; color: string }> = {
  wish: { label: 'Wish', icon: <Circle className="w-4 h-4" />, color: 'bg-gray-100 text-gray-800' },
  in_progress: { label: 'In Progress', icon: <Clock className="w-4 h-4" />, color: 'bg-blue-100 text-blue-800' },
  achieved: { label: 'Achieved', icon: <CheckCircle2 className="w-4 h-4" />, color: 'bg-green-100 text-green-800' },
};

export default function WishItemManager({ wishItems, categories, onUpdate }: WishItemManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishItem | null>(null);
  const [filterStatus, setFilterStatus] = useState<WishStatus>('wish');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<number | 'all'>('all');
  const [expandedRemarks, setExpandedRemarks] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'wish' as WishStatus,
    category_id: null as number | null,
    remarks: '',
  });

  const filteredItems = useMemo(() => {
    let filtered = wishItems;

    // Filter by status
    filtered = filtered.filter(item => item.status === filterStatus);

    // Filter by category
    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category_id === filterCategory);
    }

    // Filter by search query (title)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [wishItems, filterStatus, filterCategory, searchQuery]);

  const getRemarksCount = (remarks: string | null): number => {
    if (!remarks) return 0;
    // Count lines or split by newlines
    return remarks.split('\n').filter(line => line.trim().length > 0).length;
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const openCreateModal = () => {
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      status: 'wish',
      category_id: null,
      remarks: '',
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: WishItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      status: item.status,
      category_id: item.category_id,
      remarks: item.remarks || '',
    });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setFormData({
      title: '',
      description: '',
      status: 'wish',
      category_id: null,
      remarks: '',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingItem
        ? `/api/wish-items/${editingItem.id}`
        : '/api/wish-items';
      const method = editingItem ? 'PATCH' : 'POST';

      const payload = {
        ...formData,
        category_id: formData.category_id || null,
      };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        onUpdate();
        closeModal();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save wish item');
      }
    } catch (error) {
      console.error('Error saving wish item:', error);
      alert('Failed to save wish item');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this wish item?')) return;

    try {
      const response = await fetch(`/api/wish-items/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        onUpdate();
      } else {
        alert('Failed to delete wish item');
      }
    } catch (error) {
      console.error('Error deleting wish item:', error);
      alert('Failed to delete wish item');
    }
  };

  const handleStatusChange = async (id: number, newStatus: WishStatus) => {
    try {
      const response = await fetch(`/api/wish-items/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        onUpdate();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const getCategory = (categoryId: number | null) => {
    if (!categoryId) return null;
    return categories.find(c => c.id === categoryId);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} className="w-full">
      {/* Page Title */}
      <div className="mb-4 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Wish List</h1>
        <p className="text-sm sm:text-base text-gray-600">Track your wishes from idea to achievement</p>
      </div>

      {/* Search, Category Filter, and Add Button */}
      <div 
        className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr] gap-4 mb-6 w-full"
      >
        <div className="relative w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            style={{ height: '40px' }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) =>
            setFilterCategory(
              e.target.value === 'all' ? 'all' : parseInt(e.target.value)
            )
          }
          className="w-full px-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
          style={{ height: '40px' }}
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        <button
          onClick={openCreateModal}
          className="w-full flex items-center justify-center gap-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          style={{ height: '40px' }}
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add New Wish</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-1 mb-6">
        {Object.entries(statusConfig).map(([status, config]) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status as WishStatus)}
            className={`font-medium text-xs sm:text-sm transition-colors flex items-center justify-center ${
              filterStatus === status
                ? 'text-gray-900'
                : 'text-gray-500 hover:text-gray-700'
            }`}
            style={{
              minWidth: '100px',
              width: 'auto',
              flex: '1 1 auto',
              maxWidth: '314px',
              height: '28px',
              gap: '6px',
              paddingTop: '3px',
              paddingRight: '8px',
              paddingBottom: '3px',
              paddingLeft: '8px',
              borderRadius: '14px',
              borderWidth: '1px',
              borderStyle: 'solid',
              borderColor: filterStatus === status ? '#374151' : '#e5e7eb'
            }}
          >
            {config.label}
          </button>
        ))}
      </div>

      {/* Wish Items List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {filteredItems.map((item) => {
          const category = getCategory(item.category_id);
          const statusInfo = statusConfig[item.status];
          const remarksCount = getRemarksCount(item.remarks);
          const isRemarksExpanded = expandedRemarks === item.id;

          return (
            <div
              key={item.id}
              className="bg-white hover:shadow-md transition-shadow w-full"
              style={{
                minHeight: '136px',
                gap: '16px',
                borderRadius: '8px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: '#e5e7eb',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
                {/* Top Section: Title, Category, Created Date, and Status */}
                <div className="flex items-start justify-between" style={{ gap: '16px' }}>
                  <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900" style={{ margin: 0 }}>
                      {item.title}
                    </h3>

                    {/* Category and Created Date */}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      {category && (
                        <div className="flex items-center gap-2">
                          <span className="font-medium">Category:</span>
                          <span>{category.name}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Created:</span>
                        <span>{formatDate(item.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Status Tag */}
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Expanded Remarks Section */}
                {isRemarksExpanded && item.remarks && (
                  <div className="p-3 bg-gray-50 rounded text-sm text-gray-700">
                    {item.remarks.split('\n').map((line, idx) => (
                      <p key={idx}>{line}</p>
                    ))}
                  </div>
                )}

                {/* Footer: Remarks on left, Move to button and Delete on right */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3" style={{ marginTop: 'auto' }}>
                  {/* Left: Remarks Button */}
                  <div>
                    {item.remarks && (
                      <button
                        onClick={() => setExpandedRemarks(isRemarksExpanded ? null : item.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-xs sm:text-sm"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Remarks ({remarksCount})</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${isRemarksExpanded ? 'rotate-180' : ''}`} />
                      </button>
                    )}
                  </div>

                  {/* Right: Move to Button and Delete Icon */}
                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    {item.status === 'wish' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'in_progress')}
                        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Move to In Progress</span>
                        <span className="sm:hidden">In Progress</span>
                        <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                    {item.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'wish')}
                        className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Move to Wish</span>
                        <span className="sm:hidden">Wish</span>
                      </button>
                    )}
                    {item.status === 'achieved' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'in_progress')}
                        className="px-3 sm:px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Move to In Progress</span>
                        <span className="sm:hidden">In Progress</span>
                      </button>
                    )}
                    {item.status === 'in_progress' && (
                      <button
                        onClick={() => handleStatusChange(item.id, 'achieved')}
                        className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm"
                      >
                        <span className="hidden sm:inline">Mark as Achieved</span>
                        <span className="sm:hidden">Achieved</span>
                        <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-gray-500">
            {searchQuery || filterCategory !== 'all'
              ? 'No wish items match your filters. Try adjusting your search or filters.'
              : `No items with status "${statusConfig[filterStatus]?.label}". Create your first wish!`}
          </p>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 sm:p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editingItem ? 'Edit Wish Item' : 'Create Wish Item'}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as WishStatus })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="wish">Wish</option>
                    <option value="in_progress">In Progress</option>
                    <option value="achieved">Achieved</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category_id || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: e.target.value ? parseInt(e.target.value) : null,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  >
                    <option value="">None</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Remarks
                </label>
                <textarea
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
                  rows={2}
                  placeholder="Add any notes or remarks..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  {editingItem ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

