import { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './firebase';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Invoices from './pages/Invoices';
import EInvoice from './pages/EInvoice';
import Stocks from './pages/Stocks';
import CashBank from './pages/CashBank';
import IncomeExpenses from './pages/IncomeExpenses';
import Accountant from './pages/Accountant';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import StockMovements from './pages/StockMovements';
import Admin from './pages/Admin';
import SeoLanding from './pages/SeoLanding';
import Blog from './pages/Blog';
import BlogDetail from './pages/BlogDetail';
import Features from './pages/Features';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Contact from './pages/Contact';
import ProtectedRoute from './components/ProtectedRoute';
import AppLayout from './components/AppLayout';
import { seoPages } from './data/seoPages';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut(auth);
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center text-slate-500 font-bold">
        Yükleniyor...
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/"
        element={user ? <Navigate to="/panel" replace /> : <Landing />}
      />
      <Route
        path="/login"
        element={user ? <Navigate to="/panel" replace /> : <Login />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/panel" replace /> : <Signup />}
      />
      {seoPages.map((page) => (
        <Route key={page.path} path={page.path} element={<SeoLanding page={page} />} />
      ))}
      <Route path="/blog" element={<Blog />} />
      <Route path="/blog/:id" element={<BlogDetail />} />
      <Route path="/ozellikler" element={<Features />} />
      <Route path="/fiyatlar" element={<Pricing />} />
      <Route path="/hakkimizda" element={<About />} />
      <Route path="/iletisim" element={<Contact />} />
      <Route
        path="/panel"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <Dashboard user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/cariler"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <Customers user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/faturalar"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <Invoices user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/e-fatura"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <EInvoice user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stok"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <Stocks user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/kasa-banka"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <CashBank user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/gelir-gider"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <IncomeExpenses user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/muhasebeci"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <Accountant user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/raporlar"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <Reports user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/bildirimler"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <Notifications user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/ayarlar"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <Settings user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/stok-hareket"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <StockMovements user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute user={user}>
            <AppLayout user={user!} onSignOut={handleSignOut}>
              <Admin user={user} />
            </AppLayout>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
