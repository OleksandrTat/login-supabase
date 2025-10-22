'use client';
import { useState, useEffect } from 'react';

type ToastProps = {
  message: string;
  duration?: number;
  onClose?: () => void;
};

export default function SimpleToast({ message, duration = 3000, onClose }: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      if (onClose) onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!visible) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-sky-600 text-white px-4 py-2 rounded-md shadow-lg animate-slide-in">
      {message}
    </div>
  );
}
