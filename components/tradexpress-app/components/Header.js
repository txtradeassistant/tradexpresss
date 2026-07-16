// components/Header.tsx
import Link from 'next/link';

export default function Header() {
  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <Link href="/" style={styles.logo}>
          TradeXpress
        </Link>
      </div>
      <nav style={styles.nav}>
        <Link href="/dashboard" style={styles.navLink}>Dashboard</Link>
        <Link href="/markets" style={styles.navLink}>Markets</Link>
        <Link href="/wallet" style={styles.navLink}>Wallet</Link>
      </nav>
      <div style={styles.profile}>
        <span style={styles.statusBadge}>Live</span>
      </div>
    </header>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#1a1a1a',
    borderBottom: '1px style solid #2d2d2d',
    color: '#ffffff',
  },
  logoContainer: {
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  logo: {
    color: '#00ffcc',
    textDecoration: 'none',
  },
  nav: {
    display: 'flex',
    gap: '1.5rem',
  },
  navLink: {
    color: '#cccccc',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  profile: {
    display: 'flex',
    alignItems: 'center',
  },
  statusBadge: {
    backgroundColor: '#00ffcc',
    color: '#000000',
    padding: '0.25rem 0.75rem',
    borderRadius: '12px',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
};