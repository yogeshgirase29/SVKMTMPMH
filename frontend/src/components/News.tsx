import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { type Language, translations } from '../utils/translations';
import { newsApi } from '../services/api';
import { Calendar, FileText, Loader2, ArrowRight } from 'lucide-react';

interface NewsProps {
  language: Language;
}

export const News: React.FC<NewsProps> = ({ language }) => {
  const t = translations[language];
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await newsApi.getAll();
        if (res.success) {
          setPosts(res.news);
        }
      } catch (err) {
        console.error('Failed to load news:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNews();
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (language === 'mr') {
      return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }
    return d.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <section 
      id="news" 
      style={{
        padding: '100px 0',
        background: 'linear-gradient(180deg, rgba(224, 242, 254, 0.15) 0%, rgba(248, 250, 252, 0.8) 100%)',
        position: 'relative'
      }}
    >
      <div className="container">
        {/* Header */}
        <div className="section-header">
          <span className="section-tag" style={{ textTransform: 'uppercase' }}>
            {language === 'en' ? 'LATEST NEWS' : 'नवीन घडामोडी'}
          </span>
          <h2 className="section-title">
            {language === 'en' ? 'Announcements & Wellness Updates' : 'रुग्णालय घोषणा आणि नवीन घडामोडी'}
          </h2>
          <p className="section-desc">
            {language === 'en' 
              ? 'Stay updated with clinical milestones, health camps schedule, and preventative guidelines from our board.'
              : 'वैद्यकीय यश, आरोग्य तपासणी शिबिरांचे वेळापत्रक आणि आमच्या डॉक्टरांच्या सल्ल्यांबाबत अपडेट रहा.'}
          </p>
        </div>

        {/* Loader */}
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 size={36} className="spin-animation" style={{ color: 'var(--med-blue)' }} />
          </div>
        ) : posts.length === 0 ? (
          <div style={{
            padding: '50px 20px',
            textAlign: 'center',
            color: 'var(--text-muted)',
            border: '1px dashed var(--border-muted)',
            borderRadius: '12px',
            background: 'var(--bg-primary)'
          }}>
            <FileText size={36} style={{ color: 'var(--text-muted)', marginBottom: '12px' }} />
            <p style={{ fontWeight: 600 }}>
              {language === 'en' ? 'No news announcements posted yet.' : 'अद्याप कोणतीही बातमी किंवा अपडेट पोस्ट केलेले नाही.'}
            </p>
          </div>
        ) : (
          /* Grid */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px'
          }} className="news-grid">
            {posts.slice(0, 3).map((post, idx) => (
              <motion.article
                key={post._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'var(--white)',
                  borderRadius: 'var(--radius-xl)',
                  overflow: 'hidden',
                  border: '1px solid rgba(2, 132, 199, 0.06)',
                  boxShadow: 'var(--shadow-md)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                }}
                className="news-card"
              >
                {/* Image */}
                <div style={{
                  width: '100%',
                  height: '210px',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  <img 
                    src={post.image} 
                    alt={post.title[language] || post.title.en} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  {/* Date Tag */}
                  <div style={{
                    position: 'absolute',
                    top: '16px',
                    left: '16px',
                    background: 'var(--white)',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    boxShadow: 'var(--shadow-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: 'var(--med-blue)'
                  }}>
                    <Calendar size={13} />
                    <span>{formatDate(post.date)}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '12px' }}>
                  <h3 style={{
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--primary)',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '3.36em'
                  }}>
                    {post.title[language] || post.title.en}
                  </h3>
                  <p style={{
                    fontSize: '0.88rem',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '4.8em'
                  }}>
                    {post.description[language] || post.description.en}
                  </p>

                  <div style={{
                    marginTop: 'auto',
                    paddingTop: '12px',
                    borderTop: '1px solid var(--border-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    color: 'var(--med-blue)',
                    cursor: 'pointer'
                  }} className="read-more-link">
                    <span>{language === 'en' ? 'Read Full Article' : 'सविस्तर वाचा'}</span>
                    <ArrowRight size={14} className="arrow" style={{ transition: 'transform 0.2s ease' }} />
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .news-card:hover {
          transform: translateY(-5px);
          box-shadow: var(--shadow-lg);
        }
        .news-card:hover .read-more-link .arrow {
          transform: translateX(4px);
        }
        @media (max-width: 768px) {
          .news-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </section>
  );
};
