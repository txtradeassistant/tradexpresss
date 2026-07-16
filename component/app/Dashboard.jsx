/* components/Dashboard.jsx */
import React, { useState } from 'react';

export default function Dashboard() {
  const [tradeType, setTradeType] = useState('buy');
  const [amount, setAmount] = useState('');

  const handleTrade = (e) => {
    e.preventDefault();
    alert(`Order placed: ${tradeType.toUpperCase()} $${amount} worth of assets.`);
    setAmount('');
  };

  return (
    <div style={styles.container}>
      {/* 1. Header / Welcome */}
      <div style={styles.welcomeRow}>
        <div>
          <h1 style={styles.title}>Welcome back, Kenny</h1>
          <p style={styles.subtitle}>Here is your trading activity for today.</p>
        </div>
        <div style={styles.balanceCard}>
          <span style={styles.balanceLabel}>PORTFOLIO VALUE</span>
          <h2 style={styles.balanceValue}>$12,450.80 <span style={styles.upTrend}>+4.2%</span></h2>
        </div>
      </div>

      <div style={styles.dashboardGrid}>
        {/* 2. Watchlist / Market Rates */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Live Markets</h3>
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <span>Asset</span>
              <span>Price</span>
              <span>Change</span>
            </div>
            <div style={styles.tableRow}>
              <span style={styles.assetName}>BTC <span style={styles.assetFull}>Bitcoin</span></span>
              <span>$59,250.00</span>
              <span style={styles.upTrend}>+2.4%</span>
            </div>
            <div style={styles.tableRow}>
              <span style={styles.assetName}>ETH <span style={styles.assetFull}>Ethereum</span></span>
              <span>$2,640.15</span>
              <span style={styles.downTrend}>-0.8%</span>
            </div>
            <div style={styles.tableRow}>
              <span style={styles.assetName}>SOL <span style={styles.assetFull}>Solana</span></span>
              <span>$142.50</span>
              <span style={styles.upTrend}>+8.1%</span>
            </div>
          </div>
        </div>

        {/* 3. Trade Execution Panel */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Quick Trade</h3>
          <form onSubmit={handleTrade} style={styles.form}>
            <div style={styles.tabContainer}>
              <button 
                type="button" 
                onClick={() => setTradeType('buy')}
                style={{...styles.tab, ...(tradeType === 'buy' ? styles.activeBuyTab : {})}}
              >
                Buy
              </button>
              <button 
                type="button" 
                onClick={() => setTradeType('sell')}
                style={{...styles.tab, ...(tradeType === 'sell' ? styles.activeSellTab : {})}}
              >
                Sell
              </button>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Select Asset</label>
              <select style={styles.select}>
                <option>BTC - Bitcoin</option>
                <option>ETH - Ethereum</option>
                <option>SOL - Solana</option>
              </select>
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount (USD)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
                required
              />
            </div>

            <button type="submit" style={tradeType === 'buy' ? styles.buyButton : styles.sellButton}>
              Execute {tradeType.charAt(0).toUpperCase() + tradeType.slice(1)}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    color: '#ffffff',
    fontFamily: 'sans-serif',
    maxWidth: '1200px',
    margin: '0 auto',
  },
  welcomeRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem',
  },
  title: {
    fontSize: '2rem',
    margin: 0,
    fontWeight: '700',
  },
  subtitle: {
    color: '#888888',
    margin: '0.25rem 0 0 0',
  },
  balanceCard: {
    backgroundColor: '#151515',
    border: '1px solid #222222',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    textAlign: 'right',
  },
  balanceLabel: {
    fontSize: '0.75rem',
    color: '#888888',
    letterSpacing: '1px',
  },
  balanceValue: {
    margin: '0.25rem 0 0 0',
    fontSize: '1.5rem',
  },
  dashboardGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '2rem',
  },
  card: {
    backgroundColor: '#151515',
    border: '1px solid #222222',
    borderRadius: '12px',
    padding: '1.5rem',
  },
  cardTitle: {
    margin: '0 0 1.25rem 0',
    fontSize: '1.2rem',
    borderBottom: '1px solid #222222',
    paddingBottom: '0.75rem',
  },
  table: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    color: '#555555',
    fontSize: '0.85rem',
    fontWeight: 'bold',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '2fr 1fr 1fr',
    alignItems: 'center',
    paddingBottom: '0.5rem',
    borderBottom: '1px solid #1c1c1c',
  },
  assetName: {
    fontWeight: 'bold',
  },
  assetFull: {
    color: '#555555',
    fontSize: '0.8rem',
    fontWeight: 'normal',
    marginLeft: '0.5rem',
  },
  upTrend: {
    color: '#00ffcc',
    fontWeight: 'bold',
  },
  downTrend: {
    color: '#ff4a4a',
    fontWeight: 'bold',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1.25rem',
  },
  tabContainer: {
    display: 'flex',
    backgroundColor: '#0a0a0a',
    padding: '0.25rem',
    borderRadius: '8px',
  },
  tab: {
    flex: 1,
    padding: '0.5rem',
    border: 'none',
    background: 'none',
    color: '#888888',
    cursor: 'pointer',
    borderRadius: '6px',
    fontWeight: 'bold',
    transition: 'all 0.2s',
  },
  activeBuyTab: {
    backgroundColor: '#00ffcc',
    color: '#000000',
  },
  activeSellTab: {
    backgroundColor: '#ff4a4a',
    color: '#ffffff',
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
  },
  label: {
    fontSize: '0.85rem',
    color: '#888888',
  },
  select: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #222222',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '8px',
    outline: 'none',
  },
  input: {
    backgroundColor: '#0a0a0a',
    border: '1px solid #222222',
    color: '#ffffff',
    padding: '0.75rem',
    borderRadius: '8px',
    outline: 'none',
  },
  buyButton: {
    backgroundColor: '#00ffcc',
    color: '#000000',
    padding: '0.85rem',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
  sellButton: {
    backgroundColor: '#ff4a4a',
    color: '#ffffff',
    padding: '0.85rem',
    border: 'none',
    borderRadius: '8px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '0.5rem',
  },
};