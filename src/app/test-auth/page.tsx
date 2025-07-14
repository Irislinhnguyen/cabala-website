'use client';

import { useState } from 'react';

export default function TestAuthPage() {
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuth = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      console.log('🔍 Client: Token from localStorage:', token ? 'Present' : 'Missing');
      
      if (!token) {
        setResults({ error: 'No token in localStorage' });
        return;
      }
      
      console.log('🔍 Client: Sending token to server for verification...');
      
      const response = await fetch('/api/test-auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      
      const data = await response.json();
      console.log('🔍 Client: Server response:', data);
      
      setResults(data);
    } catch (error) {
      console.error('🔍 Client: Error:', error);
      setResults({ error: error instanceof Error ? error.message : 'Unknown error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Authentication Test</h1>
      
      <button
        onClick={testAuth}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
      >
        {loading ? 'Testing...' : 'Test Authentication'}
      </button>
      
      {results && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="font-bold mb-2">Results:</h2>
          <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
            {JSON.stringify(results, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-4 text-sm text-gray-600">
        <p>Check browser console for detailed logs</p>
        <p>This page tests client-side token verification</p>
      </div>
    </div>
  );
}