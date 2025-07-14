'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface TagMapping {
  id: string;
  moodleTag: string;
  websiteTag: string;
  categoryId?: string;
  categoryName?: string;
  description?: string;
  isActive: boolean;
  courseCount: number;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

export default function AdminTagsPage() {
  const [tagMappings, setTagMappings] = useState<TagMapping[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTag, setEditingTag] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    moodleTag: '',
    websiteTag: '',
    categoryId: '',
    description: '',
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      // Mock data - in real app, these would be API calls
      setTimeout(() => {
        setTagMappings([
          {
            id: '1',
            moodleTag: 'language-learning',
            websiteTag: 'Học ngôn ngữ',
            categoryId: '1',
            categoryName: 'Khóa học chất lượng',
            description: 'Courses focused on language learning and communication',
            isActive: true,
            courseCount: 5,
          },
          {
            id: '2',
            moodleTag: 'beginner',
            websiteTag: 'Người mới bắt đầu',
            categoryId: '1',
            categoryName: 'Khóa học chất lượng',
            description: 'Entry-level courses for beginners',
            isActive: true,
            courseCount: 8,
          },
          {
            id: '3',
            moodleTag: 'english',
            websiteTag: 'Tiếng Anh',
            categoryId: '1',
            categoryName: 'Khóa học chất lượng',
            description: 'English language courses',
            isActive: true,
            courseCount: 3,
          },
        ]);

        setCategories([
          { id: '1', name: 'Khóa học chất lượng', slug: 'khoa-hoc-chat-luong' },
          { id: '2', name: 'Khóa học miễn phí', slug: 'khoa-hoc-mien-phi' },
          { id: '3', name: 'Khóa học nâng cao', slug: 'khoa-hoc-nang-cao' },
        ]);

        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  };

  const handleAddMapping = () => {
    setShowAddForm(true);
    setFormData({
      moodleTag: '',
      websiteTag: '',
      categoryId: '',
      description: '',
    });
  };

  const handleEditMapping = (mapping: TagMapping) => {
    setEditingTag(mapping.id);
    setFormData({
      moodleTag: mapping.moodleTag,
      websiteTag: mapping.websiteTag,
      categoryId: mapping.categoryId || '',
      description: mapping.description || '',
    });
  };

  const handleSaveMapping = async () => {
    try {
      if (editingTag) {
        // Update existing mapping
        setTagMappings(tagMappings.map(mapping => 
          mapping.id === editingTag 
            ? { 
                ...mapping, 
                moodleTag: formData.moodleTag,
                websiteTag: formData.websiteTag,
                categoryId: formData.categoryId,
                categoryName: categories.find(c => c.id === formData.categoryId)?.name,
                description: formData.description,
              }
            : mapping
        ));
        setEditingTag(null);
      } else {
        // Add new mapping
        const newMapping: TagMapping = {
          id: Date.now().toString(),
          moodleTag: formData.moodleTag,
          websiteTag: formData.websiteTag,
          categoryId: formData.categoryId,
          categoryName: categories.find(c => c.id === formData.categoryId)?.name,
          description: formData.description,
          isActive: true,
          courseCount: 0,
        };
        setTagMappings([...tagMappings, newMapping]);
        setShowAddForm(false);
      }

      setFormData({
        moodleTag: '',
        websiteTag: '',
        categoryId: '',
        description: '',
      });

      alert('Tag mapping saved successfully!');
    } catch (error) {
      console.error('Error saving tag mapping:', error);
      alert('Failed to save tag mapping');
    }
  };

  const handleDeleteMapping = async (id: string) => {
    if (confirm('Are you sure you want to delete this tag mapping?')) {
      setTagMappings(tagMappings.filter(mapping => mapping.id !== id));
      alert('Tag mapping deleted successfully!');
    }
  };

  const handleToggleActive = async (id: string) => {
    setTagMappings(tagMappings.map(mapping => 
      mapping.id === id 
        ? { ...mapping, isActive: !mapping.isActive }
        : mapping
    ));
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingTag(null);
    setFormData({
      moodleTag: '',
      websiteTag: '',
      categoryId: '',
      description: '',
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">Tag Mapping Management</h1>
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tag mappings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Tag Mapping Management</h1>
          <p className="text-gray-600 mt-1">
            Map Moodle tags to website categories and custom tags
          </p>
        </div>
        <Button 
          onClick={handleAddMapping}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          ➕ Add Tag Mapping
        </Button>
      </div>

      {/* Add/Edit Form */}
      {(showAddForm || editingTag) && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingTag ? 'Edit Tag Mapping' : 'Add New Tag Mapping'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Moodle Tag
                </label>
                <input
                  type="text"
                  value={formData.moodleTag}
                  onChange={(e) => setFormData({...formData, moodleTag: e.target.value})}
                  placeholder="e.g., language-learning"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website Tag (Vietnamese)
                </label>
                <input
                  type="text"
                  value={formData.websiteTag}
                  onChange={(e) => setFormData({...formData, websiteTag: e.target.value})}
                  placeholder="e.g., Học ngôn ngữ"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category (Optional)
                </label>
                <select
                  value={formData.categoryId}
                  onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Brief description of this tag mapping"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex space-x-3 mt-6">
              <Button onClick={handleSaveMapping}>
                {editingTag ? 'Update Mapping' : 'Create Mapping'}
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tag Mappings List */}
      <div className="grid grid-cols-1 gap-4">
        {tagMappings.map((mapping) => (
          <Card key={mapping.id}>
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <Badge variant="outline" className="font-mono">
                      {mapping.moodleTag}
                    </Badge>
                    <span className="text-gray-400">→</span>
                    <Badge className="bg-blue-100 text-blue-800">
                      {mapping.websiteTag}
                    </Badge>
                    {mapping.categoryName && (
                      <>
                        <span className="text-gray-400">in</span>
                        <Badge variant="secondary">
                          📁 {mapping.categoryName}
                        </Badge>
                      </>
                    )}
                    <Badge variant={mapping.isActive ? 'default' : 'secondary'}>
                      {mapping.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  {mapping.description && (
                    <p className="text-sm text-gray-600 mb-2">{mapping.description}</p>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>📊 {mapping.courseCount} courses using this tag</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(mapping.id)}
                  >
                    {mapping.isActive ? '⏸️ Deactivate' : '▶️ Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEditMapping(mapping)}
                  >
                    ✏️ Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDeleteMapping(mapping.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    🗑️ Delete
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tagMappings.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <div className="text-6xl mb-4">🏷️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No tag mappings found</h3>
            <p className="text-gray-600 mb-4">
              Create tag mappings to organize Moodle course tags into website categories.
            </p>
            <Button 
              onClick={handleAddMapping}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create First Tag Mapping
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <span className="text-blue-600 text-xl">💡</span>
            <div>
              <h4 className="font-medium text-blue-900 mb-1">How Tag Mapping Works</h4>
              <p className="text-sm text-blue-800">
                Tag mappings help organize courses by connecting Moodle's internal tags 
                to user-friendly Vietnamese tags and categories on your website. When courses 
                are synced from Moodle, they'll automatically be categorized based on these mappings.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}