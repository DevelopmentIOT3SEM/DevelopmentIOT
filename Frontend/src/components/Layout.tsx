import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Activity, MessageSquare, LogOut, Recycle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import './Layout.css';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/monitoramento', label: 'Monitoramento', icon: Activity },
  { to: '/chatbot', label: 'Assistente', icon: MessageSquare },
];

export function Layout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="brand">
          <Recycle size={26} color="var(--green-600)" />
          <span>EcoVida</span>
        </div>

        <nav className="nav">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <button className="nav-item logout" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Sair</span>
        </button>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
