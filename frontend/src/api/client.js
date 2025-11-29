const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export async function getFormSchema() {
  const response = await fetch(`${API_BASE_URL}/api/form-schema`);
  if (!response.ok) {
    throw new Error('Failed to fetch form schema');
  }
  return response.json();
}

export async function submitForm(data) {
  const response = await fetch(`${API_BASE_URL}/api/submissions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw result;
  }

  return result;
}

export async function getSubmissions({ page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' }) {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sortBy,
    sortOrder,
  });

  const response = await fetch(`${API_BASE_URL}/api/submissions?${params}`);

  if (!response.ok) {
    throw new Error('Failed to fetch submissions');
  }

  return response.json();
}