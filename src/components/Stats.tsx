import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { type Language, translations } from '../utils/translations';


interface CounterProps {
  target: number;
  duration?: number;
  suffix?: string;
}

const CountUp: React.FC<CounterProps> = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = target;
    if (start === end) return;

    const totalMiliseconds = duration;
    const incrementTime = Math.max(Math.floor(totalMiliseconds / end), 25);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalMiliseconds / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, target, duration]);

  const formatNumber = (num: number) => {
    return num.toLocaleString();
  };

  return <span ref={ref}>{formatNumber(count)}{suffix}</span>;
};

interface StatsProps {
  language: Language;
}

export const Stats: React.FC<StatsProps> = ({ language }) => {
  const t = translations[language];

  const statsData = [
    { target: 1200, suffix: '+', label: t.statBedsLabel, desc: t.statBedsDesc },
    { target: 150, suffix: '+', label: t.statDoctorsLabel, desc: t.statDoctorsDesc },
    { target: 7, suffix: language === 'en' ? ' Lakh+ Sq.Ft.' : ' लाख+ चौ.फू.', label: t.statCampusLabel, desc: t.statCampusDesc },
    { target: 24, suffix: '/7', label: t.statIcuLabel, desc: t.statIcuDesc, isTime: true }
  ];

  return (
    <section 
      style={{
        padding: '60px 0',
        background: 'var(--white)',
        position: 'relative',
        zIndex: 20,
        marginTop: '-40px',
        borderTop: '1px solid #f1f5f9'
      }}
    >
      <div className="container">
        <div 
          className="glass-panel" 
          style={{
            padding: '40px 24px',
            background: 'var(--white)',
            boxShadow: 'var(--shadow-xl)',
            border: '1px solid rgba(2, 132, 199, 0.08)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '32px',
            textAlign: 'center'
          }}
        >
          {statsData.map((stat, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                borderRight: index < statsData.length - 1 ? '1px solid var(--border-muted)' : 'none'
              }}
              className="stat-card"
            >
              <h3 style={{
                fontSize: '2.8rem',
                fontWeight: 800,
                color: 'var(--primary)',
                fontFamily: 'Outfit, sans-serif',
                lineHeight: 1
              }} className="text-gradient">
                {stat.isTime ? (
                  <span>24/7</span>
                ) : (
                  <CountUp target={stat.target} suffix={stat.suffix} />
                )}
              </h3>
              <h4 style={{
                fontSize: '1.05rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginTop: '4px'
              }}>
                {stat.label}
              </h4>
              <p style={{
                fontSize: '0.85rem',
                color: 'var(--text-muted)'
              }}>
                {stat.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .stat-card {
            border-right: none !important;
            border-bottom: 1px solid var(--border-muted);
            padding-bottom: 24px;
          }
          .stat-card:last-child {
            border-bottom: none !important;
            padding-bottom: 0;
          }
        }
      `}</style>
    </section>
  );
};
