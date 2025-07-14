'use client';

import React from 'react';

export default function TestImagesPage() {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Image Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Test 1: Direct SVG placeholder */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Direct SVG Placeholder</h3>
          <div className="w-full h-40 border">
            <img 
              src="/api/placeholder/400/300?text=Test%20Course" 
              alt="Test Course"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Test 2: Different course names */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">CwC Course</h3>
          <div className="w-full h-40 border">
            <img 
              src="/api/placeholder/400/300?text=CwC%20_%20A2%2B.1" 
              alt="CwC Course"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Test 3: Meta Model Course */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Meta Model Course</h3>
          <div className="w-full h-40 border">
            <img 
              src="/api/placeholder/400/300?text=Meta%20Model%20Course" 
              alt="Meta Model"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Test 4: Placement Test */}
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Placement Test</h3>
          <div className="w-full h-40 border">
            <img 
              src="/api/placeholder/400/300?text=Placement%20Test%20A1-B1" 
              alt="Placement Test"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">API Test Links</h2>
        <ul className="space-y-2">
          <li>
            <a href="/api/placeholder/400/300?text=Test%20Course" 
               target="_blank" 
               className="text-blue-600 hover:underline">
              Test Course Placeholder
            </a>
          </li>
          <li>
            <a href="/api/courses" 
               target="_blank" 
               className="text-blue-600 hover:underline">
              Courses API Response
            </a>
          </li>
          <li>
            <a href="/dashboard" 
               className="text-blue-600 hover:underline">
              Dashboard with Fixed Images
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}