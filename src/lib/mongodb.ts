const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export const api = {
  async post(endpoint: string, data: any) {
    console.log('API POST to:', `${API_URL}${endpoint}`, 'with data:', data);
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    console.log('API Response status:', response.status);
    if (!response.ok) {
      const errorText = await response.text();
      console.log('API Error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    console.log('API Response data:', result);
    return result;
  },

  async get(endpoint: string) {
    const response = await fetch(`${API_URL}${endpoint}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  }
};