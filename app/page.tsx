'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Category } from '@/lib/models/category';
import { WishItem } from '@/lib/models/wish-item';
import CategoryManager from '@/components/CategoryManager';
import WishItemManager from '@/components/WishItemManager';
import Logo from '@/components/Logo';
import AuthButton from '@/components/AuthButton';
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
        <div className="flex justify-between items-center px-4 sm:px-6 py-4">
          <Logo />
          {session?.user?.image ? (
            <img
              src={session.user.image}
              alt={session.user.name || 'User'}
              className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gray-300"></div>
          )}
        </div>
      </header>

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden bg-gray-100 border-b border-gray-200">
        <nav className="flex">
          <button
            onClick={() => setActiveTab('wishes')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors ${
              activeTab === 'wishes'
                ? 'bg-gray-200 text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <List className="w-5 h-5" />
            <span className="font-medium">Wish List</span>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 transition-colors ${
              activeTab === 'categories'
                ? 'bg-gray-200 text-gray-900 border-b-2 border-gray-900'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Grid className="w-5 h-5" />
            <span className="font-medium">Categories</span>
          </button>
        </nav>
      </div>

      {/* Outer Content Layout */}
      <div 
        className="flex flex-col lg:flex-row mx-auto w-full"
        style={{
          maxWidth: '1440px',
          gap: '30px',
          paddingTop: '20px',
          paddingRight: 'clamp(16px, 8.33vw, 120px)',
          paddingLeft: 'clamp(16px, 8.33vw, 120px)',
          paddingBottom: '20px'
        }}
      >
        {/* Sidebar Navigation - Hidden on mobile, visible on lg+ */}
        <aside className="hidden lg:block bg-gray-100 min-h-[calc(100vh-73px)] border-r border-gray-200 flex-shrink-0">
          <nav className="p-4" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              onClick={() => setActiveTab('wishes')}
              className={`flex items-center gap-3 px-4 transition-colors ${
                activeTab === 'wishes'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              style={{
                width: '220px',
                height: '82px',
                borderRadius: '8px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: activeTab === 'wishes' ? 'transparent' : '#e5e7eb'
              }}
            >
              <List className="w-5 h-5" />
              <span className="font-medium">Wish List</span>
            </button>
            <button
              onClick={() => setActiveTab('categories')}
              className={`flex items-center gap-3 px-4 transition-colors ${
                activeTab === 'categories'
                  ? 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              style={{
                width: '220px',
                height: '82px',
                borderRadius: '8px',
                borderWidth: '1px',
                borderStyle: 'solid',
                borderColor: activeTab === 'categories' ? 'transparent' : '#e5e7eb'
              }}
            >
              <Grid className="w-5 h-5" />
              <span className="font-medium">Categories</span>
            </button>
          </nav>
        </aside>

        {/* Main Content - Body Content */}
        <main 
          className="bg-white w-full"
          style={{
            maxWidth: '950px',
            gap: '10px',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
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

