import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  doctorsApi, 
  departmentsApi, 
  appointmentsApi,
  newsApi,
  testimonialsApi,
  galleryApi,
  statsApi,
  contactsApi
} from '../services/api';
import { 
  LayoutDashboard, 
  Users, 
  Layers, 
  Calendar, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Check, 
  X, 
  Search, 
  Filter, 
  CheckCircle, 
  Clock, 
  XCircle, 
  Image as ImageIcon, 
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  Menu,
  Download,
  Newspaper,
  Star,
  MessageSquare,
  BarChart3,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { printVoucher } from '../components/Modals';

type Tab = 'overview' | 'appointments' | 'doctors' | 'departments' | 'news' | 'gallery' | 'testimonials' | 'enquiries' | 'stats';

interface DoctorType {
  _id: string;
  doctorName: { en: string; mr: string };
  specialization: { en: string; mr: string };
  qualification: { en: string; mr: string };
  experience: { en: string; mr: string };
  department: string;
  image: string;
  available: boolean;
}

interface DepartmentType {
  _id: string;
  departmentName: { en: string; mr: string };
  description: { en: string; mr: string };
  icon: string;
  image: string;
}

interface AppointmentType {
  _id: string;
  appointmentId?: string;
  patientName: string;
  mobile: string;
  email?: string;
  department: string;
  departmentMr?: string;
  doctor: string;
  doctorMr?: string;
  appointmentDate: string;
  appointmentSlot: string;
  message?: string;
  status: 'Pending' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const { logout, adminUser, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Data States
  const [doctors, setDoctors] = useState<DoctorType[]>([]);
  const [departments, setDepartments] = useState<DepartmentType[]>([]);
  const [appointments, setAppointments] = useState<AppointmentType[]>([]);
  const [news, setNews] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [gallery, setGallery] = useState<any[]>([]);
  const [contacts, setContacts] = useState<any[]>([]);
  const [stats, setStats] = useState({
    beds: 1200,
    doctors: 150,
    campusArea: '7 Lakh+ Sq.Ft.',
    emergencyStatus: 'Active'
  });

  // Search & Filter States
  const [appSearch, setAppSearch] = useState('');
  const [appStatusFilter, setAppStatusFilter] = useState('All');
  const [appDeptFilter, setAppDeptFilter] = useState('All');

  // Modal / Form States
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);
  const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
  const [isNewsModalOpen, setIsNewsModalOpen] = useState(false);
  const [isTestimonialModalOpen, setIsTestimonialModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  
  // Doctor Form State
  const [editingDoctorId, setEditingDoctorId] = useState<string | null>(null);
  const [doctorForm, setDoctorForm] = useState({
    doctorNameEn: '',
    doctorNameMr: '',
    specializationEn: '',
    specializationMr: '',
    qualificationEn: '',
    qualificationMr: '',
    experienceEn: '',
    experienceMr: '',
    department: '',
    available: true
  });
  const [doctorImageFile, setDoctorImageFile] = useState<File | null>(null);
  const [doctorImagePreview, setDoctorImagePreview] = useState<string>('');

  // Department Form State
  const [editingDeptId, setEditingDeptId] = useState<string | null>(null);
  const [deptForm, setDeptForm] = useState({
    departmentNameEn: '',
    departmentNameMr: '',
    descriptionEn: '',
    descriptionMr: '',
    icon: 'Activity'
  });
  const [deptImageFile, setDeptImageFile] = useState<File | null>(null);
  const [deptImagePreview, setDeptImagePreview] = useState<string>('');

  // News Form State
  const [editingNewsId, setEditingNewsId] = useState<string | null>(null);
  const [newsForm, setNewsForm] = useState({
    titleEn: '',
    titleMr: '',
    descriptionEn: '',
    descriptionMr: '',
    date: new Date().toISOString().split('T')[0]
  });
  const [newsImageFile, setNewsImageFile] = useState<File | null>(null);
  const [newsImagePreview, setNewsImagePreview] = useState<string>('');

  // Testimonial Form State
  const [editingTestimonialId, setEditingTestimonialId] = useState<string | null>(null);
  const [testimonialForm, setTestimonialForm] = useState({
    patientName: '',
    feedback: '',
    rating: 5
  });
  const [testimonialImageFile, setTestimonialImageFile] = useState<File | null>(null);
  const [testimonialImagePreview, setTestimonialImagePreview] = useState<string>('');

  // Gallery Form State
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Hospital'
  });
  const [galleryImageFile, setGalleryImageFile] = useState<File | null>(null);
  const [galleryImagePreview, setGalleryImagePreview] = useState<string>('');

  // Stats Form State
  const [statsForm, setStatsForm] = useState({
    beds: 1200,
    doctors: 150,
    campusArea: '7 Lakh+ Sq.Ft.',
    emergencyStatus: 'Active'
  });

  // Check Auth
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/admin/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load Data
  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [docsRes, deptsRes, appsRes, newsRes, testimonialsRes, galleryRes, contactsRes, statsRes] = await Promise.all([
        doctorsApi.getAll(false),
        departmentsApi.getAll(),
        appointmentsApi.getAll(),
        newsApi.getAll(),
        testimonialsApi.getAll(),
        galleryApi.getAll(),
        contactsApi.getAll(),
        statsApi.get()
      ]);
      if (docsRes.success) setDoctors(docsRes.doctors);
      if (deptsRes.success) setDepartments(deptsRes.departments);
      if (appsRes.success) setAppointments(appsRes.appointments);
      if (newsRes.success) setNews(newsRes.news);
      if (testimonialsRes.success) setTestimonials(testimonialsRes.testimonials);
      if (galleryRes.success) setGallery(galleryRes.gallery);
      if (contactsRes.success) setContacts(contactsRes.contacts);
      if (statsRes.success && statsRes.stats) {
        setStats(statsRes.stats);
        setStatsForm({
          beds: statsRes.stats.beds,
          doctors: statsRes.stats.doctors,
          campusArea: statsRes.stats.campusArea,
          emergencyStatus: statsRes.stats.emergencyStatus
        });
      }
    } catch (err) {
      console.error('Error loading admin dashboard data:', err);
      showNotification('error', 'Failed to fetch latest records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboardData();
    }
  }, [isAuthenticated]);

  // Search & Filter Appointments
  const loadFilteredAppointments = async () => {
    try {
      const res = await appointmentsApi.getAll({
        search: appSearch,
        status: appStatusFilter,
        department: appDeptFilter
      });
      if (res.success) {
        setAppointments(res.appointments);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      const timer = setTimeout(() => {
        loadFilteredAppointments();
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [appSearch, appStatusFilter, appDeptFilter]);

  const showNotification = (type: 'success' | 'error', message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  // Logout Handler
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/admin/login');
    } catch (err) {
      showNotification('error', 'Logout failed');
    }
  };

  // Appointment Actions
  const handleUpdateAppStatus = async (id: string, status: 'Confirmed' | 'Completed' | 'Cancelled') => {
    try {
      const res = await appointmentsApi.update(id, { status });
      if (res.success) {
        setAppointments(prev => prev.map(app => app._id === id ? { ...app, status } : app));
        showNotification('success', `Appointment marked as ${status}`);
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleDeleteAppointment = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) return;
    try {
      const res = await appointmentsApi.delete(id);
      if (res.success) {
        setAppointments(prev => prev.filter(app => app._id !== id));
        showNotification('success', 'Appointment deleted successfully');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to delete appointment');
    }
  };

  // Doctor Actions
  const handleDoctorImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDoctorImageFile(file);
      setDoctorImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddDoctor = () => {
    setEditingDoctorId(null);
    setDoctorForm({
      doctorNameEn: '',
      doctorNameMr: '',
      specializationEn: '',
      specializationMr: '',
      qualificationEn: '',
      qualificationMr: '',
      experienceEn: '',
      experienceMr: '',
      department: departments[0]?.departmentName.en || '',
      available: true
    });
    setDoctorImageFile(null);
    setDoctorImagePreview('');
    setIsDoctorModalOpen(true);
  };

  const handleOpenEditDoctor = (doc: DoctorType) => {
    setEditingDoctorId(doc._id);
    setDoctorForm({
      doctorNameEn: doc.doctorName.en,
      doctorNameMr: doc.doctorName.mr,
      specializationEn: doc.specialization.en,
      specializationMr: doc.specialization.mr,
      qualificationEn: doc.qualification.en,
      qualificationMr: doc.qualification.mr,
      experienceEn: doc.experience.en,
      experienceMr: doc.experience.mr,
      department: doc.department,
      available: doc.available
    });
    setDoctorImageFile(null);
    setDoctorImagePreview(doc.image);
    setIsDoctorModalOpen(true);
  };

  const handleSaveDoctor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !doctorForm.doctorNameEn || !doctorForm.doctorNameMr ||
      !doctorForm.specializationEn || !doctorForm.specializationMr ||
      !doctorForm.qualificationEn || !doctorForm.qualificationMr ||
      !doctorForm.experienceEn || !doctorForm.experienceMr ||
      !doctorForm.department
    ) {
      showNotification('error', 'All fields are required.');
      return;
    }

    if (!editingDoctorId && !doctorImageFile) {
      showNotification('error', 'Doctor image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('doctorName', JSON.stringify({ en: doctorForm.doctorNameEn, mr: doctorForm.doctorNameMr }));
    formData.append('specialization', JSON.stringify({ en: doctorForm.specializationEn, mr: doctorForm.specializationMr }));
    formData.append('qualification', JSON.stringify({ en: doctorForm.qualificationEn, mr: doctorForm.qualificationMr }));
    formData.append('experience', JSON.stringify({ en: doctorForm.experienceEn, mr: doctorForm.experienceMr }));
    formData.append('department', doctorForm.department);
    formData.append('available', String(doctorForm.available));
    if (doctorImageFile) {
      formData.append('image', doctorImageFile);
    }

    setLoading(true);
    try {
      let res;
      if (editingDoctorId) {
        res = await doctorsApi.update(editingDoctorId, formData);
        if (res.success) {
          setDoctors(prev => prev.map(d => d._id === editingDoctorId ? res.doctor : d));
          showNotification('success', 'Doctor updated successfully');
        }
      } else {
        res = await doctorsApi.create(formData);
        if (res.success) {
          setDoctors(prev => [res.doctor, ...prev]);
          showNotification('success', 'Doctor added successfully');
        }
      }
      setIsDoctorModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to save doctor');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDoctor = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this doctor?')) return;
    try {
      const res = await doctorsApi.delete(id);
      if (res.success) {
        setDoctors(prev => prev.filter(d => d._id !== id));
        showNotification('success', 'Doctor deleted successfully');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to delete doctor');
    }
  };

  const handleToggleDoctorAvailability = async (id: string) => {
    try {
      const res = await doctorsApi.toggleStatus(id);
      if (res.success) {
        setDoctors(prev => prev.map(d => d._id === id ? { ...d, available: res.available } : d));
        showNotification('success', res.message);
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to update availability status');
    }
  };

  // Department Actions
  const handleDeptImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setDeptImageFile(file);
      setDeptImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddDept = () => {
    setEditingDeptId(null);
    setDeptForm({
      departmentNameEn: '',
      departmentNameMr: '',
      descriptionEn: '',
      descriptionMr: '',
      icon: 'Activity'
    });
    setDeptImageFile(null);
    setDeptImagePreview('');
    setIsDeptModalOpen(true);
  };

  const handleOpenEditDept = (dept: DepartmentType) => {
    setEditingDeptId(dept._id);
    setDeptForm({
      departmentNameEn: dept.departmentName.en,
      departmentNameMr: dept.departmentName.mr,
      descriptionEn: dept.description?.en || '',
      descriptionMr: dept.description?.mr || '',
      icon: dept.icon || 'Activity'
    });
    setDeptImageFile(null);
    setDeptImagePreview(dept.image || '');
    setIsDeptModalOpen(true);
  };

  const handleSaveDept = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptForm.departmentNameEn || !deptForm.departmentNameMr) {
      showNotification('error', 'Department Name is required for both English and Marathi.');
      return;
    }

    if (!editingDeptId && !deptImageFile) {
      showNotification('error', 'Department image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('departmentName', JSON.stringify({ en: deptForm.departmentNameEn, mr: deptForm.departmentNameMr }));
    formData.append('description', JSON.stringify({ en: deptForm.descriptionEn, mr: deptForm.descriptionMr }));
    formData.append('icon', deptForm.icon);
    if (deptImageFile) {
      formData.append('image', deptImageFile);
    }

    setLoading(true);
    try {
      let res;
      if (editingDeptId) {
        res = await departmentsApi.update(editingDeptId, formData);
        if (res.success) {
          setDepartments(prev => prev.map(d => d._id === editingDeptId ? res.department : d));
          showNotification('success', 'Department updated successfully');
        }
      } else {
        res = await departmentsApi.create(formData);
        if (res.success) {
          setDepartments(prev => [...prev, res.department]);
          showNotification('success', 'Department created successfully');
        }
      }
      setIsDeptModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to save department');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDept = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this department?')) return;
    try {
      const res = await departmentsApi.delete(id);
      if (res.success) {
        setDepartments(prev => prev.filter(d => d._id !== id));
        showNotification('success', 'Department deleted successfully');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to delete department');
    }
  };

  // News Actions
  const handleNewsImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setNewsImageFile(file);
      setNewsImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddNews = () => {
    setEditingNewsId(null);
    setNewsForm({
      titleEn: '',
      titleMr: '',
      descriptionEn: '',
      descriptionMr: '',
      date: new Date().toISOString().split('T')[0]
    });
    setNewsImageFile(null);
    setNewsImagePreview('');
    setIsNewsModalOpen(true);
  };

  const handleOpenEditNews = (post: any) => {
    setEditingNewsId(post._id);
    setNewsForm({
      titleEn: post.title.en,
      titleMr: post.title.mr,
      descriptionEn: post.description.en,
      descriptionMr: post.description.mr,
      date: post.date ? new Date(post.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
    });
    setNewsImageFile(null);
    setNewsImagePreview(post.image || '');
    setIsNewsModalOpen(true);
  };

  const handleSaveNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsForm.titleEn || !newsForm.titleMr || !newsForm.descriptionEn || !newsForm.descriptionMr) {
      showNotification('error', 'Title and description are required for both English and Marathi.');
      return;
    }

    if (!editingNewsId && !newsImageFile) {
      showNotification('error', 'News cover image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', JSON.stringify({ en: newsForm.titleEn, mr: newsForm.titleMr }));
    formData.append('description', JSON.stringify({ en: newsForm.descriptionEn, mr: newsForm.descriptionMr }));
    formData.append('date', newsForm.date);
    if (newsImageFile) {
      formData.append('image', newsImageFile);
    }

    setLoading(true);
    try {
      let res;
      if (editingNewsId) {
        res = await newsApi.update(editingNewsId, formData);
        if (res.success) {
          setNews(prev => prev.map(n => n._id === editingNewsId ? res.news : n));
          showNotification('success', 'News post updated successfully');
        }
      } else {
        res = await newsApi.create(formData);
        if (res.success) {
          setNews(prev => [res.news, ...prev]);
          showNotification('success', 'News post added successfully');
        }
      }
      setIsNewsModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to save news post');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this news post?')) return;
    try {
      const res = await newsApi.delete(id);
      if (res.success) {
        setNews(prev => prev.filter(n => n._id !== id));
        showNotification('success', 'News post deleted successfully');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to delete news post');
    }
  };

  // Testimonial Actions
  const handleTestimonialImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTestimonialImageFile(file);
      setTestimonialImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddTestimonial = () => {
    setEditingTestimonialId(null);
    setTestimonialForm({
      patientName: '',
      feedback: '',
      rating: 5
    });
    setTestimonialImageFile(null);
    setTestimonialImagePreview('');
    setIsTestimonialModalOpen(true);
  };

  const handleOpenEditTestimonial = (item: any) => {
    setEditingTestimonialId(item._id);
    setTestimonialForm({
      patientName: item.patientName,
      feedback: item.feedback,
      rating: item.rating || 5
    });
    setTestimonialImageFile(null);
    setTestimonialImagePreview(item.image || '');
    setIsTestimonialModalOpen(true);
  };

  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!testimonialForm.patientName || !testimonialForm.feedback) {
      showNotification('error', 'Patient name and feedback are required.');
      return;
    }

    const formData = new FormData();
    formData.append('patientName', testimonialForm.patientName);
    formData.append('feedback', testimonialForm.feedback);
    formData.append('rating', String(testimonialForm.rating));
    if (testimonialImageFile) {
      formData.append('image', testimonialImageFile);
    }

    setLoading(true);
    try {
      let res;
      if (editingTestimonialId) {
        res = await testimonialsApi.update(editingTestimonialId, formData);
        if (res.success) {
          setTestimonials(prev => prev.map(t => t._id === editingTestimonialId ? res.testimonial : t));
          showNotification('success', 'Testimonial updated successfully');
        }
      } else {
        res = await testimonialsApi.create(formData);
        if (res.success) {
          setTestimonials(prev => [res.testimonial, ...prev]);
          showNotification('success', 'Testimonial created successfully');
        }
      }
      setIsTestimonialModalOpen(false);
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to save testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
    try {
      const res = await testimonialsApi.delete(id);
      if (res.success) {
        setTestimonials(prev => prev.filter(t => t._id !== id));
        showNotification('success', 'Testimonial deleted successfully');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to delete testimonial');
    }
  };

  // Gallery Actions
  const handleGalleryImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setGalleryImageFile(file);
      setGalleryImagePreview(URL.createObjectURL(file));
    }
  };

  const handleOpenAddGallery = () => {
    setGalleryForm({
      title: '',
      category: 'Hospital'
    });
    setGalleryImageFile(null);
    setGalleryImagePreview('');
    setIsGalleryModalOpen(true);
  };

  const handleSaveGallery = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!galleryForm.title || !galleryForm.category) {
      showNotification('error', 'Title and category are required.');
      return;
    }

    if (!galleryImageFile) {
      showNotification('error', 'Gallery image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('title', galleryForm.title);
    formData.append('category', galleryForm.category);
    formData.append('image', galleryImageFile);

    setLoading(true);
    try {
      const res = await galleryApi.create(formData);
      if (res.success) {
        setGallery(prev => [res.gallery, ...prev]);
        showNotification('success', 'Image added to gallery successfully');
        setIsGalleryModalOpen(false);
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to add image');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteGallery = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this gallery item?')) return;
    try {
      const res = await galleryApi.delete(id);
      if (res.success) {
        setGallery(prev => prev.filter(g => g._id !== id));
        showNotification('success', 'Gallery item deleted successfully');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to delete gallery item');
    }
  };

  // Stats Actions
  const handleSaveStats = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await statsApi.update(statsForm);
      if (res.success) {
        setStats(res.stats);
        showNotification('success', 'Hospital statistics updated dynamically');
      }
    } catch (err: any) {
      showNotification('error', err.response?.data?.message || 'Failed to update statistics');
    } finally {
      setLoading(false);
    }
  };

  // Calculated Stats
  const totalDocs = doctors.length;
  const totalDepts = departments.length;
  const pendingApps = appointments.filter(app => app.status === 'Pending').length;
  const totalApps = appointments.length;
  const totalContacts = contacts.length;
  const totalNews = news.length;

  // Group appointments slot-wise for the slot view on the overview tab
  const getSlotwiseAppointments = () => {
    const sorted = [...appointments].sort((a, b) => new Date(a.appointmentDate).getTime() - new Date(b.appointmentDate).getTime());
    return sorted;
  };

  const slotwiseApps = getSlotwiseAppointments();

  if (authLoading || (!isAuthenticated && authLoading)) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(2, 132, 199, 0.15)', borderTopColor: 'var(--med-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-primary)', position: 'relative' }}>
      
      {/* Dynamic Toast Notifications */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            style={{
              position: 'fixed',
              top: '20px',
              left: '50%',
              zIndex: 9999,
              padding: '12px 24px',
              borderRadius: 'var(--radius-md)',
              background: notification.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: notification.type === 'success' ? '#15803d' : '#b91c1c',
              border: `1px solid ${notification.type === 'success' ? '#bbf7d0' : '#fca5a5'}`,
              boxShadow: 'var(--shadow-xl)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
              fontSize: '0.92rem'
            }}
          >
            {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} />}
            <span>{notification.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside 
        style={{
          width: isSidebarOpen ? '240px' : '0px',
          background: 'var(--primary)',
          color: 'white',
          display: 'flex',
          flexDirection: 'column',
          transition: 'all var(--transition-normal)',
          overflow: 'hidden',
          zIndex: 850,
          position: 'relative',
          borderRight: '1px solid rgba(255,255,255,0.06)'
        }}
        className="admin-sidebar"
      >
        <div style={{ padding: '24px 20px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: '6px', borderRadius: '8px' }}>
            <Users size={20} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.1rem', letterSpacing: '-0.5px' }}>
            TMPM Admin
          </span>
        </div>

        {/* Sidebar Nav links */}
        <nav style={{ flexGrow: 1, padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          <button onClick={() => setActiveTab('overview')} className={`sidebar-nav-btn ${activeTab === 'overview' ? 'active' : ''}`}>
            <LayoutDashboard size={16} />
            <span>Overview</span>
          </button>
          
          <button onClick={() => setActiveTab('appointments')} className={`sidebar-nav-btn ${activeTab === 'appointments' ? 'active' : ''}`}>
            <Calendar size={16} />
            <span>Appointments</span>
          </button>

          <button onClick={() => setActiveTab('doctors')} className={`sidebar-nav-btn ${activeTab === 'doctors' ? 'active' : ''}`}>
            <Users size={16} />
            <span>Doctors</span>
          </button>

          <button onClick={() => setActiveTab('departments')} className={`sidebar-nav-btn ${activeTab === 'departments' ? 'active' : ''}`}>
            <Layers size={16} />
            <span>Departments</span>
          </button>

          <button onClick={() => setActiveTab('news')} className={`sidebar-nav-btn ${activeTab === 'news' ? 'active' : ''}`}>
            <Newspaper size={16} />
            <span>News Posts</span>
          </button>

          <button onClick={() => setActiveTab('gallery')} className={`sidebar-nav-btn ${activeTab === 'gallery' ? 'active' : ''}`}>
            <ImageIcon size={16} />
            <span>Gallery</span>
          </button>

          <button onClick={() => setActiveTab('testimonials')} className={`sidebar-nav-btn ${activeTab === 'testimonials' ? 'active' : ''}`}>
            <Star size={16} />
            <span>Testimonials</span>
          </button>

          <button onClick={() => setActiveTab('enquiries')} className={`sidebar-nav-btn ${activeTab === 'enquiries' ? 'active' : ''}`}>
            <MessageSquare size={16} />
            <span>Enquiries</span>
          </button>

          <button onClick={() => setActiveTab('stats')} className={`sidebar-nav-btn ${activeTab === 'stats' ? 'active' : ''}`}>
            <BarChart3 size={16} />
            <span>Hospital Stats</span>
          </button>
        </nav>

        {/* User Footer info in Sidebar */}
        <div style={{ padding: '16px 12px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.6)' }}>
            Logged in as: <strong style={{ color: 'white', display: 'block' }}>{adminUser?.username}</strong>
          </div>
          <button 
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'rgba(239, 68, 68, 0.1)',
              color: '#f87171',
              border: '1px solid rgba(239, 68, 68, 0.2)',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.8rem',
              width: '100%',
              justifyContent: 'center',
              transition: 'var(--transition-fast)'
            }}
            className="hover-red-btn"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}>
        
        {/* Workspace Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid var(--border-muted)',
          padding: '16px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 800
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-primary)', display: 'flex', padding: '4px' }}
            >
              <Menu size={22} />
            </button>
            <h1 style={{ fontSize: '1.25rem', color: 'var(--primary)', textTransform: 'capitalize' }}>
              {activeTab === 'overview' ? 'Dashboard Summary' : `${activeTab} management`}
            </h1>
          </div>

          <a href="/" target="_blank" rel="noopener noreferrer" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            color: 'var(--med-blue)',
            fontWeight: 600,
            cursor: 'pointer'
          }}>
            <span>Visit Public Website</span>
            <ExternalLink size={14} />
          </a>
        </header>

        {/* Tab Contents */}
        <main style={{ padding: '32px 24px', flexGrow: 1, maxWidth: '1400px', width: '100%', margin: '0 auto' }}>
          {loading && (
            <div style={{
              position: 'fixed',
              top: '80px',
              right: '24px',
              zIndex: 999,
              background: 'white',
              padding: '8px 16px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--border-muted)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.85rem',
              color: 'var(--text-muted)'
            }}>
              <div style={{ width: '14px', height: '14px', border: '2px solid rgba(2, 132, 199, 0.15)', borderTopColor: 'var(--med-blue)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <span>Updating...</span>
            </div>
          )}

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
              
              {/* Stat Cards Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '20px'
              }}>
                <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--border-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Doctors</span>
                    <h3 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--primary)', fontWeight: 800 }}>{totalDocs}</h3>
                  </div>
                  <div style={{ background: 'var(--med-blue-light)', color: 'var(--med-blue)', padding: '10px', borderRadius: '10px' }}>
                    <Users size={20} />
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--border-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Departments</span>
                    <h3 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--primary)', fontWeight: 800 }}>{totalDepts}</h3>
                  </div>
                  <div style={{ background: 'var(--cyan-light)', color: 'var(--cyan-hover)', padding: '10px', borderRadius: '10px' }}>
                    <Layers size={20} />
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--border-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Pending Appts</span>
                    <h3 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'orange', fontWeight: 800 }}>{pendingApps}</h3>
                  </div>
                  <div style={{ background: '#fef3c7', color: '#d97706', padding: '10px', borderRadius: '10px' }}>
                    <Clock size={20} />
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--border-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Total Enquiries</span>
                    <h3 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--med-blue)', fontWeight: 800 }}>{totalContacts}</h3>
                  </div>
                  <div style={{ background: 'rgba(2, 132, 199, 0.05)', color: 'var(--med-blue)', padding: '10px', borderRadius: '10px' }}>
                    <MessageSquare size={20} />
                  </div>
                </div>

                <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--border-muted)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>News Announcements</span>
                    <h3 style={{ fontSize: '1.8rem', marginTop: '4px', color: 'var(--primary)', fontWeight: 800 }}>{totalNews}</h3>
                  </div>
                  <div style={{ background: 'rgba(2, 132, 199, 0.05)', color: 'var(--med-blue)', padding: '10px', borderRadius: '10px' }}>
                    <Newspaper size={20} />
                  </div>
                </div>
              </div>

              {/* Slot-wise Appointment View */}
              <div className="glass-panel" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-muted)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--primary)' }}>Slot-wise Schedule View</h3>
                {slotwiseApps.length === 0 ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    No slots booked yet.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                    {slotwiseApps.slice(0, 8).map(app => (
                      <div key={app._id} style={{
                        padding: '14px',
                        border: '1px solid var(--border-muted)',
                        borderRadius: '8px',
                        background: 'var(--bg-primary)'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--med-blue)' }}>{app.appointmentId}</span>
                          <span style={{ fontSize: '0.75rem', padding: '2px 6px', borderRadius: '4px', background: 'white', fontWeight: 700, border: '1px solid var(--border-muted)' }}>
                            {app.appointmentSlot}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>{app.patientName}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                          <strong>Doctor:</strong> {app.doctor}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <strong>Date:</strong> {new Date(app.appointmentDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Recent Appointments Preview */}
              <div className="glass-panel" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-muted)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Recent Bookings</h3>
                  <button onClick={() => setActiveTab('appointments')} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <span>Manage All</span>
                    <ChevronRight size={14} />
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  {appointments.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No appointments booked yet.
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-muted)' }}>
                          <th style={{ padding: '12px' }}>Appt ID</th>
                          <th style={{ padding: '12px' }}>Patient</th>
                          <th style={{ padding: '12px' }}>Contact</th>
                          <th style={{ padding: '12px' }}>Department</th>
                          <th style={{ padding: '12px' }}>Doctor</th>
                          <th style={{ padding: '12px' }}>Date/Slot</th>
                          <th style={{ padding: '12px' }}>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.slice(0, 5).map(app => (
                          <tr key={app._id} style={{ borderBottom: '1px solid var(--border-muted)' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: 'var(--med-blue)' }}>{app.appointmentId || '-'}</td>
                            <td style={{ padding: '12px', fontWeight: 600 }}>{app.patientName}</td>
                            <td style={{ padding: '12px' }}>{app.mobile}</td>
                            <td style={{ padding: '12px' }}>{app.department}</td>
                            <td style={{ padding: '12px' }}>{app.doctor}</td>
                            <td style={{ padding: '12px' }}>
                              <div>{new Date(app.appointmentDate).toLocaleDateString()}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>{app.appointmentSlot}</div>
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span className={`status-pill ${app.status.toLowerCase()}`}>
                                {app.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* Search & Filters */}
              <div className="glass-panel" style={{ padding: '20px', background: 'white', border: '1px solid var(--border-muted)', display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ position: 'relative', flexGrow: 1, minWidth: '220px' }}>
                  <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input 
                    type="text" 
                    placeholder="Search by Patient name, phone, email, or Appt ID..."
                    value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 10px 10px 36px',
                      borderRadius: '8px',
                      border: '1px solid var(--border-muted)',
                      fontSize: '0.9rem'
                    }}
                  />
                </div>

                {/* Status Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Status:</span>
                  <select 
                    value={appStatusFilter} 
                    onChange={(e) => setAppStatusFilter(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-muted)', fontSize: '0.88rem', backgroundColor: 'white' }}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </div>

                {/* Department Filter */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Filter size={14} style={{ color: 'var(--text-muted)' }} />
                  <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Dept:</span>
                  <select 
                    value={appDeptFilter} 
                    onChange={(e) => setAppDeptFilter(e.target.value)}
                    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-muted)', fontSize: '0.88rem', backgroundColor: 'white' }}
                  >
                    <option value="All">All Departments</option>
                    {departments.map(d => (
                      <option key={d._id} value={d.departmentName.en}>{d.departmentName.en}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Table */}
              <div className="glass-panel" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-muted)' }}>
                <div style={{ overflowX: 'auto' }}>
                  {appointments.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No appointments matching filters.
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-muted)' }}>
                          <th style={{ padding: '12px' }}>Appt ID</th>
                          <th style={{ padding: '12px' }}>Patient Info</th>
                          <th style={{ padding: '12px' }}>Date / Slot</th>
                          <th style={{ padding: '12px' }}>Department</th>
                          <th style={{ padding: '12px' }}>Doctor</th>
                          <th style={{ padding: '12px' }}>Message</th>
                          <th style={{ padding: '12px' }}>Status</th>
                          <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map(app => (
                          <tr key={app._id} style={{ borderBottom: '1px solid var(--border-muted)' }}>
                            <td style={{ padding: '12px', fontWeight: 700, color: 'var(--med-blue)' }}>{app.appointmentId || '-'}</td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{app.patientName}</div>
                              <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Mob: {app.mobile}</div>
                              {app.email && <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{app.email}</div>}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <div style={{ fontWeight: 500 }}>{new Date(app.appointmentDate).toLocaleDateString()}</div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 700 }}>{app.appointmentSlot}</div>
                            </td>
                            <td style={{ padding: '12px' }}>{app.department}</td>
                            <td style={{ padding: '12px' }}>{app.doctor}</td>
                            <td style={{ padding: '12px', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={app.message}>
                              {app.message || '-'}
                            </td>
                            <td style={{ padding: '12px' }}>
                              <span className={`status-pill ${app.status.toLowerCase()}`}>
                                {app.status}
                              </span>
                            </td>
                            <td style={{ padding: '12px', textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                                <button 
                                  onClick={() => printVoucher(app)}
                                  title="Print Voucher / PDF"
                                  className="action-icon-btn print"
                                >
                                  <Download size={14} />
                                </button>
                                {app.status === 'Pending' && (
                                  <button 
                                    onClick={() => handleUpdateAppStatus(app._id, 'Confirmed')}
                                    title="Confirm Appointment"
                                    className="action-icon-btn confirm"
                                  >
                                    <Check size={14} />
                                  </button>
                                )}
                                {app.status === 'Confirmed' && (
                                  <button 
                                    onClick={() => handleUpdateAppStatus(app._id, 'Completed')}
                                    title="Mark Completed"
                                    className="action-icon-btn complete"
                                  >
                                    <CheckCircle size={14} />
                                  </button>
                                )}
                                {app.status !== 'Completed' && app.status !== 'Cancelled' && (
                                  <button 
                                    onClick={() => handleUpdateAppStatus(app._id, 'Cancelled')}
                                    title="Cancel Appointment"
                                    className="action-icon-btn cancel"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                                <button 
                                  onClick={() => handleDeleteAppointment(app._id)}
                                  title="Delete Appointment"
                                  className="action-icon-btn delete"
                                >
                                  <Trash2 size={14} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'doctors' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Hospital Doctors List</h3>
                <button onClick={handleOpenAddDoctor} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Plus size={16} />
                  <span>Add New Doctor</span>
                </button>
              </div>

              {/* Grid of Doctor Cards */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '24px'
              }}>
                {doctors.map(doc => (
                  <div key={doc._id} className="glass-panel" style={{
                    padding: '20px',
                    background: 'white',
                    border: '1px solid var(--border-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}>
                    {/* Top Action Overlay */}
                    <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleOpenEditDoctor(doc)} className="action-icon-btn edit" title="Edit Doctor">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteDoctor(doc._id)} className="action-icon-btn delete" title="Delete Doctor">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '16px' }}>
                      <img 
                        src={doc.image} 
                        alt={doc.doctorName.en} 
                        style={{ width: '64px', height: '64px', objectFit: 'cover', borderRadius: '12px', background: 'var(--bg-primary)' }}
                      />
                      <div>
                        <h4 style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>{doc.doctorName.en}</h4>
                        <div style={{ fontSize: '0.82rem', color: 'var(--med-blue)', fontWeight: 600 }}>{doc.specialization.en}</div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Dept: {doc.department}</div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid var(--border-muted)', paddingTop: '12px', fontSize: '0.82rem', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div><strong>Qualification:</strong> {doc.qualification.en}</div>
                      <div><strong>Experience:</strong> {doc.experience.en}</div>
                    </div>

                    {/* Toggle Switch Availability */}
                    <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-primary)', padding: '10px 14px', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>Available for Bookings:</span>
                      <button 
                        onClick={() => handleToggleDoctorAvailability(doc._id)}
                        className={`toggle-switch-btn ${doc.available ? 'on' : 'off'}`}
                      >
                        <div className="toggle-knob" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'departments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Hospital Departments</h3>
                <button onClick={handleOpenAddDept} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Plus size={16} />
                  <span>Add Department</span>
                </button>
              </div>

              {/* Departments Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '20px'
              }}>
                {departments.map(dept => (
                  <div key={dept._id} className="glass-panel" style={{
                    padding: '20px',
                    background: 'white',
                    border: '1px solid var(--border-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    minHeight: '200px'
                  }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        {dept.image ? (
                          <img 
                            src={dept.image} 
                            alt={dept.departmentName.en} 
                            style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-muted)' }}
                          />
                        ) : (
                          <div style={{ background: 'var(--med-blue-light)', color: 'var(--med-blue)', width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                            {dept.icon ? dept.icon.substring(0, 2).toUpperCase() : 'DE'}
                          </div>
                        )}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button onClick={() => handleOpenEditDept(dept)} className="action-icon-btn edit" title="Edit Department">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => handleDeleteDept(dept._id)} className="action-icon-btn delete" title="Delete Department">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                      <h4 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 700 }}>{dept.departmentName.en}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {dept.description?.en || 'No description provided.'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'news' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem' }}>News & Updates Posts</h3>
                <button onClick={handleOpenAddNews} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Plus size={16} />
                  <span>Add News Post</span>
                </button>
              </div>

              {/* News Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
              }}>
                {news.map(post => (
                  <div key={post._id} className="glass-panel" style={{
                    padding: '20px',
                    background: 'white',
                    border: '1px solid var(--border-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}>
                    <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px', zIndex: 10 }}>
                      <button onClick={() => handleOpenEditNews(post)} className="action-icon-btn edit" title="Edit News">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteNews(post._id)} className="action-icon-btn delete" title="Delete News">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ height: '160px', overflow: 'hidden', borderRadius: '10px', marginBottom: '14px', background: 'var(--bg-primary)' }}>
                      <img src={post.image} alt={post.title.en} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>

                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--med-blue)', marginBottom: '6px', display: 'block' }}>
                      {new Date(post.date).toLocaleDateString()}
                    </span>
                    <h4 style={{ fontSize: '1.1rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 700 }}>{post.title.en}</h4>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.description.en}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'gallery' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Hospital Media Gallery</h3>
                <button onClick={handleOpenAddGallery} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Plus size={16} />
                  <span>Upload Image</span>
                </button>
              </div>

              {/* Gallery Grid */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: '20px'
              }}>
                {gallery.map(item => (
                  <div key={item._id} className="glass-panel" style={{
                    padding: '12px',
                    background: 'white',
                    border: '1px solid var(--border-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}>
                    <button 
                      onClick={() => handleDeleteGallery(item._id)} 
                      style={{ position: 'absolute', top: '20px', right: '20px', background: 'rgba(239, 68, 68, 0.9)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      title="Delete Image"
                    >
                      <Trash2 size={13} />
                    </button>
                    <div style={{ height: '140px', overflow: 'hidden', borderRadius: '8px', marginBottom: '8px', background: '#f1f5f9' }}>
                      <img src={item.image} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <div style={{ fontSize: '0.85rem', fontWeight: 700, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={item.title}>
                      {item.title}
                    </div>
                    <span style={{ alignSelf: 'flex-start', fontSize: '0.7rem', fontWeight: 800, background: 'var(--med-blue-light)', color: 'var(--med-blue)', padding: '2px 8px', borderRadius: '4px', marginTop: '6px', textTransform: 'uppercase' }}>
                      {item.category}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.15rem' }}>Patient Testimonials</h3>
                <button onClick={handleOpenAddTestimonial} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                  <Plus size={16} />
                  <span>Add Testimonial</span>
                </button>
              </div>

              {/* Testimonials List */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '24px'
              }}>
                {testimonials.map(item => (
                  <div key={item._id} className="glass-panel" style={{
                    padding: '20px',
                    background: 'white',
                    border: '1px solid var(--border-muted)',
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative'
                  }}>
                    <div style={{ position: 'absolute', top: '16px', right: '16px', display: 'flex', gap: '6px' }}>
                      <button onClick={() => handleOpenEditTestimonial(item)} className="action-icon-btn edit" title="Edit Testimonial">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteTestimonial(item._id)} className="action-icon-btn delete" title="Delete Testimonial">
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', color: '#fbbf24', marginBottom: '10px' }}>
                      {[...Array(item.rating)].map((_, i) => (
                        <Star key={i} size={16} fill="#fbbf24" stroke="none" />
                      ))}
                    </div>

                    <p style={{ fontSize: '0.85rem', lineHeight: 1.6, color: 'var(--text-secondary)', fontStyle: 'italic', marginBottom: '14px', flexGrow: 1 }}>
                      "{item.feedback}"
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img src={item.image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'} alt={item.patientName} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                      <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.patientName}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'enquiries' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Patient Contact Enquiries</h3>

              <div className="glass-panel" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-muted)' }}>
                <div style={{ overflowX: 'auto' }}>
                  {contacts.length === 0 ? (
                    <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      No enquiries received yet.
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem', textAlign: 'left' }}>
                      <thead>
                        <tr style={{ background: 'var(--bg-primary)', borderBottom: '1px solid var(--border-muted)' }}>
                          <th style={{ padding: '12px' }}>Name</th>
                          <th style={{ padding: '12px' }}>Mobile</th>
                          <th style={{ padding: '12px' }}>Email</th>
                          <th style={{ padding: '12px' }}>Message</th>
                          <th style={{ padding: '12px' }}>Submitted At</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contacts.map(c => (
                          <tr key={c._id} style={{ borderBottom: '1px solid var(--border-muted)' }}>
                            <td style={{ padding: '12px', fontWeight: 700 }}>{c.name}</td>
                            <td style={{ padding: '12px', fontWeight: 600 }}>{c.mobile}</td>
                            <td style={{ padding: '12px' }}>{c.email || '-'}</td>
                            <td style={{ padding: '12px', maxWidth: '300px', wordBreak: 'break-word' }}>{c.message}</td>
                            <td style={{ padding: '12px', color: 'var(--text-muted)' }}>{new Date(c.createdAt).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '600px' }}>
              <h3 style={{ fontSize: '1.15rem' }}>Dynamic Hospital Statistics</h3>

              <div className="glass-panel" style={{ padding: '24px', background: 'white', border: '1px solid var(--border-muted)' }}>
                <form onSubmit={handleSaveStats} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Beds Setup</label>
                    <input 
                      type="number" 
                      required
                      value={statsForm.beds}
                      onChange={e => setStatsForm({ ...statsForm, beds: parseInt(e.target.value) || 0 })}
                      style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Specialists & Doctors</label>
                    <input 
                      type="number" 
                      required
                      value={statsForm.doctors}
                      onChange={e => setStatsForm({ ...statsForm, doctors: parseInt(e.target.value) || 0 })}
                      style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Campus Area Description</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. 7 Lakh+ Sq.Ft."
                      value={statsForm.campusArea}
                      onChange={e => setStatsForm({ ...statsForm, campusArea: e.target.value })}
                      style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Trauma / Emergency Status</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Active or Inactive"
                      value={statsForm.emergencyStatus}
                      onChange={e => setStatsForm({ ...statsForm, emergencyStatus: e.target.value })}
                      style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '10px' }}>
                    Save Dynamic Stats Settings
                  </button>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Doctor Create/Edit Modal */}
      {isDoctorModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel-blue" style={{ maxWidth: '650px', background: 'white' }}>
            <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem' }}>{editingDoctorId ? 'Edit Doctor Record' : 'Add New Doctor'}</h3>
              <button onClick={() => setIsDoctorModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            
            <form onSubmit={handleSaveDoctor} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
              {/* Doctor Name (EN & MR) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Doctor Name (English)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Dr. Sarah Jenkins"
                    value={doctorForm.doctorNameEn}
                    onChange={e => setDoctorForm({ ...doctorForm, doctorNameEn: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Doctor Name (Marathi)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="उदा. डॉ. सारा जेन्किन्स"
                    value={doctorForm.doctorNameMr}
                    onChange={e => setDoctorForm({ ...doctorForm, doctorNameMr: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Specialization (EN & MR) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Specialization (English)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Cardiologist"
                    value={doctorForm.specializationEn}
                    onChange={e => setDoctorForm({ ...doctorForm, specializationEn: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Specialization (Marathi)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="उदा. हृदयरोग तज्ज्ञ"
                    value={doctorForm.specializationMr}
                    onChange={e => setDoctorForm({ ...doctorForm, specializationMr: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Qualification (EN & MR) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Qualification (English)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. MD, DM (Cardiology)"
                    value={doctorForm.qualificationEn}
                    onChange={e => setDoctorForm({ ...doctorForm, qualificationEn: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Qualification (Marathi)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="उदा. एम.डी., डी.एम."
                    value={doctorForm.qualificationMr}
                    onChange={e => setDoctorForm({ ...doctorForm, qualificationMr: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Experience (EN & MR) & Department */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Experience (English)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 14 Years"
                    value={doctorForm.experienceEn}
                    onChange={e => setDoctorForm({ ...doctorForm, experienceEn: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Experience (Marathi)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="उदा. १४ वर्षे"
                    value={doctorForm.experienceMr}
                    onChange={e => setDoctorForm({ ...doctorForm, experienceMr: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Department</label>
                <select 
                  value={doctorForm.department}
                  onChange={e => setDoctorForm({ ...doctorForm, department: e.target.value })}
                  style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'white' }}
                >
                  {departments.map(d => (
                    <option key={d._id} value={d.departmentName.en}>{d.departmentName.en}</option>
                  ))}
                </select>
              </div>

              {/* Image Upload File Picker */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Doctor Profile Image</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {doctorImagePreview ? (
                    <img 
                      src={doctorImagePreview} 
                      alt="Preview" 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-muted)' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: 'var(--bg-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={22} />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleDoctorImageChange}
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '10px' }}>
                {editingDoctorId ? 'Save Updates' : 'Create Record'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Department Create/Edit Modal */}
      {isDeptModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel-blue" style={{ maxWidth: '600px', background: 'white' }}>
            <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem' }}>{editingDeptId ? 'Edit Department' : 'Add Department'}</h3>
              <button onClick={() => setIsDeptModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveDept} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Department Name (EN & MR) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Department Name (English)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. Cardiology"
                    value={deptForm.departmentNameEn}
                    onChange={e => setDeptForm({ ...deptForm, departmentNameEn: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Department Name (Marathi)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="उदा. कार्डिओलॉजी"
                    value={deptForm.departmentNameMr}
                    onChange={e => setDeptForm({ ...deptForm, departmentNameMr: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Icon Identifier */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Icon Identifier</label>
                <input 
                  type="text" 
                  placeholder="e.g. Heart, FlaskConical, Activity"
                  value={deptForm.icon}
                  onChange={e => setDeptForm({ ...deptForm, icon: e.target.value })}
                  style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              {/* Description (EN & MR) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description (English)</label>
                  <textarea 
                    rows={3}
                    placeholder="Brief description of department..."
                    value={deptForm.descriptionEn}
                    onChange={e => setDeptForm({ ...deptForm, descriptionEn: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', resize: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description (Marathi)</label>
                  <textarea 
                    rows={3}
                    placeholder="उदा. सर्वसमावेशक हृदय आरोग्य..."
                    value={deptForm.descriptionMr}
                    onChange={e => setDeptForm({ ...deptForm, descriptionMr: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', resize: 'none' }}
                  />
                </div>
              </div>

              {/* Image Upload File Picker */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Department Cover Image</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {deptImagePreview ? (
                    <img 
                      src={deptImagePreview} 
                      alt="Preview" 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-muted)' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: 'var(--bg-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={22} />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleDeptImageChange}
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '10px' }}>
                {editingDeptId ? 'Save Changes' : 'Add Department'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* News Create/Edit Modal */}
      {isNewsModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel-blue" style={{ maxWidth: '600px', background: 'white' }}>
            <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem' }}>{editingNewsId ? 'Edit News Post' : 'Add News Announcement'}</h3>
              <button onClick={() => setIsNewsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveNews} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Title (EN & MR) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Title (English)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. New Equipment Launch"
                    value={newsForm.titleEn}
                    onChange={e => setNewsForm({ ...newsForm, titleEn: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Title (Marathi)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="उदा. नवीन उपकरणे लॉंच"
                    value={newsForm.titleMr}
                    onChange={e => setNewsForm({ ...newsForm, titleMr: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                  />
                </div>
              </div>

              {/* Description (EN & MR) */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description (English)</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="English content..."
                    value={newsForm.descriptionEn}
                    onChange={e => setNewsForm({ ...newsForm, descriptionEn: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', resize: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Description (Marathi)</label>
                  <textarea 
                    rows={4}
                    required
                    placeholder="मराठी मजकूर..."
                    value={newsForm.descriptionMr}
                    onChange={e => setNewsForm({ ...newsForm, descriptionMr: e.target.value })}
                    style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', resize: 'none' }}
                  />
                </div>
              </div>

              {/* Date */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Post Date</label>
                <input 
                  type="date"
                  required
                  value={newsForm.date}
                  onChange={e => setNewsForm({ ...newsForm, date: e.target.value })}
                  style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              {/* Image Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>News Cover Image</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {newsImagePreview ? (
                    <img 
                      src={newsImagePreview} 
                      alt="Preview" 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '10px', border: '1px solid var(--border-muted)' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: 'var(--bg-primary)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={22} />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleNewsImageChange}
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '10px' }}>
                {editingNewsId ? 'Save News Updates' : 'Publish Announcement'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Create/Edit Modal */}
      {isTestimonialModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel-blue" style={{ maxWidth: '600px', background: 'white' }}>
            <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem' }}>{editingTestimonialId ? 'Edit Testimonial' : 'Add Patient Feedback'}</h3>
              <button onClick={() => setIsTestimonialModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveTestimonial} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Patient Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe"
                  value={testimonialForm.patientName}
                  onChange={e => setTestimonialForm({ ...testimonialForm, patientName: e.target.value })}
                  style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Rating Score (1-5 Stars)</label>
                <select 
                  value={testimonialForm.rating}
                  onChange={e => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) || 5 })}
                  style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'white' }}
                >
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Feedback Comment</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="How was the patient's experience?"
                  value={testimonialForm.feedback}
                  onChange={e => setTestimonialForm({ ...testimonialForm, feedback: e.target.value })}
                  style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', resize: 'none' }}
                />
              </div>

              {/* Patient Image */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Patient Profile Image (Optional)</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {testimonialImagePreview ? (
                    <img 
                      src={testimonialImagePreview} 
                      alt="Preview" 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '50%', border: '1px solid var(--border-muted)' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: 'var(--bg-primary)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={22} />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={handleTestimonialImageChange}
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '10px' }}>
                {editingTestimonialId ? 'Save Testimonial' : 'Publish Testimonial'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Gallery Image Upload Modal */}
      {isGalleryModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content glass-panel-blue" style={{ maxWidth: '500px', background: 'white' }}>
            <div style={{ background: 'var(--gradient-primary)', color: 'white', padding: '18px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: 'white', fontSize: '1.2rem' }}>Upload Image to Gallery</h3>
              <button onClick={() => setIsGalleryModalOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGallery} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Image Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Modern CT Scanner Room"
                  value={galleryForm.title}
                  onChange={e => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem' }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Category</label>
                <select 
                  value={galleryForm.category}
                  onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })}
                  style={{ padding: '10px 12px', border: '1px solid var(--border-muted)', borderRadius: '8px', fontSize: '0.9rem', backgroundColor: 'white' }}
                >
                  <option value="Hospital">Hospital</option>
                  <option value="Events">Events</option>
                  <option value="Equipment">Equipment</option>
                  <option value="Facilities">Facilities</option>
                </select>
              </div>

              {/* Image Select */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '0.85rem', fontWeight: 600 }}>Select Image File</label>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
                  {galleryImagePreview ? (
                    <img 
                      src={galleryImagePreview} 
                      alt="Preview" 
                      style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-muted)' }}
                    />
                  ) : (
                    <div style={{ width: '60px', height: '60px', background: 'var(--bg-primary)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      <ImageIcon size={22} />
                    </div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*"
                    required
                    onChange={handleGalleryImageChange}
                    style={{ fontSize: '0.82rem' }}
                  />
                </div>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', height: '44px', marginTop: '10px' }}>
                Add to Gallery
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Styling Override */}
      <style>{`
        .sidebar-nav-btn {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 14px;
          border-radius: 8px;
          background: transparent;
          border: none;
          color: rgba(255,255,255,0.7);
          font-weight: 600;
          font-size: 0.88rem;
          cursor: pointer;
          text-align: left;
          width: 100%;
          transition: all var(--transition-fast);
        }
        .sidebar-nav-btn:hover {
          background: rgba(255,255,255,0.05);
          color: white;
        }
        .sidebar-nav-btn.active {
          background: var(--gradient-primary);
          color: white;
          box-shadow: 0 4px 12px rgba(2, 132, 199, 0.25);
        }
        .action-icon-btn {
          width: 30px;
          height: 30px;
          border-radius: 6px;
          border: 1px solid var(--border-muted);
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: var(--transition-fast);
          background: white;
        }
        .action-icon-btn.confirm { color: #0d9488; border-color: rgba(13, 148, 136, 0.15); background: #f0fdfa; }
        .action-icon-btn.confirm:hover { background: #0d9488; color: white; }
        .action-icon-btn.print { color: #0284c7; border-color: rgba(2, 132, 199, 0.15); background: #f0f9ff; }
        .action-icon-btn.print:hover { background: #0284c7; color: white; }
        .action-icon-btn.complete { color: #2563eb; border-color: rgba(37, 99, 235, 0.15); background: #eff6ff; }
        .action-icon-btn.complete:hover { background: #2563eb; color: white; }
        .action-icon-btn.cancel { color: #ea580c; border-color: rgba(234, 88, 12, 0.15); background: #fff7ed; }
        .action-icon-btn.cancel:hover { background: #ea580c; color: white; }
        .action-icon-btn.delete { color: #dc2626; border-color: rgba(220, 38, 38, 0.15); background: #fef2f2; }
        .action-icon-btn.delete:hover { background: #dc2626; color: white; }
        .action-icon-btn.edit { color: #4b5563; border-color: var(--border-muted); }
        .action-icon-btn.edit:hover { background: var(--primary); color: white; }
        
        .status-pill {
          display: inline-block;
          padding: 3px 8px;
          border-radius: 4px;
          font-size: 0.78rem;
          font-weight: 700;
          text-transform: uppercase;
        }
        .status-pill.pending { background: #fef3c7; color: #b45309; }
        .status-pill.confirmed { background: #ccfbf1; color: #0f766e; }
        .status-pill.completed { background: #dbeafe; color: #1d4ed8; }
        .status-pill.cancelled { background: #fee2e2; color: #b91c1c; }

        .toggle-switch-btn {
          width: 44px;
          height: 24px;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          position: relative;
          padding: 2px;
          transition: background-color var(--transition-fast);
        }
        .toggle-switch-btn.on { background-color: #0d9488; }
        .toggle-switch-btn.off { background-color: #cbd5e1; }
        .toggle-knob {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: white;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          transition: transform var(--transition-fast);
        }
        .toggle-switch-btn.on .toggle-knob { transform: translateX(20px); }
        .toggle-switch-btn.off .toggle-knob { transform: translateX(0px); }

        .hover-red-btn:hover {
          background: #ef4444 !important;
          color: white !important;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .admin-sidebar {
            position: absolute !important;
            height: calc(100vh - 64px);
            top: 64px;
            left: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;
