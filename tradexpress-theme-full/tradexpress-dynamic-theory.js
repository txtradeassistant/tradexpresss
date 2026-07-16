/*!
 * tradexpress-dynamic-theory.js - Dynamic Theory Engine for TradExpress
 * Adds live theory, formulas, and interactive calculators to vacant iframe
 * Version 1.0 - tradexpress.co
 * Contact: hello@tradexpress.co / hello@kailu.dev
 */
(function(window){
  const TheoryEngine = {
    theories: [
      {
        id: 'landed-dynamic',
        title: 'Dynamic Landed Cost Theory',
        formula: 'Landed = (FOB + Freight + Insurance) × (1 + Duty%) × 1.12 VAT + Fixed Fees + FX Risk',
        description: 'Landed cost is not static. It moves with USD/PHP, freight index, and BOC duty updates. This theory models real-time variance.',
        variables: {
          fob: {label:'FOB USD', value:1000, min:100, max:100000, step:100},
          freight: {label:'Freight USD', value:200, min:0, max:5000, step:50},
          duty: {label:'Duty %', value:15, min:0, max:50, step:1},
          fx: {label:'USD/PHP', value:58.5, min:50, max:70, step:0.1},
          vat: {label:'VAT', value:12, fixed:true}
        },
        compute: function(v){
          const cif = (v.fob + v.freight) * v.fx;
          const duty = cif * (v.duty/100);
          const vatBase = cif + duty;
          const vat = vatBase * 0.12;
          const total = vatBase + vat + 3500; // fixed fees arrastre etc
          const risk = (v.fx - 58.5) * (v.fob+v.freight) * 0.3;
          return {cif, duty, vat, total, risk, landedPerUnit: total };
        },
        tags: ['Dynamic','Landed Cost','FX','Theory']
      },
      {
        id: 'elasticity',
        title: 'Price Elasticity & Demand Theory',
        formula: 'Demand = BaseDemand × (Price / BasePrice) ^ Elasticity',
        description: 'If duty increases price by 10%, how much demand drops? Dynamic theory for import pricing strategy.',
        variables: {
          basePrice: {label:'Base Price PHP', value:1000, min:100, max:10000, step:50},
          newPrice: {label:'New Price PHP', value:1150, min:100, max:15000, step:50},
          elasticity: {label:'Elasticity', value:-1.5, min:-4, max:-0.1, step:0.1},
          baseDemand: {label:'Base Demand Units', value:500, min:10, max:5000, step:10}
        },
        compute: function(v){
          const ratio = v.newPrice / v.basePrice;
          const newDemand = v.baseDemand * Math.pow(ratio, v.elasticity);
          const revenueOld = v.basePrice * v.baseDemand;
          const revenueNew = v.newPrice * newDemand;
          const change = ((newDemand - v.baseDemand)/v.baseDemand)*100;
          return {newDemand: Math.round(newDemand), revenueOld, revenueNew, change, priceDiff: v.newPrice - v.basePrice};
        },
        tags: ['Dynamic','Pricing','Elasticity','Market']
      },
      {
        id: 'compliance-risk',
        title: 'Compliance Risk Scoring Theory',
        formula: 'RiskScore = (PermitComplexity × 0.4) + (AgencyOverlap × 0.3) + (HS_Volatility × 0.3)',
        description: 'Dynamic risk model that scores import shipments based on permits, agency overlap (FDA+BPI+DTI), and HS code reclassification history.',
        variables: {
          permitCount: {label:'Permits Required', value:2, min:0, max:6, step:1},
          agencyOverlap: {label:'Agencies Involved', value:2, min:1, max:4, step:1},
          hsRisk: {label:'HS Volatility (1-10)', value:6, min:1, max:10, step:1}
        },
        compute: function(v){
          const score = (v.permitCount*15*0.4) + (v.agencyOverlap*20*0.3) + (v.hsRisk*10*0.3);
          let level = 'Low';
          if(score>70) level='Critical'; else if(score>50) level='High'; else if(score>30) level='Medium';
          const delay = v.permitCount*2 + v.agencyOverlap*1.5;
          return {score: Math.round(score), level, delayDays: delay, recommendation: level==='Critical' ? 'Use licensed broker + advance permit filing' : 'Standard processing'};
        },
        tags: ['Dynamic','Compliance','Risk','BOC']
      },
      {
        id: 'freight-dynamic',
        title: 'Freight Cost Dynamic Index Theory',
        formula: 'Freight = Base × (FuelIndex × DistanceFactor) + PeakSeasonSurge',
        description: 'Explains why freight China-Manila fluctuates weekly. Tracks fuel, peak season (Q3/Q4), and port congestion.',
        variables: {
          baseFreight: {label:'Base Freight USD', value:300, min:50, max:2000, step:25},
          fuelIndex: {label:'Fuel Multiplier', value:1.2, min:0.8, max:2.5, step:0.05},
          peakSurge: {label:'Peak Surge %', value:15, min:0, max:100, step:5},
          distance: {label:'Distance Factor', value:1.0, min:0.5, max:2.0, step:0.1}
        },
        compute: function(v){
          const adjusted = v.baseFreight * v.fuelIndex * v.distance;
          const surge = adjusted * (v.peakSurge/100);
          const total = adjusted + surge;
          const trend = v.fuelIndex>1.3 ? 'Rising' : v.fuelIndex<1 ? 'Falling' : 'Stable';
          return {adjusted: Math.round(adjusted), surge: Math.round(surge), total: Math.round(total), trend};
        },
        tags: ['Dynamic','Freight','Logistics','Theory']
      }
    ],

    init: function(selector){
      const container = document.querySelector(selector || '#tradexpress-theory');
      if(!container) return;
      this.container = container;
      this.renderList();
      this.injectStyles();
    },

    injectStyles: function(){
      if(document.getElementById('tx-theory-style')) return;
      const s = document.createElement('style');
      s.id='tx-theory-style';
      s.textContent=`
        .tx-theory-wrap{font-family:Inter,system-ui;color:#E6EFFF}
        .tx-theory-card{background:linear-gradient(135deg, rgba(42,111,255,0.12), rgba(0,229,255,0.06));border:1px solid rgba(255,255,255,0.12);border-radius:20px;padding:20px;margin-bottom:18px;backdrop-filter:blur(12px);transition:0.2s}
        .tx-theory-card:hover{transform:translateY(-3px);box-shadow:0 12px 32px rgba(42,111,255,0.3)}
        .tx-formula{background:#070F26;border:1px dashed rgba(0,229,255,0.3);padding:10px 14px;border-radius:12px;font-family:monospace;font-size:12px;color:#00E5FF;margin:10px 0}
        .tx-var{display:flex;justify-content:space-between;align-items:center;margin:8px 0;gap:12px}
        .tx-var label{font-size:12px;opacity:0.8;min-width:120px}
        .tx-var input[type=range]{flex:1;accent-color:#2A6FFF}
        .tx-var span{font-size:12px;min-width:60px;text-align:right;font-weight:700;color:#00E5FF}
        .tx-result{background:rgba(255,255,255,0.06);border-radius:14px;padding:14px;margin-top:12px;display:grid;grid-template-columns:repeat(auto-fit,minmax(120px,1fr));gap:10px}
        .tx-result div{font-size:12px} .tx-result b{color:#00E5FF;display:block;font-size:16px}
        .tx-theory-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(360px,1fr));gap:18px}
      `;
      document.head.appendChild(s);
    },

    renderList: function(){
      const c = this.container;
      c.innerHTML='';
      c.className='tx-theory-wrap';
      const header = document.createElement('div');
      header.innerHTML=`<h2 style="font-size:22px;font-weight:800;margin:0 0 6px">Dynamic Theory Engine <span style="background:linear-gradient(135deg,#2A6FFF,#00E5FF);padding:2px 10px;border-radius:999px;font-size:11px;margin-left:8px">BETA</span></h2><p style="opacity:0.6;font-size:13px;margin:0 0 16px">Live formulas that adapt to FX, freight, duty, demand. Adjust sliders to see impact. Contact hello@tradexpress.co</p>`;
      c.appendChild(header);

      const grid = document.createElement('div');
      grid.className='tx-theory-grid';

      this.theories.forEach(theory=>{
        const card = document.createElement('div');
        card.className='tx-theory-card tx-card';
        card.id='theory-'+theory.id;

        const tags = theory.tags.map(t=>`<span style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:999px;font-size:10px;margin-right:4px">${t}</span>`).join('');

        let varsHtml = '';
        for(const [key, cfg] of Object.entries(theory.variables)){
          if(cfg.fixed) continue;
          varsHtml+=`<div class="tx-var"><label>${cfg.label}</label><input type="range" data-theory="${theory.id}" data-var="${key}" min="${cfg.min}" max="${cfg.max}" step="${cfg.step}" value="${cfg.value}"><span id="${theory.id}-${key}-val">${cfg.value}</span></div>`;
        }

        card.innerHTML=`
          <div style="display:flex;justify-content:space-between;align-items:start;margin-bottom:8px">
            <div><div style="font-size:11px;opacity:0.5;font-family:monospace">${theory.id}</div><h3 style="margin:4px 0 0;font-size:16px;font-weight:700">${theory.title}</h3></div>
            <button class="aim-btn" style="font-size:11px;padding:4px 10px" onclick="window.dispatchEvent(new CustomEvent('tradexpress:aim',{detail:{text:'${theory.title} - ${theory.formula}'}}))">🎯 Aim</button>
          </div>
          <div style="margin:6px 0">${tags}</div>
          <div class="tx-formula">${theory.formula}</div>
          <p style="font-size:12px;opacity:0.7;line-height:1.5">${theory.description}</p>
          <div style="margin-top:12px">${varsHtml}</div>
          <div class="tx-result" id="${theory.id}-result"></div>
          <div style="margin-top:10px;font-size:11px;opacity:0.4">Powered by TradExpress IMPACT • hello@tradexpress.co</div>
        `;
        grid.appendChild(card);

        // Initial compute
        setTimeout(()=>this.updateResult(theory), 50);
      });

      c.appendChild(grid);

      // Attach listeners
      c.addEventListener('input', (e)=>{
        if(e.target.dataset.theory){
          const theoryId = e.target.dataset.theory;
          const varKey = e.target.dataset.var;
          const val = parseFloat(e.target.value);
          const theory = this.theories.find(t=>t.id===theoryId);
          if(theory){
            theory.variables[varKey].value = val;
            const span = document.getElementById(`${theoryId}-${varKey}-val`);
            if(span) span.textContent = val;
            this.updateResult(theory);
          }
        }
      });
    },

    updateResult: function(theory){
      const values = {};
      for(const [k,v] of Object.entries(theory.variables)) values[k]=v.value;
      const res = theory.compute(values);
      const el = document.getElementById(theory.id+'-result');
      if(!el) return;
      let html='';
      for(const [k,v] of Object.entries(res)){
        const formatted = typeof v==='number' ? (v>1000 ? '₱'+v.toLocaleString() : (Math.round(v*100)/100)) : v;
        html+=`<div><span style="opacity:0.5;font-size:11px">${k}</span><b>${formatted}</b></div>`;
      }
      el.innerHTML=html;
      // Dispatch event for TX
      window.dispatchEvent(new CustomEvent('tradexpress:theory:update', {detail:{theory:theory.id, result:res}}));
    },

    addTheory: function(theory){
      this.theories.unshift(theory);
      this.renderList();
    },

    getTheories: function(){ return this.theories; }
  };

  window.TradExpressTheory = TheoryEngine;

  // Auto init if data attribute
  document.addEventListener('DOMContentLoaded', ()=>{
    const auto = document.querySelector('[data-tradexpress-theory]');
    if(auto){
      TheoryEngine.init('[data-tradexpress-theory]');
    }
  });

})(window);
