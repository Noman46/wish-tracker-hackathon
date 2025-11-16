'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Category } from '@/lib/models/category';
import { WishItem } from '@/lib/models/wish-item';
import CategoryManager from '@/components/CategoryManager';
import WishItemManager from '@/components/WishItemManager';
import { List, Grid } from 'lucide-react';

export default function Home() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<Category[]>([]);
  const [wishItems, setWishItems] = useState<WishItem[]>([]);
  const [activeTab, setActiveTab] = useState<'wishes' | 'categories'>('wishes');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [categoriesRes, itemsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/wish-items'),
      ]);
      const categoriesData = await categoriesRes.json();
      const itemsData = await itemsRes.json();
      setCategories(categoriesData);
      setWishItems(itemsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = () => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data))
      .catch(err => console.error('Failed to fetch categories:', err));
  };

  const handleWishItemChange = () => {
    fetch('/api/wish-items')
      .then(res => res.json())
      .then(data => setWishItems(data))
      .catch(err => console.error('Failed to fetch wish items:', err));
  };

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Wish Tracker</h1>
          <p className="text-gray-600 mb-6">Manage your personal wishlist with ease</p>
          <AuthButton />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Top dark bar */}
      <div className="h-1 bg-gray-800"></div>

      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex justify-between items-center px-6 py-4">
          <h1 className="text-2xl font-bold text-blue-900">WISH TRACKER</h1>
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
          )}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Navigation */}
        <aside className="w-64 bg-gray-100 min-h-[calc(100vh-73px)] border-r border-gray-200">
          <nav className="p-4 space-y-2">
            <button
              onClick={() => setActiveTab('wishes')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'wishes'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <List className="w-5 h-5" />
              <span className="font-medium">Wish List</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                activeTab === 'categories'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span className="font-medium">Categories</span>
            </button>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 bg-white">
          {activeTab === 'wishes' ? (
            <WishItemManager
              wishItems={wishItems}
              categories={categories}
              onUpdate={handleWishItemChange}
            />
          ) : (
            <CategoryManager
              categories={categories}
              onUpdate={handleCategoryChange}
            />
          )}
        </main>
      </div>
    </div>
  );
}

