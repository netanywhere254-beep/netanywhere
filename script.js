/* =====================================================
   Net.Anywhere – Interactive Scripts
   Edit chatbot replies, form handling, etc. below
   ===================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // Year in footer
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile menu
  const menuToggle = document.getElementById('menuToggle');
  const nav = document.getElementById('nav');
  if (menuToggle && nav) {
    menuToggle.addEventListener('click', () => nav.classList.toggle('open'));
    nav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => nav.classList.remove('open'));
    });
  }

  // ---------- Modals ----------
  const payModal = document.getElementById('payModal');
  const trialModal = document.getElementById('trialModal');
  const referModal = document.getElementById('referModal');
  const modalPkgName = document.getElementById('modalPkgName');

  function openModal(modal) {
    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }
  }
  function closeModal(modal) {
    if (modal) {
      modal.hidden = true;
      document.body.style.overflow = '';
    }
  }

  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      closeModal(payModal);
      closeModal(trialModal);
      closeModal(referModal);
    });
  });

  // Package buy buttons
  document.querySelectorAll('.btn-pkg').forEach(btn => {
    btn.addEventListener('click', () => {
      const pkg = btn.dataset.package || 'Selected Package';
      if (modalPkgName) modalPkgName.textContent = pkg;
      openModal(payModal);
    });
  });

  // Trial & Refer buttons
  const openTrial = document.getElementById('openTrialModal');
  const openRefer = document.getElementById('openReferModal');
  if (openTrial) openTrial.addEventListener('click', () => openModal(trialModal));
  if (openRefer) openRefer.addEventListener('click', () => openModal(referModal));

  // Pay now (demo)
  const payNowBtn = document.getElementById('payNowBtn');
  if (payNowBtn) {
    payNowBtn.addEventListener('click', () => {
      const phone = document.getElementById('mpesaPhone')?.value.trim();
      if (!phone || phone.length < 9) {
        alert('Please enter a valid M-PESA phone number.');
        return;
      }
      alert('STK Push would be sent to ' + phone + '.\n\n(This is a demo. Connect your real payment API or Till number here.)');
      closeModal(payModal);
    });
  }

  // Free trial activate
  const activateTrialBtn = document.getElementById('activateTrialBtn');
  if (activateTrialBtn) {
    activateTrialBtn.addEventListener('click', () => {
      const phone = document.getElementById('trialPhone')?.value.trim();
      if (!phone || phone.length < 9) {
        alert('Please enter a valid phone number.');
        return;
      }
      alert('Free 30-minute trial request received for ' + phone + '.\nOur system will activate access shortly. You can also WhatsApp 0115 503 175.');
      closeModal(trialModal);
    });
  }

  // Copy referral link
  const copyReferBtn = document.getElementById('copyReferBtn');
  if (copyReferBtn) {
    copyReferBtn.addEventListener('click', () => {
      const input = document.getElementById('referLink');
      if (input) {
        input.select();
        navigator.clipboard.writeText(input.value).then(() => {
          copyReferBtn.textContent = 'Copied!';
          setTimeout(() => (copyReferBtn.textContent = 'Copy'), 2000);
        });
      }
    });
  }

  // ---------- Usage Estimator ----------
  document.querySelectorAll('.est-opt').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.est-opt').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const rec = document.getElementById('recommendation');
      const recName = document.getElementById('recName');
      const recDesc = document.getElementById('recDesc');
      if (rec && recName && recDesc) {
        recName.textContent = btn.dataset.rec;
        recDesc.textContent = btn.dataset.desc;
        rec.hidden = false;
      }
    });
  });

  // ---------- Contact Form ----------
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const phone = document.getElementById('phone').value.trim();
      const location = document.getElementById('location').value.trim();
      const service = document.getElementById('service').value;
      const message = document.getElementById('message').value.trim();

      // Build mailto (works without backend)
      const subject = encodeURIComponent('Net.Anywhere Inquiry – ' + service);
      const body = encodeURIComponent(
        'Phone: ' + phone + '\n' +
        'Location: ' + location + '\n' +
        'Service: ' + service + '\n\n' +
        'Message:\n' + message
      );
      const mailto = 'mailto:netanywhere254@gmail.com?subject=' + subject + '&body=' + body;

      // Also show confirmation
      alert('Thank you! Your inquiry has been prepared.\n\nAn email window will open so you can send it to netanywhere254@gmail.com.\nYou can also WhatsApp us on 0115 503 175.');
      window.location.href = mailto;
      contactForm.reset();
    });
  }

  // ---------- Chatbot ----------
  const chatToggle = document.getElementById('chatToggle');
  const chatWindow = document.getElementById('chatWindow');
  const chatClose = document.getElementById('chatClose');
  const chatMessages = document.getElementById('chatMessages');
  const chatInput = document.getElementById('chatInput');
  const chatSend = document.getElementById('chatSend');

  // Editable chatbot knowledge base
  const botReplies = {
    packages: 'We have hotspot vouchers from Ksh 10 (1 hour) up to Ksh 200 (VIP Unlimited 20 hrs). Scroll to the Packages section or tell me how long you need internet.',
    trial: 'You can claim a free 30-minute trial! Click “Claim Free 30 Min” on the site or type your phone number here and we’ll guide you.',
    home: 'Our PPPoE Home Unlimited plans start from Ksh 1,500/month (5 Mbps) up to 50 Mbps Business. Truly unlimited data. Would you like a quotation for your estate?',
    support: 'For live support call or WhatsApp 0115 503 175, or email netanywhere254@gmail.com. We’re happy to help!',
    price: 'Hotspot: 1hr Ksh10, 2hrs Ksh15, 4hrs Ksh20, 6hrs Ksh30, 12hrs Ksh50, 24hrs Ksh100, VIP 20hrs Ksh200. Home fiber from Ksh 1,500/mo.',
    mpesa: 'Payment is via M-PESA STK Push. Choose a package, enter your number and confirm on your phone. Instant activation!',
    coverage: 'We cover multiple estates. Tell us your location (e.g. Pipeline, Embakasi, etc.) and we’ll confirm coverage and speed options.',
    default: 'Thanks for your message! For packages, free trial, home fiber or support, try the quick buttons or call 0115 503 175. You can also email netanywhere254@gmail.com.'
  };

  function addBotMessage(text, withQuick = false) {
    const div = document.createElement('div');
    div.className = 'chat-msg bot';
    div.innerHTML = text;
    if (withQuick) {
      div.innerHTML += `
        <div class="quick-replies">
          <button data-q="packages">View packages</button>
          <button data-q="trial">Free trial</button>
          <button data-q="home">Home fiber</button>
          <button data-q="support">Talk to human</button>
        </div>`;
    }
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
    // Re-bind quick reply buttons
    div.querySelectorAll('[data-q]').forEach(btn => {
      btn.addEventListener('click', () => handleQuick(btn.dataset.q));
    });
  }

  function addUserMessage(text) {
    const div = document.createElement('div');
    div.className = 'chat-msg user';
    div.textContent = text;
    chatMessages.appendChild(div);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function handleQuick(key) {
    const labels = {
      packages: 'View packages',
      trial: 'Free trial',
      home: 'Home fiber',
      support: 'Talk to human'
    };
    addUserMessage(labels[key] || key);
    setTimeout(() => {
      addBotMessage(botReplies[key] || botReplies.default);
    }, 400);
  }

  function respondToText(text) {
    const t = text.toLowerCase();
    if (t.includes('package') || t.includes('price') || t.includes('cost') || t.includes('voucher') || t.includes('plan')) {
      return botReplies.packages + ' ' + botReplies.price;
    }
    if (t.includes('trial') || t.includes('free')) return botReplies.trial;
    if (t.includes('home') || t.includes('pppoe') || t.includes('fiber') || t.includes('fibre') || t.includes('monthly')) return botReplies.home;
    if (t.includes('support') || t.includes('help') || t.includes('human') || t.includes('call') || t.includes('whatsapp')) return botReplies.support;
    if (t.includes('mpesa') || t.includes('pay') || t.includes('payment')) return botReplies.mpesa;
    if (t.includes('cover') || t.includes('area') || t.includes('location') || t.includes('estate')) return botReplies.coverage;
    return botReplies.default;
  }

  if (chatToggle && chatWindow) {
    chatToggle.addEventListener('click', () => {
      chatWindow.hidden = !chatWindow.hidden;
      const badge = chatToggle.querySelector('.chat-badge');
      if (badge) badge.style.display = 'none';
    });
  }
  if (chatClose) {
    chatClose.addEventListener('click', () => { chatWindow.hidden = true; });
  }

  // Initial quick replies binding
  document.querySelectorAll('.quick-replies [data-q]').forEach(btn => {
    btn.addEventListener('click', () => handleQuick(btn.dataset.q));
  });

  function sendChat() {
    const text = chatInput.value.trim();
    if (!text) return;
    addUserMessage(text);
    chatInput.value = '';
    setTimeout(() => {
      addBotMessage(respondToText(text));
    }, 500);
  }

  if (chatSend) chatSend.addEventListener('click', sendChat);
  if (chatInput) {
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') sendChat();
    });
  }
});
