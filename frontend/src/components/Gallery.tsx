import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { type Language } from '../utils/translations';
import { galleryApi } from '../services/api';
import { Image as ImageIcon, Loader2 } from 'lucide-react';

interface GalleryProps {
  language: Language;
}

type CategoryType = 'All' | 'Hospital' | 'Events' | 'Equipment' | 'Facilities';

export const Gallery: React.FC<GalleryProps> = ({ language }) => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('All');
  const [activeLightbox, setActiveLightbox] = useState<string | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        const res = await galleryApi.getAll();
        if (res.success) {
          setImages(res.gallery);
        }
      } catch (err) {
        console.error('Failed to load gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchGallery();
  }, []);

  const categories: CategoryType[] = ['All', 'Hospital', 'Events', 'Equipment', 'Facilities'];

  const filteredImages = selectedCategory === 'All'
    ? images
    : images.filter(img => img.category === selectedCategory);

  const getCategoryLabel = (cat: CategoryType) => {
    if (language === 'mr') {
      switch(cat) {
        case 'All': return 'सर्व';
        case 'Hospital': return 'रुग्णालय';
        case 'Events': return 'कार्यक्रम';
        case 'Equipment': return 'वैद्यकीय उपकरणे';
        case 'Facilities': return 'सुविधा';
      }
    }
    return cat;
  };

  return (
    <section 
      id="gallery" 
      style={{
        padding: '100px 0',
        background: 'var(--white)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag" style={{ textTransform: 'uppercase' }}>
            {language === 'en' ? 'OUR GALLERY' : 'आमची गॅलरी'}
          </span>
          <h2 className="section-title">
            {language === 'en' ? 'Explore Our Medical Facilities & Events' : 'आमच्या वैद्यकीय सुविधा आणि कार्यक्रम पहा'}
          </h2>
          <p className="section-desc">
            {language === 'en' 
              ? 'Take a visual tour of our modern diagnostic centers, high-tech operation suites, and regional community outreach events.'
              : 'आमच्या आधुनिक निदान केंद्रांची, हाय-टेक ऑपरेशन रूम्सची आणि प्रादेशिक आरोग्य शिबिरांची सफर घ्या.'}
          </p>
        </div>

        {/* Filter Tabs */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '12px',
          flexWrap: 'wrap',
          marginBottom: '40px'
        }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '8px 20px',
                fontSize: '0.88rem',
                fontWeight: 700,
                borderRadius: 'var(--radius-full)',
                border: '1px solid rgba(2, 132, 199, 0.15)',
                background: selectedCategory === cat ? 'var(--gradient-primary)' : 'white',
                color: selectedCategory === cat ? 'white' : 'var(--text-secondary)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                boxShadow: selectedCategory === cat ? 'var(--shadow-md)' : 'none'
              }}
              className="gallery-tab-btn"
            >
              {getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Loader */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 size={36} className="spin-animation" style={{ color: 'var(--med-blue)' }} />
          </div>
        ) : filteredImages.length === 0 ? (
          <div style={{
            padding: '50px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            border: '1px dashed var(--border-muted)',
            borderRadius: '12px',
            background: 'var(--bg-primary)'
          }}>
            <ImageIcon size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p style={{ fontWeight: 600 }}>
              {language === 'en' ? 'No images uploaded in this category yet.' : 'या श्रेणीमध्ये अद्याप कोणतेही फोटो अपलोड केलेले नाहीत.'}
            </p>
          </div>
        ) : (
          /* Grid */
          <motion.div 
            layout 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '24px'
            }}
          >
            <AnimatePresence>
              {filteredImages.map((img) => (
                <motion.div
                  key={img._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    position: 'relative',
                    borderRadius: 'var(--radius-lg)',
                    overflow: 'hidden',
                    boxShadow: 'var(--shadow-md)',
                    aspectRatio: '4/3',
                    cursor: 'pointer',
                    background: '#f1f5f9',
                    border: '1px solid var(--border-muted)'
                  }}
                  onClick={() => setActiveLightbox(img.image)}
                  className="gallery-item-card"
                >
                  <img 
                    src={img.image} 
                    alt={img.title} 
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease'
                    }}
                    className="gallery-img"
                  />
                  {/* Overlay */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 40%, rgba(15, 23, 42, 0.85) 100%)',
                    opacity: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    padding: '20px',
                    transition: 'all 0.3s ease',
                    color: 'white'
                  }} className="gallery-overlay">
                    <span style={{
                      alignSelf: 'flex-start',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: 'var(--cyan)',
                      color: 'var(--primary)',
                      padding: '2px 8px',
                      borderRadius: '4px',
                      marginBottom: '8px',
                      textTransform: 'uppercase'
                    }}>
                      {getCategoryLabel(img.category)}
                    </span>
                    <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 700, lineHeight: 1.3 }}>
                      {img.title}
                    </h4>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activeLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActiveLightbox(null)}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15, 23, 42, 0.95)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: '20px',
              cursor: 'zoom-out'
            }}
          >
            <motion.img
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              src={activeLightbox}
              alt="Enlarged gallery view"
              style={{
                maxWidth: '90%',
                maxHeight: '90vh',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
                objectFit: 'contain'
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .gallery-tab-btn:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }
        .gallery-item-card:hover .gallery-img {
          transform: scale(1.06);
        }
        .gallery-item-card:hover .gallery-overlay {
          opacity: 1 !important;
        }
      `}</style>
    </section>
  );
};
