/*!
 * tradexpress.js - TradExpress Article Framework
 * Version 1.0 - For tradexpress.co / insight.tradexpress.co
 * Contact: hello@tradexpress.co | hello@kailu.dev
 * Usage:
 * <div id="tradexpress-feed"></div>
 * <script src="tradexpress.js"></script>
 * <script>
 *   TradExpress.init({
 *     selector: '#tradexpress-feed',
 *     articles: [...], // or articlesUrl: 'articles.json'
 *     theme: 'dark',
 *     enableAimAsk: true
 *   });
 * </script>
 * OR as iframe:
 * <iframe src="tradexpress-embed.html?src=articles.json" style="width:100%;height:800px;border:0"></iframe>
 */
(function(window){
  const defaultArticles = [];

  function el(tag, cls, html){
    const d = document.createElement(tag);
    if(cls) d.className = cls;
    if(html!==undefined) d.innerHTML = html;
    return d;
  }

  const TradExpress = {
    version: '1.0',
    articles: [],
    init: function(opts){
      opts = opts || {};
      const selector = opts.selector || '#tradexpress-feed';
      const container = document.querySelector(selector);
      if(!container){
        console.warn('[TradExpress] Container not found:', selector);
        return;
      }
      this.container = container;
      this.theme = opts.theme || 'dark';
      this.enableAimAsk = opts.enableAimAsk !== false;

      // Load articles
      if(opts.articles && Array.isArray(opts.articles)){
        this.articles = opts.articles;
        this.render();
      } else if(opts.articlesUrl){
        fetch(opts.articlesUrl)
          .then(r=>r.json())
          .then(data=>{
            this.articles = Array.isArray(data) ? data : data.articles || [];
            this.render();
          }).catch(e=>console.error('[TradExpress] Failed load', e));
      } else {
        this.articles = defaultArticles;
        this.render();
      }

      // Inject styles once
      if(!document.getElementById('tradexpress-style')){
        const style = document.createElement('style');
        style.id = 'tradexpress-style';
        style.textContent = `
          .tx-feed { font-family: Inter, system-ui, sans-serif; color:#E6EFFF; }
          .tx-feed.dark { --bg:#0A1931; --card:#12244D; --border:rgba(255,255,255,0.1); --accent:#2A6FFF; --cyan:#00E5FF; }
          .tx-search { width:100%; height:44px; border-radius:999px; background:rgba(255,255,255,0.06); border:1px solid var(--border); padding:0 18px; color:white; outline:none; }
          .tx-filters { display:flex; gap:8px; overflow-x:auto; padding:10px 0; }
          .tx-chip { padding:6px 14px; border-radius:999px; background:rgba(255,255,255,0.08); border:1px solid var(--border); font-size:12px; cursor:pointer; white-space:nowrap; }
          .tx-chip.active { background:white; color:#0A1931; font-weight:700; }
          .tx-grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(300px,1fr)); gap:18px; margin-top:16px; }
          .tx-card { background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03)); border:1px solid var(--border); border-radius:20px; padding:18px; backdrop-filter: blur(12px); transition: transform 0.2s, box-shadow 0.2s; position:relative; overflow:hidden; }
          .tx-card:hover { transform: translateY(-4px) scale(1.01); box-shadow: 0 12px 32px rgba(42,111,255,0.25), 0 0 0 1px rgba(0,229,255,0.2); }
          .tx-card .tx-meta { font-size:11px; opacity:0.6; display:flex; gap:8px; margin-bottom:8px; font-family: monospace; }
          .tx-card h3 { font-size:16px; font-weight:700; line-height:1.3; margin:0 0 8px; }
          .tx-card p { font-size:13px; line-height:1.5; opacity:0.8; margin:0; display:-webkit-box; -webkit-line-clamp:3; -webkit-box-orient:vertical; overflow:hidden; }
          .tx-badge { display:inline-block; padding:2px 8px; border-radius:999px; font-size:10px; font-weight:700; background: var(--accent); color:white; }
          .tx-badge.fda { background:#FF3B5C; } .tx-badge.bpi { background:#2ECC71; } .tx-badge.boc { background:#2A6FFF; } .tx-badge.dti { background:#FFA500; }
          .tx-empty { text-align:center; padding:40px; opacity:0.5; border:1px dashed var(--border); border-radius:16px; }
          /* Aim & Ask reuse */
          .tx-card.crosshair-target { outline:2px dashed #00E5FF !important; outline-offset:2px; box-shadow:0 0 30px rgba(0,229,255,0.4) !important; }
        `;
        document.head.appendChild(style);
      }

      if(this.enableAimAsk && window.TradExpressAim) window.TradExpressAim.attach(container);
    },
    render: function(filter){
      filter = filter || {q:'', tag:''};
      const c = this.container;
      c.innerHTML = '';
      c.className = 'tx-feed dark';

      // Search bar
      const searchWrap = el('div','');
      const search = el('input','tx-search');
      search.placeholder = 'Search articles, HS Code, permits (FDA/BPI/BOC)...';
      search.value = filter.q || '';
      search.addEventListener('input', (e)=>{
        this.render({q:e.target.value, tag:filter.tag});
      });
      searchWrap.appendChild(search);

      // Filters
      const tags = [...new Set(this.articles.flatMap(a=>a.tags||[]))];
      const filters = el('div','tx-filters');
      const allChip = el('div','tx-chip'+(!filter.tag?' active':''), 'All');
      allChip.onclick = ()=>this.render({q:filter.q, tag:''});
      filters.appendChild(allChip);
      tags.forEach(t=>{
        const chip = el('div','tx-chip'+(filter.tag===t?' active':''), t);
        chip.onclick = ()=>this.render({q:filter.q, tag:t});
        filters.appendChild(chip);
      });

      // Grid
      const grid = el('div','tx-grid');
      let list = this.articles;
      if(filter.q){
        const q = filter.q.toLowerCase();
        list = list.filter(a=> (a.title+a.content+(a.tags||[]).join(' ')+(a.hs||'') ).toLowerCase().includes(q));
      }
      if(filter.tag){
        list = list.filter(a=> (a.tags||[]).includes(filter.tag));
      }

      if(list.length===0){
        grid.appendChild(el('div','tx-empty', `<div>📄 No articles found</div><div style="font-size:12px;margin-top:6px">Add articles via TradExpress.addArticle({title,content,tags}) or load articles.json</div>`));
      } else {
        list.forEach((a,i)=>{
          const card = el('div','tx-card glass');
          card.setAttribute('data-article-id', a.id||i);
          const meta = el('div','tx-meta', `<span>${a.date||''}</span><span>•</span><span>${a.agency||'BOC'}</span><span>•</span><span>${a.hs||''}</span>`);
          const badge = el('div','');
          (a.tags||[]).slice(0,3).forEach(t=>{
            const b = el('span','tx-badge '+(t.toLowerCase()), t);
            badge.appendChild(b);
            badge.appendChild(document.createTextNode(' '));
          });
          const h3 = el('h3','', a.title||'Untitled');
          const p = el('p','', a.content||a.excerpt||'');
          const read = el('div','', `<div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center"><span style="font-size:11px;opacity:0.5">${a.author||'TradExpress IMPACT'}</span><a href="${a.url||'#'}" style="font-size:12px;color:#00E5FF;text-decoration:none">Read →</a></div>`);
          card.appendChild(meta);
          card.appendChild(badge);
          card.appendChild(h3);
          card.appendChild(p);
          card.appendChild(read);
          card.addEventListener('click', (e)=>{
            if(e.target.tagName==='A') return;
            if(window.TradExpress && window.TradExpress.onArticleClick) window.TradExpress.onArticleClick(a);
            // dispatch event for TX chatbot
            window.dispatchEvent(new CustomEvent('tradexpress:article:select', {detail:a}));
          });
          grid.appendChild(card);
        });
      }

      c.appendChild(searchWrap);
      c.appendChild(filters);
      c.appendChild(grid);

      // Footer with contact
      const footer = el('div','', `<div style="margin-top:18px;text-align:center;font-size:11px;opacity:0.4">Powered by TradExpress.co IMPACT • ${this.articles.length} articles • Contact hello@tradexpress.co / hello@kailu.dev • Aim & Ask enabled</div>`);
      c.appendChild(footer);
    },
    addArticle: function(article){
      this.articles.unshift(article);
      this.render();
    },
    addArticles: function(articles){
      this.articles = articles.concat(this.articles);
      this.render();
    },
    loadFromJson: function(url){
      fetch(url).then(r=>r.json()).then(d=>{
        this.articles = (Array.isArray(d)?d:d.articles)||[];
        this.render();
      });
    },
    onArticleClick: null
  };

  // Aim & Ask addon
  const TradExpressAim = {
    attach: function(container){
      if(document.querySelector('.aim-btn')) return;
      const btn = el('button','aim-btn','🎯 Aim & Ask');
      btn.type='button';
      btn.style.cssText='background:linear-gradient(135deg,#2A6FFF,#00E5FF);color:white;border:none;padding:8px 16px;border-radius:999px;font-weight:600;font-size:13px;cursor:pointer;box-shadow:0 0 20px rgba(42,111,255,0.4);margin:10px 0;';
      container.parentElement.insertBefore(btn, container);
      let isAiming=false, current=null;
      btn.addEventListener('click', (e)=>{
        e.stopPropagation();
        isAiming=!isAiming;
        btn.classList.toggle('active', isAiming);
        btn.textContent = isAiming ? '❌ Exit Aim' : '🎯 Aim & Ask';
        document.body.classList.toggle('crosshair-mode', isAiming);
        if(!isAiming && current){ current.classList.remove('crosshair-target'); current=null; }
      });
      document.addEventListener('mousemove', (e)=>{
        if(!isAiming) return;
        const el = document.elementFromPoint(e.clientX,e.clientY);
        const card = el ? el.closest('.tx-card, .glass, [class*="card"]') : null;
        if(card!==current){ if(current) current.classList.remove('crosshair-target'); current=card; if(current) current.classList.add('crosshair-target'); }
      });
      document.addEventListener('click', (e)=>{
        if(!isAiming) return;
        if(e.target.closest('.aim-btn')) return;
        e.preventDefault(); e.stopPropagation();
        if(current){
          const text = current.innerText.replace(/\s+/g,' ').trim().substring(0,300);
          const input = document.querySelector('input.tx-search, input[type="text"], textarea');
          if(input){ input.value = `[Analyzing: "${text}"] - `; input.focus(); input.dispatchEvent(new Event('input',{bubbles:true})); }
          window.dispatchEvent(new CustomEvent('tradexpress:aim', {detail:{text, element:current}}));
          isAiming=false; btn.classList.remove('active'); btn.textContent='🎯 Aim & Ask'; document.body.classList.remove('crosshair-mode'); current.classList.remove('crosshair-target'); current=null;
        }
      });
    }
  };
  window.TradExpressAim = TradExpressAim;
  window.TradExpress = TradExpress;

  // Iframe postMessage support - vacant iframe can receive articles from parent
  window.addEventListener('message', (e)=>{
    if(e.data && e.data.type==='tradexpress:load'){
      if(e.data.articles) { TradExpress.articles = e.data.articles; TradExpress.render(); }
      if(e.data.articlesUrl) { TradExpress.loadFromJson(e.data.articlesUrl); }
    }
  });

  // Auto-init if data-tradexpress attribute present
  document.addEventListener('DOMContentLoaded', ()=>{
    const auto = document.querySelector('[data-tradexpress]');
    if(auto){
      const url = auto.getAttribute('data-tradexpress');
      TradExpress.init({selector:'[data-tradexpress]', articlesUrl: url || 'articles.json'});
    }
  });

})(window);
