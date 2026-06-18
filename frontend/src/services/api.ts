import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // Crucial for sessions/cookies
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API
export const authApi = {
  login: async (credentials: any) => {
    const response = await api.post('/admin/login', credentials);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/admin/logout');
    return response.data;
  },
  checkSession: async () => {
    const response = await api.get('/admin/current-admin');
    return response.data;
  }
};

// Doctors API
export const doctorsApi = {
  getAll: async (availableOnly = false) => {
    const url = availableOnly ? '/api/doctors?available=true' : '/api/doctors';
    const response = await api.get(url);
    return response.data;
  },
  getById: async (id: string) => {
    const response = await api.get(`/api/doctors/${id}`);
    return response.data;
  },
  create: async (formData: FormData) => {
    const response = await api.post('/api/doctors', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  update: async (id: string, formData: FormData) => {
    const response = await api.put(`/api/doctors/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/doctors/${id}`);
    return response.data;
  },
  toggleStatus: async (id: string) => {
    const response = await api.patch(`/api/doctors/${id}/status`);
    return response.data;
  }
};

// Departments API
export const departmentsApi = {
  getAll: async () => {
    const response = await api.get('/api/departments');
    return response.data;
  },
  create: async (formData: FormData) => {
    const response = await api.post('/api/departments', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  update: async (id: string, formData: FormData) => {
    const response = await api.put(`/api/departments/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/departments/${id}`);
    return response.data;
  }
};

// Appointments API
export const appointmentsApi = {
  create: async (data: any) => {
    const response = await api.post('/api/appointments', data);
    return response.data;
  },
  getAll: async (params?: { search?: string; status?: string; department?: string; doctor?: string; date?: string }) => {
    const response = await api.get('/api/appointments', { params });
    return response.data;
  },
  update: async (id: string, data: any) => {
    const response = await api.put(`/api/appointments/${id}`, data);
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/appointments/${id}`);
    return response.data;
  },
  getStatus: async (appointmentId: string) => {
    const response = await api.get(`/api/appointments/status/${appointmentId}`);
    return response.data;
  },
  getAvailableSlots: async (doctorId: string, date: string) => {
    const response = await api.get(`/api/appointments/available-slots`, {
      params: { doctorId, date }
    });
    return response.data;
  }
};

// News API
export const newsApi = {
  getAll: async () => {
    const response = await api.get('/api/news');
    return response.data;
  },
  create: async (formData: FormData) => {
    const response = await api.post('/api/news', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  update: async (id: string, formData: FormData) => {
    const response = await api.put(`/api/news/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/news/${id}`);
    return response.data;
  }
};

// Testimonials API
export const testimonialsApi = {
  getAll: async () => {
    const response = await api.get('/api/testimonials');
    return response.data;
  },
  create: async (formData: FormData) => {
    const response = await api.post('/api/testimonials', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  update: async (id: string, formData: FormData) => {
    const response = await api.put(`/api/testimonials/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/testimonials/${id}`);
    return response.data;
  }
};

// Gallery API
export const galleryApi = {
  getAll: async () => {
    const response = await api.get('/api/gallery');
    return response.data;
  },
  create: async (formData: FormData) => {
    const response = await api.post('/api/gallery', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },
  delete: async (id: string) => {
    const response = await api.delete(`/api/gallery/${id}`);
    return response.data;
  }
};

// Stats API
export const statsApi = {
  get: async () => {
    const response = await api.get('/api/stats');
    return response.data;
  },
  update: async (data: any) => {
    const response = await api.put('/api/stats', data);
    return response.data;
  }
};

// Contacts API
export const contactsApi = {
  getAll: async () => {
    const response = await api.get('/api/contacts');
    return response.data;
  },
  create: async (data: any) => {
    const response = await api.post('/api/contacts', data);
    return response.data;
  }
};

export default api;
