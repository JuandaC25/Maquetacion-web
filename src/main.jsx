
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import { AuthProvider } from './auth/AuthContext';
import Notification from './components/common/Notification.jsx';
import './components/common/notification.css';

const NotificationRoot = ({ children }) => {
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    const show = (type, title, description, duration) => {
      setNotification({ type, title: title || '', description: description || '', duration });
    };
    window.showNotification = show;
    window.alert = (msg) => {
      const s = String(msg || '');
      try {
        const lower = s.toLowerCase();
        const errorKeywords = [
          'error', 'no se', 'no hay', 'no encontrado', 'deneg', 'denied', 'denegado', 'fail', 'fallo', 'problema', 'problemas', 'invalid', 'no puede', 'acceso denegado', 'denegado', 'denegada', 'rechaz', 'excepcion', 'exception', 'err', 'nao encontrado'
        ];
        const successKeywords = [
          'correcto', 'correctamente', 'exitoso', 'exitosamente', '✓', '✅', 'completado', 'guardado', 'creado', 'enviado', 'descargado', 'ok', 'success'
        ];

        const hasAny = (arr) => arr.some(k => lower.includes(k));

        let type = 'info';
        if (hasAny(errorKeywords) || /\u274C|\u2716|\bno\b/.test(s)) {
          type = 'error';
        } else if (hasAny(successKeywords)) {
          type = 'success';
        }

        const maxTitleLength = 80;
        const title = s.length <= maxTitleLength ? s : (type === 'error' ? 'Error' : (type === 'success' ? 'Éxito' : 'Mensaje'));
        const description = s.length <= maxTitleLength ? '' : s;

        show(type, title, description || '', 5000);
      } catch (e) {
        show('error', 'Error', String(msg), 5000);
      }
    };
    return () => {
      try { delete window.showNotification; } catch (e) {}
      try { delete window.alert; } catch (e) {}
    };
  }, []);

  return (
    <>
      {children}
      <Notification notification={notification} onClose={() => setNotification(null)} />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <NotificationRoot>
        <App />
      </NotificationRoot>
    </AuthProvider>
  </React.StrictMode>
);

