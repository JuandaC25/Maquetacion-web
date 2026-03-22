import React, { useEffect, useState } from 'react';
import './notification.css';

const Notification = ({ notification, onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!notification) return;
    setVisible(false);
    const raf = requestAnimationFrame(() => setVisible(true));
    const autoClose = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose && onClose(), 300);
    }, notification.duration || 5000);

    return () => {
      clearTimeout(autoClose);
      cancelAnimationFrame(raf);
    };
  }, [notification, onClose]);

  if (!notification) return null;

  const { type, title, description } = notification;

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose && onClose(), 240);
  };

  const displayTitle = (title && title.length) ? title : (description || '');
  const showDescription = (title && title.length) && (description && description.length);

  return (
    <div className={`notification-wrapper ${visible ? 'show' : 'hide'}`} aria-live="polite">
      <div className={`notification-card ${type === 'success' ? 'success' : type === 'error' ? 'error' : 'info'}`}>
        <div className="notification-left">
          <div className="notification-icon">
            {type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon-svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5"></path>
              </svg>
            ) : type === 'error' ? (
              // simple red X icon for error
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon-svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="icon-svg">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          <div className="notification-texts">
            <div className="notification-title">{displayTitle}</div>
            {showDescription && <div className="notification-desc">{description}</div>}
          </div>
        </div>
        <button className="notification-close" onClick={handleClose} aria-label="Cerrar notificación">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="close-svg">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Notification;
