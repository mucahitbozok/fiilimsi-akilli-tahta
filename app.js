// ======================================================
// 🕵️ FİİLİMSİ DEDEKTİFLERİ - 8. SINIF AKILLI TAHTA MOTORU
// ======================================================

// --- 1. WEB AUDIO API SES SENTEZLEYİCİ (İNTERNETSİZ AKILLI TAHTALARDA ÇALIŞIR) ---
let soundEnabled = true;
const AudioCtx = window.AudioContext || window.webkitAudioContext;
let audioCtx = null;

function initAudio() {
  if (!audioCtx && AudioCtx) {
    audioCtx = new AudioCtx();
  }
}

function playSound(type) {
  if (!soundEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    if (type === 'correct') {
      // Neşeli başarı akoru (C5 -> E5 -> G5)
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.18, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } else if (type === 'wrong') {
      // Yumuşak uyarı tonu
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(210, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.3);
      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.34);
    } else if (type === 'click') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.07);
    } else if (type === 'tick') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === 'fanfare') {
      [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.11);
        gain.gain.setValueAtTime(0.22, now + idx * 0.11);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.11 + 0.5);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.11);
        osc.stop(now + idx * 0.11 + 0.52);
      });
    }
  } catch (e) {
    // Ses hatası olursa sessizce devam et
  }
}

function toggleSound() {
  soundEnabled = !soundEnabled;
  const btn = document.getElementById('btn-sound');
  btn.textContent = soundEnabled ? '🔊 Ses: Açık' : '🔇 Ses: Kapalı';
  btn.classList.toggle('active', soundEnabled);
}

function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch(() => {});
  } else {
    document.exitFullscreen().catch(() => {});
  }
}

function toggleCheatSheet() {
  playSound('click');
  const panel = document.getElementById('cheatsheet-panel');
  panel.style.display = panel.style.display === 'none' ? 'block' : 'none';
}

// --- 2. AKILLI TAHTA KALEM / ÇİZİM ARACI ---
const canvas = document.getElementById('drawing-canvas');
const ctx = canvas.getContext('2d');
let drawingMode = false;
let isDrawing = false;
let penColor = '#fde047';

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

function toggleDrawingMode() {
  drawingMode = !drawingMode;
  canvas.classList.toggle('active', drawingMode);
  document.getElementById('btn-draw-toggle').classList.toggle('active', drawingMode);
  document.getElementById('draw-tools-popup').classList.toggle('show', drawingMode);
  playSound('click');
}

function setPenColor(color, el) {
  penColor = color;
  document.querySelectorAll('.color-dot').forEach(d => d.classList.remove('active'));
  if (el) el.classList.add('active');
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  playSound('click');
}

canvas.addEventListener('pointerdown', (e) => {
  if (!drawingMode) return;
  isDrawing = true;
  ctx.beginPath();
  ctx.moveTo(e.clientX, e.clientY);
});

canvas.addEventListener('pointermove', (e) => {
  if (!drawingMode || !isDrawing) return;
  ctx.lineWidth = 5;
  ctx.lineCap = 'round';
  ctx.strokeStyle = penColor;
  ctx.lineTo(e.clientX, e.clientY);
  ctx.stroke();
});

window.addEventListener('pointerup', () => {
  isDrawing = false;
});

// --- 4. MODÜL GEÇİŞ SİSTEMİ ---
function switchModule(modId) {
  playSound('click');
  stopSpeedTimer();
  document.querySelectorAll('.module-section').forEach(sec => sec.classList.remove('active'));
  const targetSec = document.getElementById('sec-' + modId);
  if (targetSec) targetSec.classList.add('active');

  document.querySelectorAll('.nav-pill').forEach(pill => {
    pill.classList.toggle('active', pill.dataset.target === modId);
  });
}

// ======================================================
// BÖLÜM 1: DERSE GİRİŞ – “HANGİSİ FARKLI?” VERİ VE MANTIĞI
// ======================================================
const discoverySets = [
  {
    prompt: '“Bu üç cümlede de okumakla ilgili bir kelime var. Peki neden görevleri aynı değil?”',
    items: [
      {
        before: 'Kitap ',
        word: 'okuyorum.',
        after: '',
        badge: '📕 ÇEKİMLİ FİİL (YÜKLEM)',
        color: '#ef4444',
        explanation: '“-yor” şimdiki zaman kipi ve “-um” 1. tekil şahıs eki almış. Cümlenin ana yargısını (işini) bildiriyor; yani gerçek bir FİİL!'
      },
      {
        before: 'Kitap ',
        word: 'okumayı',
        after: ' seviyorum.',
        badge: '🟦 İSİM-FİİL (FİİLİMSİ)',
        color: '#3b82f6',
        explanation: '“oku-” fiiline “-ma” eki gelerek o eylemin ADI olmuş. Zaman eki almamış, cümlede “Neyi seviyorum?” sorusuna cevap veren bir İSİM gibi davranıyor!'
      },
      {
        before: 'Kitap ',
        word: 'okumak',
        after: ' çok faydalıdır.',
        badge: '🟦 İSİM-FİİL (FİİLİMSİ)',
        color: '#3b82f6',
        explanation: '“oku-” fiiline “-mak” isim-fiil eki gelmiş. Artık çekimli bir fiil değil; cümlenin öznesi görevinde bir FİİLİMSİ!'
      }
    ]
  },
  {
    prompt: '“Bu üç cümlede de koşmak eylemi var. Hangisi gerçek fiil, hangileri fiilimsi?”',
    items: [
      {
        before: 'Ali sabah parkta ',
        word: 'koştu.',
        after: '',
        badge: '📕 ÇEKİMLİ FİİL (YÜKLEM)',
        color: '#ef4444',
        explanation: '“-tu” bilinen geçmiş zaman kipi almış ve cümlenin yüklemi olmuş. Çekimli fiildir.'
      },
      {
        before: 'Hızla ',
        word: 'koşan',
        after: ' çocuk birinci oldu.',
        badge: '🟩 SIFAT-FİİL (FİİLİMSİ)',
        color: '#10b981',
        explanation: '“koş-an” kelimesi “çocuk” ismini niteliyor (Nasıl çocuk? Koşan çocuk). Fiilden türeyip SIFAT görevine geçmiş!'
      },
      {
        before: 'Ali ',
        word: 'koşarak',
        after: ' sınıfa girdi.',
        badge: '🟨 ZARF-FİİL (FİİLİMSİ)',
        color: '#f59e0b',
        explanation: '“koş-arak” kelimesi “Nasıl girdi?” sorusuna cevap veriyor. Fiili durum bakımından tamamlayan bir ZARF-FİİL!'
      }
    ]
  },
  {
    prompt: '“Bakmak fiili bu üç cümlede hangi kılıklara girmiş?”',
    items: [
      {
        before: 'Pencereden dışarı ',
        word: 'baktı.',
        after: '',
        badge: '📕 ÇEKİMLİ FİİL (YÜKLEM)',
        color: '#ef4444',
        explanation: 'Zaman eki (-tı) alarak yargı bildiriyor. Çekimli fiildir.'
      },
      {
        before: 'Bize ',
        word: 'bakan',
        after: ' kediyi besledik.',
        badge: '🟩 SIFAT-FİİL (FİİLİMSİ)',
        color: '#10b981',
        explanation: '“kedi” isminin önüne gelip onu nitelemiş (-an sıfat-fiil eki).'
      },
      {
        before: 'Gözlerime ',
        word: 'bakınca',
        after: ' her şeyi anladı.',
        badge: '🟨 ZARF-FİİL (FİİLİMSİ)',
        color: '#f59e0b',
        explanation: '“Ne zaman anladı? Bakınca.” Cümleye zaman anlamı katan bir ZARF-FİİL (-ınca eki).'
      }
    ]
  }
];

let currentDiscSet = 0;

function renderDiscoverySet() {
  const set = discoverySets[currentDiscSet];
  document.getElementById('disc-set-index').textContent = `${currentDiscSet + 1}/${discoverySets.length}`;
  document.getElementById('disc-question-prompt').textContent = set.prompt;
  document.getElementById('disc-summary-note').style.display = 'none';

  const container = document.getElementById('discovery-cards-container');
  container.innerHTML = '';

  set.items.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'discovery-box';
    card.id = `disc-card-${idx}`;
    card.innerHTML = `
      <div>
        <span class="badge-time" style="margin-bottom:12px; display:inline-block;">${idx + 1}. Cümle</span>
        <div class="sentence-large">
          ${item.before}<span class="target-word" onclick="toggleDiscoveryCard(${idx})">${item.word}</span>${item.after}
        </div>
      </div>
      <div class="role-reveal" style="background: rgba(15,23,42,0.9); border: 2px solid ${item.color};">
        <div style="color:${item.color}; font-size:1.2rem; margin-bottom:6px;">${item.badge}</div>
        <div style="color:#e2e8f0; font-weight:600;">${item.explanation}</div>
      </div>
      <button class="btn-secondary" style="justify-content:center;" onclick="toggleDiscoveryCard(${idx})">
        🔍 Görevini İncele
      </button>
    `;
    container.appendChild(card);
  });
}

function toggleDiscoveryCard(idx) {
  playSound('click');
  const card = document.getElementById(`disc-card-${idx}`);
  card.classList.toggle('revealed');
  const allRevealed = [...document.querySelectorAll('.discovery-box')].every(c => c.classList.contains('revealed'));
  if (allRevealed) {
    playSound('correct');
    document.getElementById('disc-summary-note').style.display = 'block';
  }
}

function revealAllDiscovery() {
  playSound('correct');
  document.querySelectorAll('.discovery-box').forEach(c => c.classList.add('revealed'));
  document.getElementById('disc-summary-note').style.display = 'block';
}

function nextDiscoverySet() {
  playSound('click');
  currentDiscSet = (currentDiscSet + 1) % discoverySets.length;
  renderDiscoverySet();
}

// ======================================================
// BÖLÜM 2: “FİİLİMSİ DEDEKTİFİ” VERİ VE MANTIĞI
// ======================================================
const detectiveQuestions = [
  {
    words: ['Ali,', 'koşarak', 'sınıfa', 'geldi.'],
    targetIndex: 1,
    type: 'zarf',
    suffixInfo: 'koş- + -arak → ZARF-FİİL (Nasıl geldi? Koşarak)',
    wordHints: {
      0: '“Ali” özel isimdir, fiil kökü yoktur.',
      2: '“sınıfa” isimdir (yönelme hâl eki almış).',
      3: '“geldi” çekimli fiildir (-di geçmiş zaman kipi almış yüklem)!'
    }
  },
  {
    words: ['Kitap', 'okumayı', 'çok', 'seviyorum.'],
    targetIndex: 1,
    type: 'isim',
    suffixInfo: 'oku- + -ma-(y)ı → İSİM-FİİL (MA-Y-IŞ-MAK eklerinden -ma)',
    wordHints: {
      0: '“Kitap” varlık ismidir.',
      2: '“çok” miktar zarfıdır, fiil kökü yoktur.',
      3: '“seviyorum” cümlenin çekimli fiilidir (-yor şimdiki zaman kipi almış).'
    }
  },
  {
    words: ['Sınıfta', 'gülen', 'çocuk', 'herkesi', 'neşelendirdi.'],
    targetIndex: 1,
    type: 'sifat',
    suffixInfo: 'gül- + -en → SIFAT-FİİL (Nasıl çocuk? Gülen çocuk)',
    wordHints: {
      0: '“Sınıfta” isimdir.',
      2: '“çocuk” isimdir (sıfat-fiilin nitelediği isimdir).',
      3: '“herkesi” zamirdir.',
      4: '“neşelendirdi” çekimli fiildir (yüklem).'
    }
  },
  {
    words: ['Güneş', 'doğunca', 'kuşlar', 'ötmeye', 'başladı.'],
    targetIndex: 1, // Alternatif olarak 3 de fiilimsi, ikisini de destekleyelim!
    altTargetIndex: 3,
    type: 'zarf',
    altType: 'isim',
    suffixInfo: 'doğ-unca (Zarf-Fiil) ve öt-me-ye (İsim-Fiil)! İkisi de fiilimsidir.',
    wordHints: {
      0: '“Güneş” isimdir.',
      2: '“kuşlar” çoğul isimdir.',
      4: '“başladı” çekimli fiildir (yüklem).'
    }
  },
  {
    words: ['Çalışan', 'öğrenciler', 'hedeflerine', 'ulaşır.'],
    targetIndex: 0,
    type: 'sifat',
    suffixInfo: 'çalış- + -an → SIFAT-FİİL (Hangi öğrenciler? Çalışan öğrenciler)',
    wordHints: {
      1: '“öğrenciler” isimdir.',
      2: '“hedeflerine” isimdir.',
      3: '“ulaşır” geniş zamanla çekimlenmiş fiildir (yüklem).'
    }
  },
  {
    words: ['Sabah', 'erkenden', 'kalkmak', 'insanı', 'dinçleştirir.'],
    targetIndex: 2,
    type: 'isim',
    suffixInfo: 'kalk- + -mak → İSİM-FİİL (MA-Y-IŞ-MAK eklerinden -mak)',
    wordHints: {
      0: '“Sabah” zaman ismidir.',
      1: '“erkenden” zarftır ama fiil köklü değildir.',
      3: '“insanı” isimdir.',
      4: '“dinçleştirir” geniş zamanlı çekimli fiildir.'
    }
  },
  {
    words: ['Kimseye', 'danışmadan', 'karar', 'vermemelisin.'],
    targetIndex: 1,
    type: 'zarf',
    suffixInfo: 'danış- + -madan → ZARF-FİİL (Nasıl karar vermemelisin? Danışmadan)',
    wordHints: {
      0: '“Kimseye” belgisiz zamirdir.',
      2: '“karar” isimdir.',
      3: '“vermemelisin” gereklilik kipi (-meli) almış çekimli fiildir!'
    }
  },
  {
    words: ['Kırılan', 'bardakları', 'dikkatlice', 'topladık.'],
    targetIndex: 0,
    type: 'sifat',
    suffixInfo: 'kırıl- + -an → SIFAT-FİİL (Nasıl bardaklar? Kırılan bardaklar)',
    wordHints: {
      1: '“bardakları” isimdir.',
      2: '“dikkatlice” fiil köklü değildir (isimden türemiş zarf).',
      3: '“topladık” geçmiş zaman kipi (-dı) ve kişi eki (-k) almış çekimli fiildir.'
    }
  }
];

let currentDetIndex = 0;
let activeDetTargetType = 'zarf';

function renderDetective() {
  const q = detectiveQuestions[currentDetIndex];
  document.getElementById('det-progress-badge').textContent = `Soru ${currentDetIndex + 1} / ${detectiveQuestions.length}`;
  document.getElementById('det-step-instruction').textContent = '👇 1. ADIM: Cümledeki FİİLİMSİ olan kelimenin üzerine dokun!';
  document.getElementById('det-type-section').style.display = 'none';
  hideFeedback('det-feedback');

  const container = document.getElementById('det-word-tokens');
  container.innerHTML = '';

  q.words.forEach((w, idx) => {
    const btn = document.createElement('button');
    btn.className = 'word-token';
    btn.textContent = w;
    btn.onclick = () => selectDetectiveWord(idx, btn);
    container.appendChild(btn);
  });
}

function selectDetectiveWord(idx, btnEl) {
  const q = detectiveQuestions[currentDetIndex];
  if (idx === q.targetIndex || idx === q.altTargetIndex) {
    playSound('correct');
    document.querySelectorAll('#det-word-tokens .word-token').forEach(b => b.classList.remove('wrong-word'));
    btnEl.classList.add('correct-word');

    const cleanWord = q.words[idx].replace(/[.,!?]/g, '').toUpperCase();
    document.getElementById('det-found-word-label').textContent = cleanWord;
    activeDetTargetType = (idx === q.altTargetIndex && q.altType) ? q.altType : q.type;

    document.getElementById('det-type-section').style.display = 'block';
    showFeedback('det-feedback', 'success', `✅ Süper! "${cleanWord}" kelimesi bir fiilimsidir. Şimdi aşağıdan hangi tür fiilimsi olduğunu seç!`);
  } else {
    playSound('wrong');
    btnEl.classList.add('wrong-word');
    const hint = (q.wordHints && q.wordHints[idx]) ? q.wordHints[idx] : 'Bu kelime fiilimsi değil, tekrar dene!';
    showFeedback('det-feedback', 'error', `🔄 İpucu: ${hint}`);
  }
}

function checkDetectiveType(chosenType) {
  const q = detectiveQuestions[currentDetIndex];
  const typeNames = { isim: 'İSİM-FİİL', sifat: 'SIFAT-FİİL', zarf: 'ZARF-FİİL' };

  if (chosenType === activeDetTargetType) {
    playSound('fanfare');
    showFeedback('det-feedback', 'success', `🎉 TEBRİKLER DEDEKTİF! Doğru Cevap: ${typeNames[chosenType]} • (${q.suffixInfo})`);
  } else {
    playSound('wrong');
    showFeedback('det-feedback', 'error', `🔄 Tekrar Düşün! Kelimenin aldığı eke ve cümlede İsim mi, Sıfat mı, Zarf mı olduğuna dikkat et.`);
  }
}

function nextDetective() {
  playSound('click');
  currentDetIndex = (currentDetIndex + 1) % detectiveQuestions.length;
  renderDetective();
}

function prevDetective() {
  playSound('click');
  currentDetIndex = (currentDetIndex - 1 + detectiveQuestions.length) % detectiveQuestions.length;
  renderDetective();
}

// ======================================================
// BÖLÜM 3: “FİİLİMSİ MAKİNESİ” VERİ VE MANTIĞI
// ======================================================
const machineVerbs = [
  {
    root: 'gül-',
    isim: { word: 'gülmek', html: 'gül<span class="suffix-highlight">mek</span>', sentence: '“Birlikte <strong>gülmek</strong> herkese iyi geldi.”', role: 'Eylemin adı oldu (-mek isim-fiil eki)' },
    sifat: { word: 'gülen çocuk', html: 'gül<span class="suffix-highlight">en</span> çocuk', sentence: '“<strong>Gülen</strong> çocuk etrafına neşe saçtı.”', role: 'Çocuk ismini niteledi (-en sıfat-fiil eki)' },
    zarf: { word: 'gülerek konuştu', html: 'gül<span class="suffix-highlight">erek</span> konuştu', sentence: '“Arkadaşıyla <strong>gülerek</strong> konuştu.”', role: 'Nasıl konuştuğunu belirtti (-erek zarf-fiil eki)' }
  },
  {
    root: 'koş-',
    isim: { word: 'koşmayı', html: 'koş<span class="suffix-highlight">ma</span>yı', sentence: '“Sabahları sahilde <strong>koşmayı</strong> severim.”', role: 'Nesne görevinde isim-fiil (-ma)' },
    sifat: { word: 'koşan atlet', html: 'koş<span class="suffix-highlight">an</span> atlet', sentence: '“Hızla <strong>koşan</strong> atlet rekor kırdı.”', role: 'Atlet ismini niteleyen sıfat-fiil (-an)' },
    zarf: { word: 'koşup geldi', html: 'koş<span class="suffix-highlight">up</span> geldi', sentence: '“Haberleri duyunca <strong>koşup</strong> geldi.”', role: 'Durum/bağlama bildiren zarf-fiil (-up)' }
  },
  {
    root: 'çalış-',
    isim: { word: 'çalışmak', html: 'çalış<span class="suffix-highlight">mak</span>', sentence: '“Planlı <strong>çalışmak</strong> başarının anahtarıdır.”', role: 'Özne görevinde isim-fiil (-mak)' },
    sifat: { word: 'çalışan öğrenci', html: 'çalış<span class="suffix-highlight">an</span> öğrenci', sentence: '“Düzenli <strong>çalışan</strong> öğrenci sınavı kazandı.”', role: 'Öğrenci ismini niteleyen sıfat-fiil (-an)' },
    zarf: { word: 'çalışırken dinledi', html: 'çalışır<span class="suffix-highlight">ken</span> dinledi', sentence: '“Ders <strong>çalışırken</strong> notlar aldı.”', role: 'Zaman bildiren zarf-fiil (-ken)' }
  },
  {
    root: 'oku-',
    isim: { word: 'okuma saati', html: 'oku<span class="suffix-highlight">ma</span> saati', sentence: '“Sınıfımızda kitap <strong>okuma</strong> saati başladı.”', role: 'İsim tamlaması kuran isim-fiil (-ma)' },
    sifat: { word: 'okunacak kitaplar', html: 'okun<span class="suffix-highlight">acak</span> kitaplar', sentence: '“Rafımda <strong>okunacak</strong> kitaplar birikti.”', role: 'Kitaplar ismini niteleyen sıfat-fiil (-acak)' },
    zarf: { word: 'okudukça gelişti', html: 'oku<span class="suffix-highlight">dukça</span> gelişti', sentence: '“Yeni kitaplar <strong>okudukça</strong> kelime hazinesi gelişti.”', role: 'Zaman/oran bildiren zarf-fiil (-dukça)' }
  },
  {
    root: 'bak-',
    isim: { word: 'bakışı', html: 'bak<span class="suffix-highlight">ış</span>ı', sentence: '“Kedinin masum <strong>bakışı</strong> hepimizi etkiledi.”', role: 'MA-Y-IŞ-MAK eklerinden -ış (İsim-fiil)' },
    sifat: { word: 'bakan kişi', html: 'bak<span class="suffix-highlight">an</span> kişi', sentence: '“Pencereden <strong>bakan</strong> kişi dedemdi.”', role: 'Kişi ismini niteleyen sıfat-fiil (-an)' },
    zarf: { word: 'bakınca anladı', html: 'bak<span class="suffix-highlight">ınca</span> anladı', sentence: '“Soruya dikkatli <strong>bakınca</strong> çözümü buldu.”', role: 'Zaman bildiren zarf-fiil (-ınca)' }
  },
  {
    root: 'yaz-',
    isim: { word: 'yazmaya', html: 'yaz<span class="suffix-highlight">ma</span>ya', sentence: '“Günlük <strong>yazmaya</strong> geçen yıl başladım.”', role: 'Eylemin adı (-ma isim-fiil eki)' },
    sifat: { word: 'yazılmış mektup', html: 'yazıl<span class="suffix-highlight">mış</span> mektup', sentence: '“Çekmecede yıllar önce <strong>yazılmış</strong> bir mektup buldu.”', role: 'Mektup ismini niteleyen sıfat-fiil (-mış)' },
    zarf: { word: 'yazmadan çıktı', html: 'yaz<span class="suffix-highlight">madan</span> çıktı', sentence: '“Ödevini deftere <strong>yazmadan</strong> dışarı çıktı.”', role: 'Durum bildiren zarf-fiil (-madan)' }
  }
];

let currentMachineRootIdx = 0;
let isMachineQuizMode = false;
let selectedQuizItem = null;

function renderMachine() {
  const rootBar = document.getElementById('machine-root-bar');
  rootBar.innerHTML = '';
  machineVerbs.forEach((v, idx) => {
    const chip = document.createElement('button');
    chip.className = 'root-chip' + (idx === currentMachineRootIdx ? ' active' : '');
    chip.textContent = v.root;
    chip.onclick = () => {
      playSound('click');
      currentMachineRootIdx = idx;
      renderMachine();
    };
    rootBar.appendChild(chip);
  });

  const currentVerb = machineVerbs[currentMachineRootIdx];
  document.getElementById('machine-current-root').textContent = currentVerb.root;
  hideFeedback('machine-feedback');

  if (!isMachineQuizMode) {
    document.getElementById('machine-explore-view').style.display = 'grid';
    document.getElementById('machine-quiz-view').style.display = 'none';

    const exploreView = document.getElementById('machine-explore-view');
    exploreView.innerHTML = `
      <div class="machine-chamber isim" onclick="playSound('correct')">
        <div class="chamber-header">
          <span>🟦 İSİM-FİİL YOLU</span>
          <span>(-ma, -ış, -mak)</span>
        </div>
        <div class="chamber-word">${currentVerb.isim.html}</div>
        <div class="chamber-sentence">${currentVerb.isim.sentence}</div>
        <div style="font-size:0.95rem; color:#93c5fd; text-align:center; font-weight:700; margin-top:auto;">
          💡 ${currentVerb.isim.role}
        </div>
      </div>

      <div class="machine-chamber sifat" onclick="playSound('correct')">
        <div class="chamber-header">
          <span>🟩 SIFAT-FİİL YOLU</span>
          <span>(-an, -ası, -mez...)</span>
        </div>
        <div class="chamber-word">${currentVerb.sifat.html}</div>
        <div class="chamber-sentence">${currentVerb.sifat.sentence}</div>
        <div style="font-size:0.95rem; color:#6ee7b7; text-align:center; font-weight:700; margin-top:auto;">
          💡 ${currentVerb.sifat.role}
        </div>
      </div>

      <div class="machine-chamber zarf" onclick="playSound('correct')">
        <div class="chamber-header">
          <span>🟨 ZARF-FİİL YOLU</span>
          <span>(-ken, -arak, -ınca...)</span>
        </div>
        <div class="chamber-word">${currentVerb.zarf.html}</div>
        <div class="chamber-sentence">${currentVerb.zarf.sentence}</div>
        <div style="font-size:0.95rem; color:#fcd34d; text-align:center; font-weight:700; margin-top:auto;">
          💡 ${currentVerb.zarf.role}
        </div>
      </div>
    `;
  } else {
    renderMachineQuiz(currentVerb);
  }
}

function toggleMachineQuizMode() {
  playSound('click');
  isMachineQuizMode = !isMachineQuizMode;
  const btn = document.getElementById('btn-machine-mode');
  btn.textContent = isMachineQuizMode ? '📖 Keşif & Anlatım Moduna Dön' : '🎮 Eşleştirme Oyun Modunu Aç';
  renderMachine();
}

function renderMachineQuiz(verb) {
  document.getElementById('machine-explore-view').style.display = 'none';
  document.getElementById('machine-quiz-view').style.display = 'flex';
  selectedQuizItem = null;

  const items = [
    { type: 'isim', text: verb.isim.word, detail: verb.isim.role },
    { type: 'sifat', text: verb.sifat.word, detail: verb.sifat.role },
    { type: 'zarf', text: verb.zarf.word, detail: verb.zarf.role }
  ].sort(() => Math.random() - 0.5);

  const pool = document.getElementById('machine-quiz-pool');
  pool.innerHTML = '';
  items.forEach((it, i) => {
    const el = document.createElement('button');
    el.className = 'draggable-word';
    el.textContent = it.text;
    el.dataset.type = it.type;
    el.onclick = () => {
      playSound('click');
      document.querySelectorAll('#machine-quiz-pool .draggable-word').forEach(b => b.classList.remove('selected-word'));
      el.classList.add('selected-word');
      selectedQuizItem = { el, ...it };
    };
    pool.appendChild(el);
  });

  const targets = document.getElementById('machine-quiz-targets');
  targets.innerHTML = `
    <div class="machine-chamber isim" id="mtarget-isim" onclick="placeMachineQuizItem('isim')">
      <div class="chamber-header"><span>🟦 İSİM-FİİL MAKİNESİ</span></div>
      <div class="chamber-word" id="mval-isim">Buraya Dokun</div>
    </div>
    <div class="machine-chamber sifat" id="mtarget-sifat" onclick="placeMachineQuizItem('sifat')">
      <div class="chamber-header"><span>🟩 SIFAT-FİİL MAKİNESİ</span></div>
      <div class="chamber-word" id="mval-sifat">Buraya Dokun</div>
    </div>
    <div class="machine-chamber zarf" id="mtarget-zarf" onclick="placeMachineQuizItem('zarf')">
      <div class="chamber-header"><span>🟨 ZARF-FİİL MAKİNESİ</span></div>
      <div class="chamber-word" id="mval-zarf">Buraya Dokun</div>
    </div>
  `;
}

function placeMachineQuizItem(targetType) {
  if (!selectedQuizItem) {
    showFeedback('machine-feedback', 'error', '👆 Önce yukarıdaki kelimelerden birine dokunarak seç!');
    return;
  }
  if (selectedQuizItem.type === targetType) {
    playSound('correct');
    document.getElementById(`mval-${targetType}`).innerHTML = `✅ ${selectedQuizItem.text}`;
    selectedQuizItem.el.remove();
    selectedQuizItem = null;

    if (document.querySelectorAll('#machine-quiz-pool .draggable-word').length === 0) {
      playSound('fanfare');
      showFeedback('machine-feedback', 'success', '🎉 HARİKA! Fiil kökünün üç dönüşümünü de doğru makine koluna yerleştirdin!');
    } else {
      showFeedback('machine-feedback', 'success', '✅ Doğru eşleştirme! Diğer kelimeye geç.');
    }
  } else {
    playSound('wrong');
    showFeedback('machine-feedback', 'error', `🔄 "${selectedQuizItem.text}" bu kola ait değil! Aldığı eke tekrar dikkat et.`);
  }
}

// ======================================================
// BÖLÜM 4: “TAHTAYA DOKUN – DOĞRU KUTUYU BUL” (SÜRÜKLE & DOKUN)
// ======================================================
const boxLevels = [
  // Set 1: Plandaki Birebir Kelimeler + 3 Ek
  [
    { word: 'koşmak', type: 'isim', hint: '-mak (İsim-fiil eki)' },
    { word: 'gelen', type: 'sifat', hint: '-en (Sıfat-fiil eki)' },
    { word: 'gülerek', type: 'zarf', hint: '-erek (Zarf-fiil eki)' },
    { word: 'yazma', type: 'isim', hint: '-ma (İsim-fiil eki)' },
    { word: 'çalışan', type: 'sifat', hint: '-an (Sıfat-fiil eki)' },
    { word: 'bakınca', type: 'zarf', hint: '-ınca (Zarf-fiil eki)' },
    { word: 'yürüyüş', type: 'isim', hint: '-üş (MA-Y-IŞ-MAK isim-fiil eki)' },
    { word: 'okudukça', type: 'zarf', hint: '-dukça (Zarf-fiil eki)' },
    { word: 'tanıdık (yüz)', type: 'sifat', hint: '-dık (AN-ASI-MEZ-AR-DİK... sıfat-fiil eki)' }
  ],
  // Set 2: Orta Seviye
  [
    { word: 'anlatmaya', type: 'isim', hint: '-ma (İsim-fiil eki)' },
    { word: 'görünmez (kaza)', type: 'sifat', hint: '-mez (Sıfat-fiil eki)' },
    { word: 'durmaksızın', type: 'zarf', hint: '-maksızın (Zarf-fiil eki)' },
    { word: 'bekleyiş', type: 'isim', hint: '-iş (İsim-fiil eki)' },
    { word: 'sararmış (yaprak)', type: 'sifat', hint: '-mış (Sıfat-fiil eki)' },
    { word: 'giderken', type: 'zarf', hint: '-ken (Zarf-fiil eki)' },
    { word: 'sevmek', type: 'isim', hint: '-mek (İsim-fiil eki)' },
    { word: 'gelecek (günler)', type: 'sifat', hint: '-ecek (Sıfat-fiil eki)' },
    { word: 'koşa koşa', type: 'zarf', hint: '-a ... -a (Zarf-fiil eki)' }
  ],
  // Set 3: LGS Seviyesi
  [
    { word: 'öpülesi (eller)', type: 'sifat', hint: '-esi (AN-ASI-MEZ... sıfat-fiil eki)' },
    { word: 'gelir gelmez', type: 'zarf', hint: '-r ... -mez (Zaman bildiren zarf-fiil eki)' },
    { word: 'direniş', type: 'isim', hint: '-iş (İsim-fiil eki)' },
    { word: 'koşar (adım)', type: 'sifat', hint: '-ar (Nasıl adım? Koşar adım → Sıfat-fiil)' },
    { word: 'görmeyeli', type: 'zarf', hint: '-eli / -alı (Zarf-fiil eki)' },
    { word: 'dinlemekten', type: 'isim', hint: '-mek (İsim-fiil eki + hâl eki)' },
    { word: 'bilinen (gerçek)', type: 'sifat', hint: '-en (Sıfat-fiil eki)' },
    { word: 'ağlamadan', type: 'zarf', hint: '-madan (Zarf-fiil eki)' },
    { word: 'başarma (isteği)', type: 'isim', hint: '-ma (İsim-fiil eki)' }
  ]
];

let currentBoxLevelIdx = 0;
let selectedBoxWord = null;

function loadBoxLevel(lvlIdx) {
  playSound('click');
  currentBoxLevelIdx = lvlIdx;
  selectedBoxWord = null;
  hideFeedback('box-feedback');

  document.getElementById('dropped-isim').innerHTML = '';
  document.getElementById('dropped-sifat').innerHTML = '';
  document.getElementById('dropped-zarf').innerHTML = '';

  const pool = document.getElementById('box-word-pool');
  pool.innerHTML = '';

  const words = [...boxLevels[lvlIdx]];
  document.getElementById('box-remaining-count').textContent = words.length;

  words.forEach((item, idx) => {
    const el = document.createElement('div');
    el.className = 'draggable-word';
    el.draggable = true;
    el.id = `box-word-${idx}`;
    el.textContent = item.word;
    el.dataset.type = item.type;
    el.dataset.hint = item.hint;
    el.dataset.word = item.word;

    // Sürükle başlat
    el.addEventListener('dragstart', (e) => {
      selectedBoxWord = el;
      e.dataTransfer.setData('text/plain', el.id);
    });

    // Dokunarak seçme (Akıllı tahta kolaylığı)
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      playSound('click');
      document.querySelectorAll('#box-word-pool .draggable-word').forEach(w => w.classList.remove('selected-word'));
      el.classList.add('selected-word');
      selectedBoxWord = el;
      showFeedback('box-feedback', 'success', `👆 "${item.word}" seçildi! Şimdi ait olduğu kutuya dokun.`);
    });

    pool.appendChild(el);
  });
}

function resetCurrentBoxLevel() {
  loadBoxLevel(currentBoxLevelIdx);
}

function allowDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.add('drag-over');
}

function leaveDrop(e) {
  e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e, boxType) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const id = e.dataTransfer.getData('text/plain');
  const el = document.getElementById(id) || selectedBoxWord;
  if (el) verifyBoxPlacement(el, boxType);
}

function handleBoxTap(boxType) {
  if (!selectedBoxWord) return;
  verifyBoxPlacement(selectedBoxWord, boxType);
}

function verifyBoxPlacement(wordEl, boxType) {
  const correctType = wordEl.dataset.type;
  const wordText = wordEl.dataset.word;
  const hint = wordEl.dataset.hint;

  if (correctType === boxType) {
    playSound('correct');
    const pill = document.createElement('div');
    pill.className = 'dropped-pill';
    pill.textContent = `✅ ${wordText}`;
    document.getElementById(`dropped-${boxType}`).appendChild(pill);

    wordEl.remove();
    selectedBoxWord = null;

    const remaining = document.querySelectorAll('#box-word-pool .draggable-word').length;
    document.getElementById('box-remaining-count').textContent = remaining;

    if (remaining === 0) {
      playSound('fanfare');
      showFeedback('box-feedback', 'success', `🏆 MUHTEŞEM! Tüm kelimeleri doğru kutulara yerleştirdiniz!`);
    } else {
      showFeedback('box-feedback', 'success', `✅ HARİKA! "${wordText}" → ${hint}`);
    }
  } else {
    playSound('wrong');
    wordEl.classList.remove('selected-word');
    showFeedback('box-feedback', 'error', `🔄 TEKRAR DÜŞÜN! "${wordText}" kelimesinin köküne gelen eke dikkat et.`);
  }
}

// ======================================================
// BÖLÜM 5: “5 SANİYEDE BUL!” HIZLI RADAR MANTIĞI
// ======================================================
const speedQuestions = [
  {
    sentence: 'Ders çalışırken müzik dinlemeyi seviyorum.',
    count: 2,
    details: [
      '<strong>çalışırken</strong> → Zarf-fiil (-ken)',
      '<strong>dinlemeyi</strong> → İsim-fiil (-me)'
    ],
    note: '⚠️ “seviyorum” çekimli fiildir (yüklem), fiilimsi değildir!'
  },
  {
    sentence: 'Sınavı kazanmak isteyen öğrenciler düzenli çalışmalıdır.',
    count: 2,
    details: [
      '<strong>kazanmak</strong> → İsim-fiil (-mak)',
      '<strong>isteyen</strong> → Sıfat-fiil (-en)'
    ],
    note: '⚠️ “çalışmalıdır” gereklilik kipi almış çekimli fiildir.'
  },
  {
    sentence: 'Koşarak gelen çocuk gülümseyip mektubu uzattı.',
    count: 3,
    details: [
      '<strong>Koşarak</strong> → Zarf-fiil (-arak)',
      '<strong>gelen</strong> → Sıfat-fiil (-en)',
      '<strong>gülümseyip</strong> → Zarf-fiil (-ip)'
    ],
    note: '⚠️ “uzattı” geçmiş zaman kipi almış çekimli fiildir.'
  },
  {
    sentence: 'Gelen gideni aratır.',
    count: 2,
    details: [
      '<strong>Gelen</strong> → Adlaşmış Sıfat-fiil (-en, gelen kişi)',
      '<strong>gideni</strong> → Adlaşmış Sıfat-fiil (-en, giden kişiyi)'
    ],
    note: '🌟 LGS İpucu: Önündeki isim düşse bile sıfat-fiiller fiilimsi olma özelliğini korur!'
  },
  {
    sentence: 'Kitap okumak için kütüphaneye gitti.',
    count: 1,
    details: [
      '<strong>okumak</strong> → İsim-fiil (-mak)'
    ],
    note: 'Bu cümlede yalnızca 1 tane fiilimsi vardır.'
  },
  {
    sentence: 'Kimseye görünmeden bahçeden çıkıp koşmaya başladı.',
    count: 3,
    details: [
      '<strong>görünmeden</strong> → Zarf-fiil (-meden)',
      '<strong>çıkıp</strong> → Zarf-fiil (-ıp)',
      '<strong>koşmaya</strong> → İsim-fiil (-ma)'
    ],
    note: 'Üç farklı fiilimsi yan cümlecik kurmuştur.'
  },
  {
    sentence: 'Yapılacak işleri bitirmeden dinlenmek istemiyordu.',
    count: 3,
    details: [
      '<strong>Yapılacak</strong> (işler) → Sıfat-fiil (-acak)',
      '<strong>bitirmeden</strong> → Zarf-fiil (-meden)',
      '<strong>dinlenmek</strong> → İsim-fiil (-mek)'
    ],
    note: 'Hem sıfat-fiil, hem zarf-fiil, hem isim-fiil aynı cümlede!'
  }
];

let currentSpeedIdx = 0;
let speedInterval = null;

function renderSpeedQuestion() {
  stopSpeedTimer();
  const q = speedQuestions[currentSpeedIdx];
  document.getElementById('speed-index-badge').textContent = `Cümle ${currentSpeedIdx + 1} / ${speedQuestions.length}`;
  document.getElementById('speed-sentence-display').textContent = q.sentence;
  document.getElementById('speed-analysis-box').style.display = 'none';
  document.getElementById('speed-timer-text').textContent = '5.0 sn';
  document.getElementById('speed-timer-bar').style.width = '100%';

  document.querySelectorAll('#speed-count-buttons .count-btn').forEach(btn => {
    btn.classList.remove('correct', 'wrong');
    btn.disabled = false;
  });
}

function startSpeedTimer(seconds) {
  stopSpeedTimer();
  let remaining = seconds * 10;
  const total = remaining;
  const textEl = document.getElementById('speed-timer-text');
  const barEl = document.getElementById('speed-timer-bar');

  speedInterval = setInterval(() => {
    remaining--;
    if (remaining % 10 === 0) playSound('tick');
    textEl.textContent = (remaining / 10).toFixed(1) + ' sn';
    barEl.style.width = `${(remaining / total) * 100}%`;

    if (remaining <= 0) {
      stopSpeedTimer();
      playSound('wrong');
      textEl.textContent = '⏰ SÜRE DOLDU! Şimdi Tahmin Et!';
    }
  }, 100);
}

function stopSpeedTimer() {
  if (speedInterval) {
    clearInterval(speedInterval);
    speedInterval = null;
  }
}

function checkSpeedCount(num, btnEl) {
  stopSpeedTimer();
  const q = speedQuestions[currentSpeedIdx];
  const analysisBox = document.getElementById('speed-analysis-box');

  if (num === q.count) {
    playSound('fanfare');
    btnEl.classList.add('correct');
    analysisBox.style.display = 'block';
    analysisBox.style.borderColor = '#22c55e';
    analysisBox.innerHTML = `
      <h4 style="font-size:1.4rem; color:#4ade80; margin-bottom:10px;">✅ DOĞRU! Bu cümlede tam ${q.count} fiilimsi var:</h4>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:1.25rem;">
        ${q.details.map(d => `<li>🎯 ${d}</li>`).join('')}
      </ul>
      <div style="margin-top:12px; color:#fde047; font-weight:700;">${q.note}</div>
    `;
  } else {
    playSound('wrong');
    btnEl.classList.add('wrong');
    analysisBox.style.display = 'block';
    analysisBox.style.borderColor = '#ef4444';
    analysisBox.innerHTML = `
      <h4 style="font-size:1.3rem; color:#f87171;">🔄 Bu cümlede ${num} değil, <strong>${q.count}</strong> fiilimsi var! Birlikte bakalım:</h4>
      <ul style="list-style:none; display:flex; flex-direction:column; gap:8px; font-size:1.2rem; margin-top:8px;">
        ${q.details.map(d => `<li>🎯 ${d}</li>`).join('')}
      </ul>
      <div style="margin-top:10px; color:#fde047; font-weight:700;">${q.note}</div>
    `;
  }
}

function nextSpeedQuestion() {
  playSound('click');
  currentSpeedIdx = (currentSpeedIdx + 1) % speedQuestions.length;
  renderSpeedQuestion();
  startSpeedTimer(5);
}

// ======================================================
// BÖLÜM 6: “FİİL Mİ, FİİLİMSİ Mİ? (+ KALICI İSİM)” DÜELLOSU
// ======================================================
const duelPairs = [
  {
    focus: '💡 Temel Kural: Kip (zaman) ve şahıs eki alan kelime ÇEKİMLİ FİİLDİR. Yan cümle kuran kelime FİİLİMSİDİR.',
    cards: [
      {
        sentence: 'Ali <span class="suffix-highlight">koştu</span>.',
        targetWord: 'KOŞTU',
        correctAnswer: 'FİİL',
        options: ['FİİL', 'FİİLİMSİ'],
        explanation: '“-tu” geçmiş zaman kip ekidir. Cümlenin yüklemidir (Çekimli Fiil).'
      },
      {
        sentence: 'Ali <span class="suffix-highlight">koşarak</span> eve gitti.',
        targetWord: 'KOŞARAK',
        correctAnswer: 'FİİLİMSİ',
        options: ['FİİL', 'FİİLİMSİ'],
        explanation: '“-arak” zarf-fiil ekidir. Zaman eki almamış, fiilin nasıl yapıldığını belirten bir FİİLİMSİDİR.'
      }
    ]
  },
  {
    focus: '⚠️ LGS Tuzağı 1: “-acak / -miş / -ar / -mez” ekleri YÜKLEMDE ise Kip Eki (Fiil), İSMİN ÖNÜNDE ise Sıfat-Fiildir!',
    cards: [
      {
        sentence: 'Amcamlar yarın akşam bize <span class="suffix-highlight">gelecek</span>.',
        targetWord: 'GELECEK',
        correctAnswer: 'FİİL',
        options: ['FİİL', 'FİİLİMSİ'],
        explanation: 'Buradaki “-ecek” gelecek zaman kip ekidir ve cümlenin yüklemidir (Çekimli Fiil).'
      },
      {
        sentence: '<span class="suffix-highlight">Gelecek</span> hafta sınavlarımız başlıyor.',
        targetWord: 'GELECEK (hafta)',
        correctAnswer: 'FİİLİMSİ',
        options: ['FİİL', 'FİİLİMSİ'],
        explanation: 'Hangi hafta? Gelecek hafta! İsmi nitelediği için “-ecek” burada SIFAT-FİİL ekidir!'
      }
    ]
  },
  {
    focus: '🍦 LGS Tuzağı 2 (Kalıcı İsim vs. Fiilimsi): Fiilimsi ekiyle türeyip bir nesnenin kalıcı adı olanlar (-ma/-me olumsuzu yapılamayanlar) FİİLİMSİ DEĞİLDİR!',
    cards: [
      {
        sentence: 'Yaz sıcaklarında <span class="suffix-highlight">dondurma</span> yemek çok güzeldir.',
        targetWord: 'DONDURMA',
        correctAnswer: 'KALICI İSİM',
        options: ['KALICI İSİM', 'FİİLİMSİ'],
        explanation: 'Buradaki “dondurma” yenilen tatlı bir besinin adıdır (olumsuzu “dondurmama” yapılamaz). KALICI İSİMDİR!'
      },
      {
        sentence: 'Sebzeleri kış için <span class="suffix-highlight">dondurma</span> işlemi tamamlandı.',
        targetWord: 'DONDURMA (işlemi)',
        correctAnswer: 'FİİLİMSİ',
        options: ['KALICI İSİM', 'FİİLİMSİ'],
        explanation: 'Burada dondurmak eyleminden bahsediliyor (dondurmama işlemi diyebiliriz). İSİM-FİİLDİR!'
      }
    ]
  },
  {
    focus: '🔥 LGS Tuzağı 3: “Çakmak, danışma, dolma, sarma, uçurtma” kelimelerine cümle bağlamında dikkat!',
    cards: [
      {
        sentence: 'Girişteki <span class="suffix-highlight">danışma</span> görevlisine adres sorduk.',
        targetWord: 'DANIŞMA',
        correctAnswer: 'KALICI İSİM',
        options: ['KALICI İSİM', 'FİİLİMSİ'],
        explanation: 'Bir bölüm/birim adı haline geldiği için KALICI İSİMDİR, fiilimsi özelliğini kaybetmiştir.'
      },
      {
        sentence: 'Büyüklerine <span class="suffix-highlight">danışma</span> alışkanlığı çok değerlidir.',
        targetWord: 'DANIŞMA (alışkanlığı)',
        correctAnswer: 'FİİLİMSİ',
        options: ['KALICI İSİM', 'FİİLİMSİ'],
        explanation: 'Danışmak eyleminin adını koruduğu için İSİM-FİİLDİR (Fiilimsi).'
      }
    ]
  },
  {
    focus: '⚡ Geniş Zaman (-ar/-er) ile Sıfat-Fiil (-ar/-er) Karşılaştırması:',
    cards: [
      {
        sentence: 'Dedem her sabah sahilde <span class="suffix-highlight">koşar</span>.',
        targetWord: 'KOŞAR',
        correctAnswer: 'FİİL',
        options: ['FİİL', 'FİİLİMSİ'],
        explanation: 'Cümlenin yüklemidir, geniş zaman kipi almış ÇEKİMLİ FİİLDİR.'
      },
      {
        sentence: 'Çocuk <span class="suffix-highlight">koşar</span> adımlarla yanımıza yaklaştı.',
        targetWord: 'KOŞAR (adım)',
        correctAnswer: 'FİİLİMSİ',
        options: ['FİİL', 'FİİLİMSİ'],
        explanation: '“Nasıl adımlar? Koşar adımlar.” Adım ismini nitelediği için SIFAT-FİİLDİR!'
      }
    ]
  },
  {
    focus: '🛑 Olumsuzluk Eki (-ma/-me) ile İsim-Fiil Eki (-ma/-me) Karşılaştırması:',
    cards: [
      {
        sentence: 'Sakın kalemi masanın üstüne <span class="suffix-highlight">bırakma</span>!',
        targetWord: 'BIRAKMA!',
        correctAnswer: 'FİİL',
        options: ['FİİL', 'FİİLİMSİ'],
        explanation: 'Emir kipinin olumsuzudur! İşin yapılmamasını emreden ÇEKİMLİ FİİLDİR.'
      },
      {
        sentence: 'Eşyaları ortada <span class="suffix-highlight">bırakma</span> huyundan vazgeçti.',
        targetWord: 'BIRAKMA (huyu)',
        correctAnswer: 'FİİLİMSİ',
        options: ['FİİL', 'FİİLİMSİ'],
        explanation: 'Olumsuzluk anlamı yoktur, eylemin adıdır → İSİM-FİİL (Fiilimsi).'
      }
    ]
  }
];

let currentDuelIdx = 0;

function renderDuel() {
  const pair = duelPairs[currentDuelIdx];
  document.getElementById('duel-index-badge').textContent = `Karşılaştırma ${currentDuelIdx + 1} / ${duelPairs.length}`;
  document.getElementById('duel-focus-banner').innerHTML = pair.focus;
  hideFeedback('duel-feedback');

  const container = document.getElementById('duel-cards-container');
  container.innerHTML = '';

  pair.cards.forEach((c, idx) => {
    const card = document.createElement('div');
    card.className = 'duel-card';
    card.innerHTML = `
      <div>
        <span class="badge-time" style="margin-bottom:10px; display:inline-block;">Hedef Kelime: ${c.targetWord}</span>
        <div class="sentence-large" style="margin-top:8px;">“${c.sentence}”</div>
      </div>
      <div class="duel-choices" id="duel-choices-${idx}">
        ${c.options.map(opt => `
          <button class="duel-choice-btn" onclick="checkDuelAnswer(${idx}, '${opt}', this)">
            ${opt === 'FİİLİMSİ' ? '✨ FİİLİMSİ' : opt === 'FİİL' ? '📕 ÇEKİMLİ FİİL' : '🏷️ KALICI İSİM'}
          </button>
        `).join('')}
      </div>
      <div id="duel-exp-${idx}" style="display:none; padding:12px; border-radius:12px; font-weight:700; font-size:1.05rem;"></div>
    `;
    container.appendChild(card);
  });
}

function checkDuelAnswer(cardIdx, chosen, btnEl) {
  const cardData = duelPairs[currentDuelIdx].cards[cardIdx];
  const expEl = document.getElementById(`duel-exp-${cardIdx}`);
  expEl.style.display = 'block';

  if (chosen === cardData.correctAnswer) {
    playSound('correct');
    btnEl.style.background = '#22c55e';
    btnEl.style.borderColor = '#86efac';
    expEl.style.background = 'rgba(34,197,94,0.2)';
    expEl.style.color = '#bbf7d0';
    expEl.innerHTML = `✅ <strong>DOĞRU (${chosen}):</strong> ${cardData.explanation}`;
  } else {
    playSound('wrong');
    btnEl.style.background = '#ef4444';
    expEl.style.background = 'rgba(239,68,68,0.2)';
    expEl.style.color = '#fecaca';
    expEl.innerHTML = `🔄 <strong>DİKKAT:</strong> Doğru cevap <strong>${cardData.correctAnswer}</strong>. ${cardData.explanation}`;
  }
}

function nextDuel() {
  playSound('click');
  currentDuelIdx = (currentDuelIdx + 1) % duelPairs.length;
  renderDuel();
}

function prevDuel() {
  playSound('click');
  currentDuelIdx = (currentDuelIdx - 1 + duelPairs.length) % duelPairs.length;
  renderDuel();
}

// ======================================================
// BÖLÜM 7: FİNAL – “FİİLİMSİ MİLYONERİ”
// ======================================================
const millionaireQuestions = [
  {
    points: 100,
    question: '1. Soru (100 Puan): “Gülmek” kelimesi hangi fiilimsi türüne örnektir?',
    options: ['İsim-fiil', 'Sıfat-fiil', 'Zarf-fiil', 'Çekimli fiil'],
    correct: 0,
    hint: 'MA - Y - IŞ - MAK eklerini hatırla!',
    explanation: '“gül-mek” kelimesi -mek ekini aldığı için İsim-fiildir.'
  },
  {
    points: 200,
    question: '2. Soru (200 Puan): “Koşan çocuk eve gitti.” cümlesindeki fiilimsi hangisidir?',
    options: ['koşan', 'çocuk', 'eve', 'gitti'],
    correct: 0,
    hint: '“Çocuk” ismini niteleyen kelimeye bak!',
    explanation: '“koşan” kelimesi -an sıfat-fiil ekini alarak çocuk ismini nitelemiştir.'
  },
  {
    points: 300,
    question: '3. Soru (300 Puan): “Eve gelince seni arayacağım.” cümlesindeki fiilimsinin türü nedir?',
    options: ['İsim-fiil (gelince)', 'Sıfat-fiil (arayacağım)', 'Zarf-fiil (gelince)', 'Zarf-fiil (seni)'],
    correct: 2,
    hint: '“Ne zaman arayacağım? Eve gelince.” Zaman bildiren fiilimsi hangisidir?',
    explanation: '“gel-ince” zaman bildiren bir Zarf-fiildir (Bağ-fiil).'
  },
  {
    points: 500,
    question: '4. Soru (500 Puan): “Kitap okumayı seven öğrenciler yarışmaya katıldı.” cümlesinde kaç fiilimsi vardır?',
    options: ['1 (yalnızca okumayı)', '2 (okumayı ve seven)', '3 (okumayı, seven, yarışmaya)', '4 (okumayı, seven, yarışmaya, katıldı)'],
    correct: 1,
    hint: 'Bir isim-fiil (-ma) ve bir sıfat-fiil (-en) var!',
    explanation: '1) okumayı → İsim-fiil, 2) seven → Sıfat-fiil. Toplam 2 fiilimsi vardır.'
  },
  {
    points: 750,
    question: '5. Soru (750 Puan): Aşağıdaki cümlelerin hangisinde “-ma / -me” eki alan kelime FİİLİMSİ DEĞİLDİR (Kalıcı isimdir)?',
    options: [
      'Şiir okuma yarışmasında birinci oldu.',
      'Akşam yemeğinde yaprak sarma yedik.',
      'Beni dinleme zahmetinde bile bulunmadı.',
      'Resim yapmayı çocukluğundan beri sever.'
    ],
    correct: 1,
    hint: 'Yemek adı haline gelmiş kelimeyi bul!',
    explanation: '“Yaprak sarma” bir yemeğin kalıcı adı olmuştur, fiilimsi özelliğini kaybetmiştir.'
  },
  {
    points: 1000,
    question: '🏆 6. Soru (1000 PUAN FİNAL): “Çalışıp çabalayanlar sonunda başarıya ulaşmayı bilir.” cümlesinde sırasıyla hangi fiilimsiler vardır?',
    options: [
      'Zarf-fiil • Sıfat-fiil • İsim-fiil',
      'İsim-fiil • Zarf-fiil • Sıfat-fiil',
      'Sıfat-fiil • Sıfat-fiil • Zarf-fiil',
      'Zarf-fiil • İsim-fiil • Çekimli fiil'
    ],
    correct: 0,
    hint: 'çalış-ıp (-ıp), çabala-yan-lar (-an), ulaş-ma-yı (-ma)!',
    explanation: 'çalışıp (Zarf-fiil), çabalayanlar (Adlaşmış Sıfat-fiil), ulaşmayı (İsim-fiil). Üç tür bir arada!'
  }
];

let milCurrentIdx = 0;
let milEarnedPoints = 0;
let jokersUsed = { j50: false, jClass: false, jHint: false };

function restartMillionaire() {
  playSound('click');
  milCurrentIdx = 0;
  milEarnedPoints = 0;
  jokersUsed = { j50: false, jClass: false, jHint: false };
  document.getElementById('joker-50').disabled = false;
  document.getElementById('joker-class').disabled = false;
  document.getElementById('joker-hint').disabled = false;
  document.getElementById('joker-50').style.opacity = '1';
  document.getElementById('joker-class').style.opacity = '1';
  document.getElementById('joker-hint').style.opacity = '1';
  renderMillionaireQuestion();
}

function renderMillionaireQuestion() {
  const q = millionaireQuestions[milCurrentIdx];
  document.getElementById('mil-q-level').textContent = `${milCurrentIdx + 1}. SORU • ${q.points} PUAN`;
  document.getElementById('mil-total-earned').textContent = `Kazanılan: ${milEarnedPoints} Puan`;
  document.getElementById('mil-question-text').textContent = q.question;
  document.getElementById('mil-next-btn').style.display = 'none';
  hideFeedback('mil-feedback');

  // Merdiveni çiz
  const ladderEl = document.getElementById('mil-ladder');
  ladderEl.innerHTML = '';
  millionaireQuestions.forEach((stepQ, idx) => {
    const step = document.createElement('div');
    step.className = 'ladder-step' + (idx === milCurrentIdx ? ' current' : idx < milCurrentIdx ? ' passed' : '');
    step.innerHTML = `<span>${idx + 1}. Basamak</span><span>${stepQ.points} Puan</span>`;
    ladderEl.appendChild(step);
  });

  // Şıkları çiz
  const optsGrid = document.getElementById('mil-options-grid');
  optsGrid.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];
  q.options.forEach((opt, idx) => {
    const btn = document.createElement('button');
    btn.className = 'mil-opt-btn';
    btn.id = `mil-opt-${idx}`;
    btn.innerHTML = `<span class="letter">${letters[idx]}</span> <span>${opt}</span>`;
    btn.onclick = () => selectMillionaireOption(idx, btn);
    optsGrid.appendChild(btn);
  });
}

function selectMillionaireOption(idx, btnEl) {
  const q = millionaireQuestions[milCurrentIdx];
  document.querySelectorAll('.mil-opt-btn').forEach(b => b.disabled = true);

  if (idx === q.correct) {
    playSound('fanfare');
    btnEl.classList.add('correct');
    milEarnedPoints = q.points;
    document.getElementById('mil-total-earned').textContent = `Kazanılan: ${milEarnedPoints} Puan`;

    if (milCurrentIdx === millionaireQuestions.length - 1) {
      showFeedback('mil-feedback', 'success', `👑 TEBRİKLER! 1000 PUANLIK FİİLİMSİ MİLYONERİ ZİRVESİNE ULAŞTINIZ! (${q.explanation})`);
    } else {
      showFeedback('mil-feedback', 'success', `✅ DOĞRU CEVAP! ${q.points} Puana ulaştın! (${q.explanation})`);
      document.getElementById('mil-next-btn').style.display = 'inline-flex';
    }
  } else {
    playSound('wrong');
    btnEl.classList.add('wrong');
    document.getElementById(`mil-opt-${q.correct}`).classList.add('correct');
    showFeedback('mil-feedback', 'error', `❌ Yanlış Cevap! Doğru seçenek: ${q.options[q.correct]}. (${q.explanation})`);
  }
}

function nextMillionaireQuestion() {
  playSound('click');
  if (milCurrentIdx < millionaireQuestions.length - 1) {
    milCurrentIdx++;
    renderMillionaireQuestion();
  }
}

function useJoker50() {
  if (jokersUsed.j50) return;
  playSound('click');
  jokersUsed.j50 = true;
  document.getElementById('joker-50').disabled = true;
  document.getElementById('joker-50').style.opacity = '0.4';

  const q = millionaireQuestions[milCurrentIdx];
  const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.correct).sort(() => Math.random() - 0.5).slice(0, 2);
  wrongIndices.forEach(i => {
    const el = document.getElementById(`mil-opt-${i}`);
    if (el) el.classList.add('hidden-50');
  });
}

function useJokerClass() {
  if (jokersUsed.jClass) return;
  playSound('correct');
  jokersUsed.jClass = true;
  document.getElementById('joker-class').disabled = true;
  document.getElementById('joker-class').style.opacity = '0.4';

  const q = millionaireQuestions[milCurrentIdx];
  const letters = ['A', 'B', 'C', 'D'];
  showFeedback('mil-feedback', 'success', `🙋 SINIFA SOR JOKERİ: Sınıfın %78'i "${letters[q.correct]}) ${q.options[q.correct]}" seçeneğine parmak kaldırıyor!`);
}

function useJokerHint() {
  if (jokersUsed.jHint) return;
  playSound('click');
  jokersUsed.jHint = true;
  document.getElementById('joker-hint').disabled = true;
  document.getElementById('joker-hint').style.opacity = '0.4';

  const q = millionaireQuestions[milCurrentIdx];
  showFeedback('mil-feedback', 'success', `💡 DEDEKTİF İPUCU: ${q.hint}`);
}

// ======================================================
// BÖLÜM 8 & 9: “FİİLİMSİ 5” & 3B DİJİTAL KARTLAR
// ======================================================
const fiilimsi5Pool = [
  {
    sentence: '“Kitap okumayı seven öğrenciler sınavda başarılı oldu.”',
    s1: 'okumayı / seven',
    s2: 'okumayı → İsim-fiil | seven → Sıfat-fiil',
    s3: 'oku-ma (-ma eki) | sev-en (-en eki)',
    s4: 'Yan cümlede nesne ve öğrenci ismini niteleyen sıfat görevinde',
    s5: 'Öğrenciden aynı eklerle (-ma veya -en) yeni bir cümle kurmasını isteyin ve alkışlayın! 👏'
  },
  {
    sentence: '“Zil çalınca koşarak bahçeye çıktılar.”',
    s1: 'çalınca / koşarak',
    s2: 'İkisi de ZARF-FİİL (Bağ-fiil)',
    s3: 'çal-ınca (-ınca eki) | koş-arak (-arak eki)',
    s4: 'Çıktılar fiilinin ZAMANINI (çalınca) ve DURUMUNU (koşarak) belirtiyor',
    s5: 'Öğrenciden -ınca veya -arak ekiyle kendi cümlesini kurmasını isteyin! 👏'
  },
  {
    sentence: '“Tanıdık yüzler görmek hepimizi mutlu etti.”',
    s1: 'Tanıdık / görmek',
    s2: 'Tanıdık → Sıfat-fiil | görmek → İsim-fiil',
    s3: 'tanı-dık (-dık eki) | gör-mek (-mek eki)',
    s4: '“yüzler” ismini niteleyen sıfat ve cümlenin öznesi görevindeki isim-fiil',
    s5: 'Öğrenciden -dık veya -mek ekiyle yeni bir cümle kurmasını isteyin! 👏'
  }
];

let f5Index = 0;

function renderFiilimsi5() {
  const item = fiilimsi5Pool[f5Index];
  document.getElementById('f5-sentence').textContent = item.sentence;

  const steps = [
    { num: 1, title: '1. Bir Fiilimsi Bul', ans: item.s1 },
    { num: 2, title: '2. Türünü Söyle', ans: item.s2 },
    { num: 3, title: '3. Ekini Söyle', ans: item.s3 },
    { num: 4, title: '4. Cümledeki Görevini Söyle', ans: item.s4 },
    { num: 5, title: '5. Sen Bir Örnek Oluştur!', ans: item.s5 }
  ];

  const grid = document.getElementById('f5-steps-grid');
  grid.innerHTML = '';

  steps.forEach((st) => {
    const card = document.createElement('div');
    card.className = 'discovery-box';
    card.style.padding = '18px';
    card.innerHTML = `
      <div style="font-size:1.25rem; font-weight:800; color:#a5b4fc;">${st.title}</div>
      <div class="role-reveal" style="background:rgba(34,197,94,0.18); border:2px solid #22c55e; color:#fff;">
        ${st.ans}
      </div>
      <button class="btn-secondary" style="justify-content:center;" onclick="this.parentElement.classList.toggle('revealed'); playSound('correct');">
        👁️ Cevabı Aç / Kontrol Et
      </button>
    `;
    grid.appendChild(card);
  });
}

function nextFiilimsi5Sentence() {
  playSound('click');
  f5Index = (f5Index + 1) % fiilimsi5Pool.length;
  renderFiilimsi5();
}

function showSubTab(tab) {
  playSound('click');
  document.getElementById('subtab-fiilimsi5').style.display = tab === 'fiilimsi5' ? 'block' : 'none';
  document.getElementById('subtab-flashcards').style.display = tab === 'flashcards' ? 'flex' : 'none';
}

// --- 3B DİJİTAL FLASHCARDS ---
const flashcardsData = [
  {
    sentence: '“Kitap okumayı seviyorum.”',
    question: 'Fiilimsi hangisi ve türü nedir?',
    answer: 'Okumayı → İSİM-FİİL',
    detail: 'Kök: oku- | Ek: -ma (MA-Y-IŞ-MAK). Cümlede nesne görevindedir.'
  },
  {
    sentence: '“Gülerek sınıfa girdi.”',
    question: 'Fiilimsi hangisi ve türü nedir?',
    answer: 'Gülerek → ZARF-FİİL',
    detail: 'Kök: gül- | Ek: -erek. “Nasıl girdi?” sorusuna yanıt veren durum zarf-fiilidir.'
  },
  {
    sentence: '“Koşan çocuk düştü.”',
    question: 'Fiilimsi hangisi ve türü nedir?',
    answer: 'Koşan → SIFAT-FİİL',
    detail: 'Kök: koş- | Ek: -an (AN-ASI-MEZ...). “Çocuk” ismini nitelemiştir.'
  },
  {
    sentence: '“Gelen gideni aratır.”',
    question: 'Bu atasözünde kaç fiilimsi vardır?',
    answer: '2 Adlaşmış Sıfat-Fiil (Gelen, gideni)',
    detail: 'Gelen (insan) ve giden (insanı) → Önündeki isim düşmüş adlaşmış sıfat-fiillerdir.'
  },
  {
    sentence: '“Elindeki çakmak yere düştü.”',
    question: '“Çakmak” kelimesi fiilimsi midir?',
    answer: 'HAYIR! Kalıcı İsimdir.',
    detail: 'Fiilimsi ekiyle (-mak) türemiş olsa da bir aracın kalıcı adı olmuştur (-ma/-me ile olumsuz yapılamaz).'
  },
  {
    sentence: '“Sen gideli buralar çok sessizleşti.”',
    question: 'Fiilimsi hangisidir ve türü nedir?',
    answer: 'gideli → ZARF-FİİL',
    detail: 'git- + -eli → Cümleye zaman anlamı katan zarf-fiildir.'
  },
  {
    sentence: '“Anlaşılmaz bir dil kullanıyordu.”',
    question: '“Anlaşılmaz” kelimesi çekimli fiil mi, sıfat-fiil mi?',
    answer: 'SIFAT-FİİL (-maz / -mez)',
    detail: '“Nasıl bir dil? Anlaşılmaz bir dil.” İsmin önünde sıfat görevinde kullanılmıştır.'
  },
  {
    sentence: '“Balık tutmak büyük bir sabır işidir.”',
    question: 'Fiilimsi hangisi ve türü nedir?',
    answer: 'tutmak → İSİM-FİİL',
    detail: 'tut- + -mak → Eylemin adı olmuştur.'
  }
];

let currentFcIdx = 0;

function renderFlashcard() {
  const scene = document.getElementById('flashcard-scene');
  scene.classList.remove('flipped');
  const fc = flashcardsData[currentFcIdx];
  document.getElementById('fc-index').textContent = `${currentFcIdx + 1} / ${flashcardsData.length}`;
  document.getElementById('fc-front-sentence').textContent = fc.sentence;
  document.getElementById('fc-front-question').textContent = fc.question;
  document.getElementById('fc-back-answer').textContent = fc.answer;
  document.getElementById('fc-back-detail').textContent = fc.detail;
}

function flipFlashcard() {
  playSound('click');
  document.getElementById('flashcard-scene').classList.toggle('flipped');
}

function nextFlashcard() {
  playSound('click');
  currentFcIdx = (currentFcIdx + 1) % flashcardsData.length;
  renderFlashcard();
}

function prevFlashcard() {
  playSound('click');
  currentFcIdx = (currentFcIdx - 1 + flashcardsData.length) % flashcardsData.length;
  renderFlashcard();
}

// --- YARDIMCI GERİ BİLDİRİM FONKSİYONLARI ---
function showFeedback(elId, type, htmlText) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = `feedback-banner show ${type}`;
  el.innerHTML = htmlText;
}

function hideFeedback(elId) {
  const el = document.getElementById(elId);
  if (!el) return;
  el.className = 'feedback-banner';
  el.innerHTML = '';
}

// ======================================================
// BÖLÜM 9: ÇIKMIŞ FİİLİMSİ SORULARI (LGS / TEOG / BURSLULUK - 25 SORU)
// Cevap Anahtarı: 1C 2B 3C 4A 5D 6B 7B 8D 9A 10B 11D 12C 13A 14C 15C 16D 17B 18A 19B 20C 21C 22B 23A 24D 25C
// ======================================================
const pastExamQuestions = [
  {
    no: 1,
    exam: 'LGS - 2020',
    passage: `
      <div style="background:rgba(245,158,11,0.12); border-left:4px solid #f59e0b; padding:10px 14px; margin-bottom:12px; font-size:1.15rem;">
        <strong>Öncül Bilgi:</strong> Cümlede durum veya zaman bildiren fiilimsiler zarf-fiildir.<br/>
        • Murat Nehri <u>donunca</u> gençler, üzerinde top oynuyormuş. <em>(zaman bildiren zarf-fiil)</em><br/>
        • Gözlerini kitaptan <u>ayırmadan</u> sorduğum soruya cevap verdi. <em>(durum bildiren zarf-fiil)</em>
      </div>
      <strong>(I)</strong> Yaz aylarında tamamen kuruyan Kara Muğla Deresi’nin yatağını takip ederek Saburhane Meydanı’na ilerliyorum. 
      <strong>(II)</strong> Saburhane’nin sürprizli sokaklarına doğru yol alırken yüzleri ısıtan neşeli ilkbahar güneşinin ağaçlara can verdiğini hissetmek zor olmuyor. 
      <strong>(III)</strong> Kim bilir üst üste kaç kat kireç atılmış bembeyaz boyalı evleri keşfetmek için sokak aralarına dalıyorum. 
      <strong>(IV)</strong> Evlerin ahşap bölümleri, Saburhaneli kadınların titizliğiyle siline siline özgün ve büyülü bir sanat eserine dönüşmüş sanki.
    `,
    stem: '1. Bu parçada numaralanmış cümlelerin hangisinde zarf-fiil yoktur?',
    options: ['I', 'II', 'III', 'IV'],
    correct: 2, // C
    explanation: '<strong>Cevap C (III):</strong> (I). cümlede <em>“takip ederek” (-erek)</em>, (II). cümlede <em>“yol alırken” (-ken)</em>, (IV). cümlede <em>“siline siline” (-e...-e)</em> zarf-fiildir. <strong>(III). cümlede</strong> ise <em>“atılmış”</em> (sıfat-fiil) ve <em>“keşfetmek”</em> (isim-fiil) vardır, <strong>zarf-fiil yoktur</strong>.'
  },
  {
    no: 2,
    exam: 'LGS - 2019',
    passage: `
      “Dedesinin elini öptü.” cümlesinde <strong>“öptü”</strong> sözcüğü çekimli fiildir ve cümlenin yüklemidir. 
      “Dedesinin öpülesi ellerini hatırladı.” cümlesinde ise <strong>“öpülesi”</strong> sözcüğü fiil anlamını korumakla birlikte kendisinden sonra gelen ismi nitelediği için <strong>sıfat-fiildir</strong>.
    `,
    stem: '2. Buna göre aşağıdakilerin hangisinde sıfat-fiil kullanılmıştır?',
    options: [
      'Meyvesiz ağaca kimse taş atmaz.',
      'Menfaatleri için küçülmeyen insan büyüktür.',
      'Hayat ancak yaşayarak tecrübe edilir.',
      'Öğrenmenin sınırlarını genellikle kendiniz koyarsınız.'
    ],
    correct: 1, // B
    explanation: '<strong>Cevap B:</strong> <em>“küçülmeyen (insan)”</em> sözcüğü <strong>-en</strong> sıfat-fiil ekini alarak kendisinden sonraki <em>insan</em> ismini nitelemiştir. (A’da <em>atmaz</em> geniş zamanlı çekimli fiil, C’de <em>yaşayarak</em> zarf-fiil, D’de <em>öğrenmenin</em> isim-fiildir).'
  },
  {
    no: 3,
    exam: 'LGS - 2018',
    passage: `
      (...) Eğitim Uzmanı Bilge Buhan Musa, geri dönüşüm üzerine <u class="suffix-highlight">çıkardığı</u> <strong>(I)</strong> dört yeni hikâye kitabıyla çocuklara çevre bilinci kazandırmayı hedefliyor. (...) verdiği yöntemlerle <u class="suffix-highlight">somutlaştırıp</u> <strong>(II)</strong> çocukların bunu davranışa kolayca dönüştürebileceklerini belirtiyor. (...) gezegenimize karşı sorumluluklarını yerine <u class="suffix-highlight">getirmelerine</u> <strong>(III)</strong> aracı oluyor. (...) eşyalardan geri dönüşüme <u class="suffix-highlight">gitmeden</u> <strong>(IV)</strong> ne şekilde faydalanabileceğimiz dile getiriliyor.
    `,
    stem: '3. Bu metindeki numaralanmış kelimelerden hangileri zarf-fiildir?',
    options: ['I ve II.', 'I ve III.', 'II ve IV.', 'III ve IV.'],
    correct: 2, // C
    explanation: '<strong>Cevap C (II ve IV):</strong> (I) <em>çıkardığı</em> → Sıfat-fiil (-dık), <strong>(II) somutlaştırıp → Zarf-fiil (-ıp)</strong>, (III) <em>getirmelerine</em> → İsim-fiil (-me), <strong>(IV) gitmeden → Zarf-fiil (-meden)</strong>.'
  },
  {
    no: 4,
    exam: '2016 Kasım TEOG',
    passage: `
      <strong>(I)</strong> Yatağımdan doğruldum ve çatlamış dudaklarımı dilimle ıslattım. 
      <strong>(II)</strong> Masadan, içi yarısına kadar dolu bardağı alıp üç dört yudum su içtim. 
      <strong>(III)</strong> Pencereden sızan gün ışığı içimi mutlulukla doldurdu. 
      <strong>(IV)</strong> Dudaklarımdaki gülümseme tüm yüzüme yayıldı.
    `,
    stem: '4. Bu metinde numaralanmış cümlelerin hangilerinde aynı tür fiilimsi kullanılmıştır?',
    options: ['I ve III.', 'I ve IV.', 'II ve III.', 'II ve IV.'],
    correct: 0, // A
    explanation: '<strong>Cevap A (I ve III):</strong> (I). cümlede <em>“çatlamış (dudaklarımı)”</em> → <strong>Sıfat-fiil (-mış)</strong> ve (III). cümlede <em>“sızan (gün ışığı)”</em> → <strong>Sıfat-fiil (-an)</strong> kullanılmıştır. (II’de <em>alıp</em> zarf-fiil, IV’te <em>gülümseme</em> isim-fiildir).'
  },
  {
    no: 5,
    exam: '2016 Aralık TEOG - Mazeret',
    passage: `
      Ne zaman <u class="suffix-highlight">gelsem</u> <strong>(I)</strong> kapıların <u class="suffix-highlight">açık</u> <strong>(II)</strong><br/>
      Bereketi sofranda / Ruhu doyuran o bereketli iksir / Bütün dertlere <u class="suffix-highlight">derman</u> <strong>(III)</strong><br/>
      Bir fısıltı gibi / İçimize <u class="suffix-highlight">üflenen</u> <strong>(IV)</strong> mana
    `,
    stem: '5. Bu dizelerde numaralanmış kelimelerden hangisi fiilimsidir?',
    options: ['I.', 'II.', 'III.', 'IV.'],
    correct: 3, // D
    explanation: '<strong>Cevap D (IV):</strong> <em>“üflenen (mana)”</em> sözcüğü <strong>-en</strong> sıfat-fiil ekini almış bir fiilimsidir. (<em>gelsem</em> şart kipiyle çekimli fiil, <em>açık</em> ve <em>derman</em> isimdir).'
  },
  {
    no: 6,
    exam: '2015 Kasım TEOG',
    passage: `
      <strong>(I)</strong> Bambular daha çok tropikal bölgelerde yaşayan çiçekli bitkilerdir. 
      <strong>(II)</strong> Bambuların bazı türleri çok hızlı büyür. 
      <strong>(III)</strong> Öyle ki günde bir metre kadar uzayanları vardır. 
      <strong>(IV)</strong> Bu bitkiler genellikle yıllarca büyüyüp geliştikten sonra çiçek açar.
    `,
    stem: '6. Bu metinde numaralanmış cümlelerin hangisinde fiilimsi kullanılmamıştır?',
    options: ['I.', 'II.', 'III.', 'IV.'],
    correct: 1, // B
    explanation: '<strong>Cevap B (II):</strong> (I)’de <em>yaşayan</em> (sıfat-fiil), (III)’te <em>uzayanları</em> (adlaşmış sıfat-fiil), (IV)’te <em>büyüyüp</em> (zarf-fiil) ve <em>geliştikten</em> (sıfat-fiil) vardır. <strong>(II). cümlede</strong> yalnızca çekimli fiil (<em>büyür</em>) vardır, fiilimsi yoktur.'
  },
  {
    no: 7,
    exam: '2015 Kasım TEOG',
    passage: `
      “Sesin nerde kaldı, her günkü sesin<br/>
      <strong>Unutulmuş</strong> güzel şarkılar için”
    `,
    stem: '7. Bu dizelerdeki fiilimsinin türce özdeşi aşağıdakilerin hangisinde vardır?',
    options: [
      'Bir yer var, biliyorum / Her şeyi söylemek mümkün',
      'Yıllardır görmediğimiz kentin / Yürümüştük anısıyla eski cumbalı evlerin',
      'Niçin oyun biterken en sonra hatırlanır / Hatıralarımızın en tatlı oyunları',
      'Kaç gündür gözlerimi bile kırpmadan / Yağmur altında bir şehre bakıyorum'
    ],
    correct: 1, // B
    explanation: '<strong>Cevap B:</strong> Dizelerdeki <em>“Unutulmuş (güzel şarkılar)”</em> sözcüğü <strong>sıfat-fiildir (-muş)</strong>. B seçeneğindeki <em>“görmediğimiz (kentin)”</em> sözcüğü de <strong>-dik</strong> eki almış bir <strong>sıfat-fiildir</strong>. (A’da <em>söylemek</em> isim-fiil, C’de <em>biterken</em> ve D’de <em>kırpmadan</em> zarf-fiildir).'
  },
  {
    no: 8,
    exam: '2015 Aralık TEOG - Mazeret',
    passage: `
      “Serinlik etrafı <strong>kaplar kaplamaz</strong> parklar ve bahçeler çocuklarla doldu.”
    `,
    stem: '8. Aşağıdaki altı çizili kelimelerden hangisi bu cümledeki fiilimsiyle aynı türdedir?',
    options: [
      'Başka yoldan vapur iskelesine <u>gitmek</u> için yolu çok uzun buldum.',
      'Nevin kendi kendini <u>sorgulamaya</u> başlar bu olaydan sonra.',
      'Öykünün sonunda <u>gelişen</u> olayları yeniden işledim.',
      'Köyünde cumartesi ile pazarı tarlada <u>çalışarak</u> geçiriyordu.'
    ],
    correct: 3, // D
    explanation: '<strong>Cevap D:</strong> Öncüldeki <em>“kaplar kaplamaz” (-r ... -maz)</em> zaman bildiren bir <strong>zarf-fiildir</strong>. D seçeneğindeki <em>“<u>çalışarak</u>” (-arak)</em> sözcüğü de <strong>zarf-fiildir</strong>.'
  },
  {
    no: 9,
    exam: '2015 Aralık TEOG - Mazeret',
    passage: `
      Elimi çok dallı bir ağaç gibi<br/>
      <u class="suffix-highlight">Tutarım</u> <strong>(I)</strong> gökyüzüne<br/>
      Bir deve gürültüler içinde <u class="suffix-highlight">koşarken</u> <strong>(II)</strong><br/>
      Güneş <u class="suffix-highlight">doğmadan</u> <strong>(III)</strong> evvel <u class="suffix-highlight">varmak</u> <strong>(IV)</strong> için Ufka...
    `,
    stem: '9. Bu dizelerde numaralanmış kelimelerden hangisi fiilimsi değildir?',
    options: ['I.', 'II.', 'III.', 'IV.'],
    correct: 0, // A
    explanation: '<strong>Cevap A (I):</strong> <em>“Tutarım”</em> sözcüğü geniş zaman kipi (-ar) ve 1. tekil şahıs eki (-ım) almış <strong>çekimli bir fiildir</strong>. (II <em>koşarken</em> ve III <em>doğmadan</em> zarf-fiil, IV <em>varmak</em> isim-fiildir).'
  },
  {
    no: 10,
    exam: '2014 Kasım TEOG',
    passage: `
      Kitapta, beş <u class="suffix-highlight">duyumuzla</u> <strong>(1)</strong> tanıyıp hoşlandığımız şeylerden, verimli <u class="suffix-highlight">çalışmanın</u> <strong>(2)</strong> doyulmaz sevincinden ve birbirimize duyduğumuz <u class="suffix-highlight">sevgiden</u> <strong>(3)</strong> söz eden şiirler <u class="suffix-highlight">bulunuyor</u> <strong>(4)</strong>.
    `,
    stem: '10. Bu cümlede numaralandırılmış kelimelerden hangisi fiilimsidir?',
    options: ['1', '2', '3', '4'],
    correct: 1, // B
    explanation: '<strong>Cevap B (2):</strong> 2 numaralı <em>“çalışmanın” (çalış-ma-nın)</em> sözcüğü <strong>-ma isim-fiil</strong> eki almış bir fiilimsidir. (1 ve 3 kalıcı/türemiş isim, 4 <em>bulunuyor</em> ise çekimli fiildir).'
  },
  {
    no: 11,
    exam: '2014 Kasım TEOG',
    passage: `
      “Bütün gece yağan karın <u class="suffix-highlight">kapadığı</u> yollar nihayet açıldı.”
    `,
    stem: '11. Bu cümledeki altı çizili kelimeyle aynı türde olan fiilimsi, aşağıdakilerin hangisinde yer almaktadır?',
    options: [
      'Habersiz gelişi hepimizi sevince boğdu.',
      'Eve gidince bu konuyu konuşuruz.',
      'Sorulara düşünerek cevap veriyordu.',
      'Yolda okunacak bir kitap istiyorum.'
    ],
    correct: 3, // D
    explanation: '<strong>Cevap D:</strong> Altı çizili <em>“kapadığı (yollar)”</em> <strong>-dık</strong> eki almış bir <strong>sıfat-fiildir</strong>. D seçeneğindeki <em>“okunacak (bir kitap)”</em> sözcüğü de <strong>-acak</strong> eki almış bir <strong>sıfat-fiildir</strong>.'
  },
  {
    no: 12,
    exam: '2014 Aralık - Mazeret TEOG',
    passage: `İsim-fiiller fiil kök veya gövdelerine <strong>-ma, -ış, -mak</strong> ekleri getirilerek yapılır.`,
    stem: '12. Aşağıdakilerin hangisinde isim-fiil kullanılmamıştır?',
    options: [
      'Asil duruşu daima gözümün önündedir.',
      'Adadan dönmemize bir saat kalmıştı.',
      'Bu, birçok kişinin emek verdiği bir kitaptır.',
      'İlkbaharı düşünmek her zaman içimi ısıtıyor.'
    ],
    correct: 2, // C
    explanation: '<strong>Cevap C:</strong> A’da <em>duruşu (-uş)</em>, B’de <em>dönmemize (-me)</em>, D’de <em>düşünmek (-mek)</em> isim-fiildir. C seçeneğinde ise yalnızca <em>“verdiği”</em> (<strong>sıfat-fiil</strong>) vardır, isim-fiil yoktur.'
  },
  {
    no: 13,
    exam: '2014 Aralık TEOG - Mazeret',
    passage: `
      Pencereleri geniş, doyasıya güneş <u class="suffix-highlight">alan</u> <strong>(1)</strong> bir salondaydık. Güneşin tadını <u class="suffix-highlight">çıkarıyorduk</u> <strong>(2)</strong> bu soğuk kış gününde. <u class="suffix-highlight">Günlüğümü</u> <strong>(3)</strong> yazmaya burada başladım.
    `,
    stem: '13. Bu metindeki altı çizili sözcüklerle ilgili aşağıdakilerin hangisinde verilenler doğrudur?',
    options: [
      '1: fiilimsi  |  2: fiil  |  3: isim',
      '1: fiil  |  2: fiilimsi  |  3: isim',
      '1: fiilimsi  |  2: fiilimsi  |  3: fiilimsi',
      '1: fiil  |  2: isim  |  3: fiilimsi'
    ],
    correct: 0, // A
    explanation: '<strong>Cevap A:</strong> (1) <em>alan</em> → sıfat-fiil (<strong>fiilimsi</strong>), (2) <em>çıkarıyorduk</em> → şimdiki zamanın hikayesiyle çekimli <strong>fiil</strong>, (3) <em>Günlüğümü</em> → <strong>isim</strong>.'
  },
  {
    no: 14,
    exam: '2013 Kasım TEOG',
    passage: `
      <strong>Kural:</strong> Zarf-fiil görevinde kullanılan bir sözcük cümleye <strong>zaman anlamı</strong> da kazandırabilir.
    `,
    stem: '14. Bu kurala uygun bir kullanım aşağıdaki cümlelerin hangisinde vardır?',
    options: [
      'Koşa koşa evin yolunu tuttu.',
      'Ağaçların arasından geçip gitti.',
      'Arkadaşını görünce hızla yanına koştu.',
      'Usulca eğilerek karıncayı sudan çıkardı.'
    ],
    correct: 2, // C
    explanation: '<strong>Cevap C:</strong> <em>“Ne zaman hızla yanına koştu? Arkadaşını <strong>görünce</strong>.”</em> (-ünce zarf-fiili cümleye <strong>zaman</strong> anlamı katmıştır; A, B ve D durum anlamı taşır).'
  },
  {
    no: 15,
    exam: '2013 Kasım TEOG',
    passage: `
      <strong>1.</strong> İleri görüşlü olmak önemli bir farktır.<br/>
      <strong>2.</strong> Yaşlandıkça huyu değişti.<br/>
      <strong>3.</strong> O, kendine yakışan kıyafeti bilir.<br/>
      <strong>4.</strong> Topu tutup yukarı fırlattı.
    `,
    stem: '15. Numaralandırılmış cümlelerin hangisinde sıfat-fiil vardır?',
    options: ['1', '2', '3', '4'],
    correct: 2, // C
    explanation: '<strong>Cevap C (3):</strong> 3. cümledeki <em>“yakışan (kıyafeti)”</em> sözcüğü <strong>-an</strong> eki almış bir <strong>sıfat-fiildir</strong>. (1’de <em>olmak</em> isim-fiil, 2’de <em>yaşlandıkça</em> ve 4’te <em>tutup</em> zarf-fiildir).'
  },
  {
    no: 16,
    exam: '2013 Kasım TEOG',
    passage: `
      “Evreni <strong>gösterecek tek pencere</strong> kitaptır.”<br/>
      Bu cümlede sıfat-fiil, bir <strong>sıfat tamlaması</strong> oluşturmuştur.
    `,
    stem: '16. Aynı kullanım aşağıdakilerin hangisinde vardır?',
    options: [
      'Yağmurun gelişi bulutlardan belli olur.',
      'Kitaplar yaşadıkça geçmiş unutulmayacaktır.',
      'Konuşmasını öğreninceye kadar susmak güç değildir.',
      'Hiç umulmadık iyilikler vardır, yıldırım gibi.'
    ],
    correct: 3, // D
    explanation: '<strong>Cevap D:</strong> <em>“umulmadık iyilikler”</em> (-dık sıfat-fiil eki + <em>iyilikler</em> ismi) bir sıfat tamlaması oluşturmuştur. (B’deki <em>unutulmayacaktır</em> çekimli fiildir!).'
  },
  {
    no: 17,
    exam: '2013 Aralık - Mazeret TEOG',
    passage: `
      Denizdeki adalara harıl harıl <u class="suffix-highlight">yağan</u> <strong>(1)</strong> gün <u class="suffix-highlight">aydınlığı</u> <strong>(2)</strong>, insanların üzerine <u class="suffix-highlight">parlamakla</u> <strong>(3)</strong> seviniyordu. Orada bir hülya, bir rüya vardı. İnsanın her zaman <u class="suffix-highlight">özlediği</u> <strong>(4)</strong> bir hülya.
    `,
    stem: '17. Bu metindeki altı çizili sözcüklerden hangisi fiilimsi değildir?',
    options: ['1', '2', '3', '4'],
    correct: 1, // B
    explanation: '<strong>Cevap B (2):</strong> 2 numaralı <em>“aydınlığı”</em> sözcüğü isimdir, fiilimsi değildir. (1 <em>yağan</em> ve 4 <em>özlediği</em> sıfat-fiil, 3 <em>parlamakla</em> isim-fiildir).'
  },
  {
    no: 18,
    exam: '2013 Aralık - Mazeret TEOG',
    passage: `Zarf-fiiller fiilleri zaman veya durum bakımından tamamlayan fiilimsilerdir.`,
    stem: '18. Aşağıdaki cümlelerin hangisinde zarf-fiil kullanılmıştır?',
    options: [
      'Yazar, toplantımıza katılınca çok sevindik.',
      'Çalışan, üreten insanın yanında yer aldı.',
      'Halkın arasında yaşamış bir yazardır.',
      'Öykülerinde insana gösterdiği yakınlık eskimedi.'
    ],
    correct: 0, // A
    explanation: '<strong>Cevap A:</strong> <em>“katılınca” (-ınca)</em> zaman bildiren bir <strong>zarf-fiildir</strong>. (B, C ve D seçeneklerindeki fiilimsiler sıfat-fiildir).'
  },
  {
    no: 19,
    exam: '2013 Aralık - Mazeret TEOG',
    passage: `“-acak / -ecek” eki cümlenin yükleminde zaman bildirdiğinde çekimli fiil, ismi nitelediğinde sıfat-fiil olur.`,
    stem: '19. Aşağıdaki cümlelerin hangisinde “-acak/-ecek” eki alan sözcük, çekimli fiil görevinde kullanılmıştır?',
    options: [
      'Çok zormuş buralarda oturulacak ev bulmak.',
      'Haftaya bizi ziyarete gelecek o çok sevdiğimiz şair.',
      'Şaşkınlıktan söyleyecek söz bulamadık.',
      'Gelecek yıl hep birlikte tatile gideriz.'
    ],
    correct: 1, // B
    explanation: '<strong>Cevap B (Devrik Cümle Tuzağı!):</strong> B seçeneğini kurallı dizdiğimizde: <em>“O çok sevdiğimiz şair haftaya bizi ziyarete <strong>gelecek</strong>.”</em> Cümlenin yüklemidir ve gelecek zaman kipi almış <strong>çekimli fiildir</strong>! (A’da <em>oturulacak ev</em>, C’de <em>söyleyecek söz</em>, D’de <em>gelecek yıl</em> sıfat-fiildir).'
  },
  {
    no: 20,
    exam: '2013 Aralık - Mazeret TEOG',
    passage: `İsim-fiiller isimler gibi isim tamlamalarında tamlayan veya tamlanan olabilir.`,
    stem: '20. Aşağıdaki cümlelerin hangisinde isim-fiil, bir isim tamlaması oluşturmuştur?',
    options: [
      'Dikkat çekmek için çaba harcadı.',
      'Üçümüz de güle oynaya koşuyorduk.',
      'Şiiri okuyuş tarzı hepimizi duygulandırdı.',
      'Sabah saatlerinde gelen mektubu defalarca okuduk.'
    ],
    correct: 2, // C
    explanation: '<strong>Cevap C:</strong> <em>“okuyuş tarzı”</em> (Ne tarzı? Okuyuş tarzı → Belirtisiz isim tamlaması) ifadesinde <strong>okuyuş (-uş)</strong> isim-fiili isim tamlamasının tamlayanı olmuştur.'
  },
  {
    no: 21,
    exam: '2014 Nisan TEOG',
    passage: `
      Adını daha <u class="suffix-highlight">çocukluğumda</u> <strong>(1)</strong> duyduğum, yazıları o <u class="suffix-highlight">yıllardan</u> <strong>(2)</strong> bu yana bende büyük etkiler <u class="suffix-highlight">bırakmış</u> <strong>(3)</strong> bu adamı, şimdi yakından <u class="suffix-highlight">görüyorum</u> <strong>(4)</strong>.
    `,
    stem: '21. Bu cümledeki numaralandırılmış sözcüklerden hangisi fiilimsidir?',
    options: ['1', '2', '3', '4'],
    correct: 2, // C
    explanation: '<strong>Cevap C (3):</strong> 3 numaralı <em>“bırakmış (bu adamı)”</em> sözcüğü <strong>-mış sıfat-fiil</strong> eki alarak kendisinden sonraki <em>adam</em> ismini nitelemiştir.'
  },
  {
    no: 22,
    exam: '2019 Bursluluk Sınavı',
    passage: `
      Sonbahar <u class="suffix-highlight">geliyor</u> <strong>(1)</strong> serçe<br/>
      Yuvanı nerede yapacaksın? Ayva çiçek<br/>
      <u class="suffix-highlight">açmadan</u> <strong>(2)</strong> önce meyvelerin içi geçecek<br/>
      Rüzgâr başka çeşit <u class="suffix-highlight">esecek</u> <strong>(3)</strong>.<br/>
      Yağmurda <u class="suffix-highlight">ıslanacaksın</u> <strong>(4)</strong>.
    `,
    stem: '22. Bu metindeki numaralandırılmış sözcüklerden hangisi fiilimsidir?',
    options: ['1', '2', '3', '4'],
    correct: 1, // B
    explanation: '<strong>Cevap B (2):</strong> 2 numaralı <em>“açmadan”</em> sözcüğü <strong>-madan</strong> eki almış bir <strong>zarf-fiildir</strong>. (1 <em>geliyor</em>, 3 <em>esecek</em> ve 4 <em>ıslanacaksın</em> çekimli fiillerdir).'
  },
  {
    no: 23,
    exam: '2018 Bursluluk Sınavı',
    passage: `Sıfat-fiiller (-an, -ası, -mez, -ar, -dik, -ecek, -miş) isimleri niteleyen fiilimsilerdir.`,
    stem: '23. Aşağıdaki cümlelerin hangisinde sıfat-fiil kullanılmamıştır?',
    options: [
      'Çocuklar binanın merdivenlerine koşarak çıktı.',
      'Defterin arasında, kurutulmuş çiçekler vardı.',
      'Topallayan kedi yavaş yavaş yanımıza geldi.',
      'Kırılacak odunları bahçeye taşıdılar.'
    ],
    correct: 0, // A
    explanation: '<strong>Cevap A:</strong> B’de <em>kurutulmuş (çiçekler)</em>, C’de <em>topallayan (kedi)</em>, D’de <em>kırılacak (odunlar)</em> sıfat-fiildir. A seçeneğindeki <em>“koşarak”</em> ise <strong>zarf-fiildir</strong>, sıfat-fiil yoktur.'
  },
  {
    no: 24,
    exam: '2011 SBS',
    passage: `
      Serpilmeye <u>başladı</u> bir <u>rüzgâr</u> ince ince,<br/>
      Son <u>yokuş</u> noktasından düzlüğe <u class="suffix-highlight">çevrilince</u>.<br/>
      <span style="font-size:0.95rem; color:#94a3b8;">— Faruk Nafiz Çamlıbel</span>
    `,
    stem: '24. Bu dizelerdeki altı çizili sözcüklerden hangisi fiilimsidir?',
    options: ['Başladı', 'Rüzgâr', 'Yokuş', 'Çevrilince'],
    correct: 3, // D
    explanation: '<strong>Cevap D (Çevrilince):</strong> <em>“çevril-ince”</em> sözcüğü <strong>-ince</strong> eki almış zaman bildiren bir <strong>zarf-fiildir</strong>. (Dizelerdeki <em>serpilmeye</em> de isim-fiildir ancak altı çizili şıklar arasında <em>Çevrilince</em> sorulmuştur).'
  },
  {
    no: 25,
    exam: '2008 SBS',
    passage: `Fiilimsiler cümlede isim, sıfat veya zarf görevinde kullanılır.`,
    stem: '25. Aşağıdaki cümlelerin hangisinde altı çizili kelime diğerlerinden farklı bir görevde kullanılmıştır?',
    options: [
      'Kasabaya bir an önce varmak için <u>durmadan</u> yürüdük.',
      'Uçurtmanın kuyruğunu <u>takarken</u> yanlışlıkla çıtasını kırdım.',
      '<u>Büyüdüğüm</u> şehre yıllar sonra gelmek beni duygulandırdı.',
      'Otobüsü durakta görünce merdivenlerden <u>koşarak</u> indim.'
    ],
    correct: 2, // C
    explanation: '<strong>Cevap C:</strong> A (<em>durmadan</em>), B (<em>takarken</em>) ve D (<em>koşarak</em>) seçeneklerindeki altı çizili kelimeler <strong>zarf-fiil (zarf)</strong> görevindedir. C seçeneğindeki <em>“<u>Büyüdüğüm</u> (şehre)”</em> ise <strong>-dık</strong> eki almış bir <strong>sıfat-fiildir (sıfat görevindedir)</strong>!'
  }
];

let currentExamIdx = 0;
let examStatusMap = {}; // { 0: 'correct' | 'wrong' }

function renderExamNumberStrip() {
  const strip = document.getElementById('exam-q-numbers');
  if (!strip) return;
  strip.innerHTML = '';

  pastExamQuestions.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.textContent = q.no;
    btn.style.width = '44px';
    btn.style.height = '44px';
    btn.style.borderRadius = '10px';
    btn.style.fontWeight = '800';
    btn.style.fontSize = '1rem';
    btn.style.cursor = 'pointer';
    btn.style.border = '2px solid rgba(255,255,255,0.18)';
    btn.style.transition = '0.15s';

    if (idx === currentExamIdx) {
      btn.style.background = '#f59e0b';
      btn.style.color = '#0f172a';
      btn.style.borderColor = '#fde047';
      btn.style.transform = 'scale(1.1)';
    } else if (examStatusMap[idx] === 'correct') {
      btn.style.background = 'rgba(34,197,94,0.28)';
      btn.style.color = '#86efac';
      btn.style.borderColor = '#22c55e';
    } else if (examStatusMap[idx] === 'wrong') {
      btn.style.background = 'rgba(239,68,68,0.28)';
      btn.style.color = '#fca5a5';
      btn.style.borderColor = '#ef4444';
    } else {
      btn.style.background = '#1e293b';
      btn.style.color = '#cbd5e1';
    }

    btn.onclick = () => {
      playSound('click');
      currentExamIdx = idx;
      renderExamQuestion();
    };
    strip.appendChild(btn);
  });
}

function renderExamQuestion() {
  const q = pastExamQuestions[currentExamIdx];
  if (!q) return;

  renderExamNumberStrip();
  document.getElementById('exam-badge-year').textContent = `📌 ${q.exam}`;
  document.getElementById('exam-q-title').textContent = `SORU ${q.no} / ${pastExamQuestions.length}  •  (${q.exam})`;
  document.getElementById('exam-q-passage').innerHTML = q.passage;
  document.getElementById('exam-q-stem').innerHTML = q.stem;

  const solBox = document.getElementById('exam-q-solution');
  solBox.style.display = 'none';
  solBox.innerHTML = `🎯 ${q.explanation}`;

  const optsContainer = document.getElementById('exam-q-options');
  optsContainer.innerHTML = '';
  const letters = ['A', 'B', 'C', 'D'];

  q.options.forEach((optText, idx) => {
    const btn = document.createElement('button');
    btn.className = 'mil-opt-btn';
    btn.id = `exam-opt-${idx}`;
    btn.innerHTML = `<span class="letter">${letters[idx]}</span> <span>${optText}</span>`;
    btn.onclick = () => selectExamOption(idx, btn);
    optsContainer.appendChild(btn);
  });
}

function selectExamOption(idx, btnEl) {
  const q = pastExamQuestions[currentExamIdx];
  const solBox = document.getElementById('exam-q-solution');
  solBox.style.display = 'block';

  if (idx === q.correct) {
    playSound('fanfare');
    btnEl.classList.add('correct');
    examStatusMap[currentExamIdx] = 'correct';
  } else {
    playSound('wrong');
    btnEl.classList.add('wrong');
    const rightBtn = document.getElementById(`exam-opt-${q.correct}`);
    if (rightBtn) rightBtn.classList.add('correct');
    examStatusMap[currentExamIdx] = 'wrong';
  }
  renderExamNumberStrip();
}

function toggleExamSolution() {
  playSound('click');
  const solBox = document.getElementById('exam-q-solution');
  const q = pastExamQuestions[currentExamIdx];
  solBox.style.display = solBox.style.display === 'none' ? 'block' : 'none';
  const rightBtn = document.getElementById(`exam-opt-${q.correct}`);
  if (rightBtn) rightBtn.classList.add('correct');
}

function nextExamQuestion() {
  playSound('click');
  currentExamIdx = (currentExamIdx + 1) % pastExamQuestions.length;
  renderExamQuestion();
}

function prevExamQuestion() {
  playSound('click');
  currentExamIdx = (currentExamIdx - 1 + pastExamQuestions.length) % pastExamQuestions.length;
  renderExamQuestion();
}

// --- UYGULAMA BAŞLATICI ---
window.addEventListener('DOMContentLoaded', () => {
  renderDiscoverySet();
  renderDetective();
  renderMachine();
  loadBoxLevel(0);
  renderSpeedQuestion();
  renderDuel();
  restartMillionaire();
  renderFiilimsi5();
  renderFlashcard();
  renderExamQuestion();
});
