import { useEffect, useState } from 'react';
import { User } from 'firebase/auth';
import { addNotification, getNotifications, NotificationRecord } from '../services/notificationService';

interface NotificationsProps {
  user: User | null;
}

export default function Notifications({ user }: NotificationsProps) {
  const [items, setItems] = useState<NotificationRecord[]>([]);
  const [form, setForm] = useState<Omit<NotificationRecord, 'id' | 'createdAt'>>({
    title: '',
    message: '',
    type: 'info',
  });

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      setItems(await getNotifications(user.uid));
    };
    load();
  }, [user]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!user) return;
    await addNotification(user.uid, form);
    setForm({ title: '', message: '', type: 'info' });
    setItems(await getNotifications(user.uid));
  };

  return (
    <div className="page-section">
      <div className="page-header-block">
        <h2>Bildirimler</h2>
        <p>Vadesi gelen, stok ve sistem uyarılarını yönet.</p>
      </div>

      <div className="grid-two">
        <section className="card form-card">
          <h3>Yeni Bildirim</h3>
          <form className="dashboard-form" onSubmit={handleSubmit}>
            <label>
              Başlık
              <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            </label>
            <label>
              Mesaj
              <input value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required />
            </label>
            <label>
              Tür
              <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as NotificationRecord['type'] })}>
                <option value="info">Bilgi</option>
                <option value="warning">Uyarı</option>
                <option value="success">Başarı</option>
              </select>
            </label>
            <button type="submit">Kaydet</button>
          </form>
        </section>

        <section className="card list-card">
          <h3>Bildirim Listesi</h3>
          {items.length === 0 ? (
            <p>Henüz bildirim yok.</p>
          ) : (
            <div className="list-grid">
              {items.map((item) => (
                <article key={item.id} className={`list-item notification-${item.type}`}>
                  <strong>{item.title}</strong>
                  <span>{item.message}</span>
                  <span>{item.type}</span>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
