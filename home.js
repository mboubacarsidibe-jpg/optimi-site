

// ============================================
// Home page scripts (extracted from inline)
// ============================================

// --- Block 1 ---
/* ── SEGMENTS ── */
  function showSegment(id, btn) {
    document.querySelectorAll('.seg-panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.seg-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    btn.classList.add('active');
  }

  /* ── FAQ ── */
  function toggleFaq(btn) {
    const answer = btn.nextElementSibling;
    const isOpen = btn.classList.contains('open');
    document.querySelectorAll('.faq-q').forEach(q => { q.classList.remove('open'); q.nextElementSibling.classList.remove('open'); });
    if (!isOpen) { btn.classList.add('open'); answer.classList.add('open'); }
  }

  /* ── REVENUE CALCULATOR ── */
  const RATES = {
    premium: { studio:[1600,2000], t2:[2400,3200], t3:[3500,4800], t4:[5000,7000] },
    mid:     { studio:[1100,1500], t2:[1700,2400], t3:[2400,3500], t4:[3500,5000] },
    suburb:  { studio:[1200,1700], t2:[1900,2700], t3:[2700,3800], t4:[3800,5500] },
    outer:   { studio:[700,1000],  t2:[1000,1500], t3:[1400,2200], t4:[2000,3200] },
  };
  const OCC = { short: '78-88%', mid: '90-96%', mix: '85-92%' };
  const MODE_FACTOR = { short: 1, mid: 0.85, mix: 1.05 };

  function calcRevenue() {
    const zone = document.getElementById('calc-zone').value;
    const type = document.getElementById('calc-type').value;
    const mode = document.getElementById('calc-mode').value;
    const [lo, hi] = RATES[zone][type];
    const f = MODE_FACTOR[mode];
    const brut = Math.round(((lo + hi) / 2) * f / 100) * 100;
    const net  = Math.round(brut * 0.80 / 50) * 50;
    const occ  = OCC[mode];
    document.getElementById('cr-brut').textContent = brut.toLocaleString('fr-FR') + '€';
    document.getElementById('cr-net').textContent  = net.toLocaleString('fr-FR') + '€';
    document.getElementById('cr-occ').textContent  = occ;
    const result = document.getElementById('calc-result');
    result.classList.add('show');
    // Show email capture form after result (non-blocking)
    const detailForm = document.getElementById('calc-detail-form');
    if (detailForm) detailForm.classList.add('show');
    result.scrollIntoView({ behavior:'smooth', block:'nearest' });
  }

  /* ── SOCIAL PROOF TOASTS ── */
  const toasts = [
    { name:'Sophie · Paris 7e', msg:'vient de recevoir son estimation gratuite' },
    { name:'Thomas · Neuilly-sur-Seine', msg:'a rejoint OPTIMI - portefeuille 3 biens' },
    { name:'Marie-Laure · Paris 11e', msg:'vient de recevoir son estimation gratuite' },
    { name:'Julien · Boulogne-Billancourt', msg:'a demandé un audit de conversion bureaux' },
    { name:'Camille · Paris 16e', msg:'vient de recevoir son estimation gratuite' },
    { name:'Alexandre · Paris 8e', msg:'a rejoint OPTIMI - 2 appartements' },
    { name:'Nathalie · Levallois-Perret', msg:'vient de recevoir son estimation gratuite' },
  ];
  let toastIdx = 0;
  let toastTimeout = null;
  function showToast() {
    const el = document.getElementById('toast');
    if (!el) return;
    // If already showing, hide first then re-show with new content
    if (el.classList.contains('show')) {
      el.classList.remove('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      setTimeout(displayNext, 600);
    } else {
      displayNext();
    }
    function displayNext() {
      const t = toasts[toastIdx % toasts.length];
      document.getElementById('toast-name').textContent = t.name;
      document.getElementById('toast-msg').textContent  = t.msg;
      el.classList.add('show');
      if (toastTimeout) clearTimeout(toastTimeout);
      toastTimeout = setTimeout(() => el.classList.remove('show'), 5000);
      toastIdx++;
    }
  }
  // Show first toast after 10s, then every 25s (avoid overlap with 5s display + 600ms transition buffer)
  setTimeout(() => { showToast(); setInterval(showToast, 25000); }, 10000);

  /* ── CITIES INTERACTIVE ── */
  const CITIES = [
    { key:'paris', name:'Paris', region:'Île-de-France', properties:'100', revenue:'3.400€', occupancy:'88%', growth:'+32%', desc:'Capitale touristique mondiale avec une demande constante en location courte durée toute l\'année.', img:'https://images.pexels.com/photos/739407/pexels-photo-739407.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'nice', name:'Nice', region:'Côte d\'Azur', properties:'45', revenue:'2.800€', occupancy:'85%', growth:'+28%', desc:'Riviera française. Forte demande sur la Promenade des Anglais et le Vieux-Nice - touristes internationaux toute l\'année.', img:'https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'cannes', name:'Cannes', region:'Côte d\'Azur', properties:'38', revenue:'3.200€', occupancy:'90%', growth:'+35%', desc:'Marché premium event-driven : Festival de Cannes, MIPIM, MIDEM. Tarifs ultra-élevés en haute saison.', img:'https://images.pexels.com/photos/2870167/pexels-photo-2870167.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'monaco', name:'Monaco', region:'Principauté', properties:'25', revenue:'5.500€', occupancy:'92%', growth:'+40%', desc:'Marché ultra-premium. Clientèle internationale UHNW toute l\'année - Grand Prix, Yacht Show, festivals.', img:'https://images.pexels.com/photos/2869741/pexels-photo-2869741.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'marseille', name:'Marseille', region:'PACA', properties:'32', revenue:'2.200€', occupancy:'82%', growth:'+25%', desc:'Port méditerranéen en pleine renaissance. Croissance soutenue depuis Capitale Européenne 2013, demande tourisme et business.', img:'https://images.pexels.com/photos/2916820/pexels-photo-2916820.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'bordeaux', name:'Bordeaux', region:'Nouvelle-Aquitaine', properties:'28', revenue:'2.400€', occupancy:'84%', growth:'+30%', desc:'Capitale du vin. Mix attractif business + tourisme œnologique, demande premium soutenue toute l\'année.', img:'https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'dakar', name:'Dakar', region:'Sénégal', properties:'15', revenue:'1.800€', occupancy:'80%', growth:'+35%', desc:'Hub d\'affaires Afrique de l\'Ouest. Demande expat & événementielle, tickets premium pour clientèle business.', img:'https://images.pexels.com/photos/5503184/pexels-photo-5503184.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'saly', name:'Saly', region:'Sénégal', properties:'12', revenue:'1.600€', occupancy:'78%', growth:'+28%', desc:'Première station balnéaire du Sénégal. Marché vacances haut de gamme, clientèle européenne en saison.', img:'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'abidjan', name:'Abidjan', region:'Côte d\'Ivoire', properties:'18', revenue:'1.900€', occupancy:'81%', growth:'+30%', desc:'Capitale économique de Côte d\'Ivoire. Marché business soutenu, demande forte sur Plateau et Cocody.', img:'https://images.pexels.com/photos/6469823/pexels-photo-6469823.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'assinie', name:'Assinie', region:'Côte d\'Ivoire', properties:'10', revenue:'1.500€', occupancy:'75%', growth:'+25%', desc:'Riviera ivoirienne. Marché vacances premium pour expatriés et clientèle ouest-africaine aisée.', img:'https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'newyork', name:'New York', region:'États-Unis', properties:'8', revenue:'4.500€', occupancy:'86%', growth:'+38%', desc:'Marché global premium. Demande corporate (Manhattan) et touristique soutenue, ticket moyen élevé.', img:'https://images.pexels.com/photos/290595/pexels-photo-290595.jpeg?auto=compress&cs=tinysrgb&w=1200' },
    { key:'losangeles', name:'Los Angeles', region:'États-Unis', properties:'6', revenue:'4.200€', occupancy:'84%', growth:'+35%', desc:'West Coast lifestyle. Mix tourisme et business, forte demande sur Beverly Hills, Santa Monica, West Hollywood.', img:'https://images.pexels.com/photos/1634278/pexels-photo-1634278.jpeg?auto=compress&cs=tinysrgb&w=1200' }
  ];

  function renderCityList() {
    const list = document.getElementById('cityList');
    if (!list) return;
    list.innerHTML = CITIES.map((c, i) => `
      <button class="city-btn ${i===0?'active':''}" data-key="${c.key}">
        <svg class="city-pin" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
        <div class="city-btn-info">
          <strong>${c.name}</strong>
          <span>${c.region}</span>
        </div>
      </button>
    `).join('');
    list.querySelectorAll('.city-btn').forEach(b => {
      b.addEventListener('click', () => selectCity(b.dataset.key, b));
    });
  }

  function selectCity(key, btn) {
    const c = CITIES.find(x => x.key === key);
    if (!c) return;
    document.getElementById('cityImg').src = c.img;
    document.getElementById('cityImg').alt = c.name;
    document.getElementById('cityName').textContent = c.name;
    document.getElementById('cityRegion').textContent = c.region;
    document.getElementById('cityDesc').textContent = c.desc;
    document.getElementById('statProps').textContent = c.properties;
    document.getElementById('statRev').textContent = c.revenue;
    document.getElementById('statOcc').textContent = c.occupancy;
    document.getElementById('statGrowth').textContent = c.growth;
    document.querySelectorAll('.city-btn').forEach(b => b.classList.remove('active'));
    if (btn) btn.classList.add('active');
  }

  renderCityList();

  /* ── CALC EMAIL CAPTURE (post-result) ── */
  const calcSubmit = document.getElementById('calc-detail-submit');
  if (calcSubmit) {
    calcSubmit.addEventListener('click', () => {
      const emailInput = document.getElementById('calc-email');
      const email = emailInput.value.trim();
      if (!email || !email.includes('@')) {
        emailInput.style.borderColor = '#ef4444';
        return;
      }
      const zone = document.getElementById('calc-zone').value;
      const type = document.getElementById('calc-type').value;
      const mode = document.getElementById('calc-mode').value;
      const brut = document.getElementById('cr-brut').textContent;
      const net  = document.getElementById('cr-net').textContent;
      const ctxMsg = 'Zone: '+zone+' - Type: '+type+' - Mode: '+mode+' - Brut: '+brut+' - Net: '+net;
      OPTIMI.submitLead({
        email: email,
        city: zone,
        message: ctxMsg,
        objectif: 'Simulation détaillée Calc Home',
        source: 'calc-detail',
        formName: 'Calculateur Home (Simulation Détaillée)',
        tags: ['calc-roi','lead-magnet','calc-home','calculator'],
        leadScore: 15
      });
      // Replace form with success message (inline UX)
      const detailForm = document.getElementById('calc-detail-form');
      detailForm.innerHTML = '<div class="calc-detail-success">✓ Merci ! Votre simulation détaillée arrive dans les 5 prochaines minutes sur <strong>'+email+'</strong>. Vérifiez aussi vos spams.</div>';
    });
  }

  /* ── SMOOTH SCROLL ── */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

// --- Block 2 ---
const chatR = {
  'estimer':   "Pour une estimation précise, j'ai besoin de :\n• Type de bien (studio, T2…)\n• Localisation (arrondissement ou ville)\n• Profil (occupant ou investisseur)\n\nEn moyenne nos propriétaires gagnent +38% vs gestion solo. Remplissez le formulaire - réponse sous 24h.",
  'tarif':     "Nos formules :\n\n🏠 Propriétaire Occupant - 20% tout inclus\n📈 Investisseur - 20% (multi-plateformes + LMNP)\n🏢 Portefeuille 3+ biens - tarif dégressive\n\nTout inclus : photos pro, annonces, voyageurs 24/7, ménage, reporting. Zéro frais caché.",
  'apporteur': "Programme apporteurs d'affaires :\n\n• 1-2 biens → 3%\n• 3-9 biens → 5%\n• 10+ biens → 7%\n\nCommission mensuelle récurrente sur les revenus des biens apportés. Idéal pour agents immo, notaires, gestionnaires de patrimoine.",
  'guide':     "Notre Guide Expert Airbnb Paris 2026 (42 pages) est 100% gratuit !\n\nIl couvre : réglementation 120 jours, LMNP/LMP, tarification dynamique, simulations de rentabilité par profil.\n\nRemplissez le formulaire de contact pour le recevoir immédiatement.",
  'default':   "Merci pour votre message. Pour une réponse personnalisée, notre équipe vous rappelle sous 24h.\n\nVous pouvez aussi remplir le formulaire d'estimation gratuite en haut de page."
};
let chatOpen = false;
function toggleChat(){
  chatOpen=!chatOpen;
  document.getElementById('chatWin').classList.toggle('open',chatOpen);
  document.getElementById('chatBtn').textContent=chatOpen?'✕':'💬';
}
function addMsg(txt,type){
  const d=document.createElement('div');
  d.className=`cmsg ${type}`;
  d.innerHTML=`<div class="cmsg-b">${txt.replace(/\n/g,'<br/>')}</div>`;
  document.getElementById('chatMsgs').appendChild(d);
  document.getElementById('chatMsgs').scrollTop=9999;
}
function quickSend(txt){
  document.getElementById('chatQuick').style.display='none';
  addMsg(txt,'usr');
  setTimeout(()=>{
    const k=txt.toLowerCase();
    const r=k.includes('estim')?chatR.estimer:k.includes('tarif')||k.includes('formul')?chatR.tarif:k.includes('apport')?chatR.apporteur:k.includes('guide')?chatR.guide:chatR.default;
    addMsg(r,'bot');
  },600);
}
function sendChat(){
  const inp=document.getElementById('chatInp');
  const txt=inp.value.trim(); if(!txt)return;
  document.getElementById('chatQuick').style.display='none';
  addMsg(txt,'usr'); inp.value='';
  setTimeout(()=>{
    const k=txt.toLowerCase();
    const r=k.includes('estim')?chatR.estimer:k.includes('tarif')||k.includes('prix')||k.includes('commiss')?chatR.tarif:k.includes('apport')||k.includes('parrain')?chatR.apporteur:k.includes('guide')||k.includes('pdf')?chatR.guide:chatR.default;
    addMsg(r,'bot');
  },700);
}

