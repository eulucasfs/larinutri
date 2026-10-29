const menuToggle = document.querySelector('.menu-toggle');
const mainNav = document.querySelector('.main-nav');
const themeToggle = document.querySelector('.theme-toggle');
const whatsappMessage = 'Olá, Lari! Vim pelo site e quero saber mais sobre a consulta.';
document.querySelectorAll('[data-whatsapp-number]').forEach((link) => {
  const number = link.dataset.whatsappNumber.replace(/\D/g, '');
  if (number.length >= 10) {
    link.href = `https://wa.me/${number}?text=${encodeURIComponent(whatsappMessage)}`;
    link.target = '_blank';
    link.rel = 'noopener';
  }
});

menuToggle?.addEventListener('click', () => {
  const isOpen = mainNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
});

document.querySelectorAll('.main-nav a').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
  });
});

const savedTheme = localStorage.getItem('lari-theme');
if (savedTheme === 'dark') document.body.classList.add('dark');
const updateThemeLabel = () => {
  const dark = document.body.classList.contains('dark');
  themeToggle?.setAttribute('aria-label', dark ? 'Ativar modo claro' : 'Ativar modo escuro');
  if (themeToggle) themeToggle.textContent = dark ? '☀' : '☾';
};
updateThemeLabel();
themeToggle?.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  localStorage.setItem('lari-theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  updateThemeLabel();
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach((element) => revealObserver.observe(element));

document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach((item) => item.classList.remove('active'));
    document.querySelectorAll('.calc-form').forEach((form) => form.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(`${tab.dataset.tab}-form`)?.classList.add('active');
  });
});

const imcForm = document.getElementById('imc-form');
imcForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const weight = Number(document.getElementById('peso').value);
  const height = Number(document.getElementById('altura').value) / 100;
  const result = document.getElementById('imc-result');
  if (!weight || !height) return;
  const imc = weight / (height * height);
  let classification = 'faixa de atenção';
  if (imc < 18.5) classification = 'abaixo do peso';
  else if (imc < 25) classification = 'faixa considerada adequada';
  else if (imc < 30) classification = 'acima do peso';
  else classification = 'faixa de atenção';
  result.innerHTML = `<strong>${imc.toFixed(1)}</strong>Seu resultado indica ${classification}. <small>O IMC é apenas uma referência, não um diagnóstico.</small>`;
});

const caloriesForm = document.getElementById('calorias-form');
caloriesForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const age = Number(document.getElementById('idade').value);
  const weight = Number(document.getElementById('peso-cal').value);
  const height = Number(document.getElementById('altura-cal').value);
  const sex = document.getElementById('sexo').value;
  const result = document.getElementById('calorias-result');
  if (!age || !weight || !height) return;
  const basal = sex === 'f' ? (10 * weight) + (6.25 * height) - (5 * age) - 161 : (10 * weight) + (6.25 * height) - (5 * age) + 5;
  const daily = Math.round(basal * 1.35);
  result.innerHTML = `<strong>${daily} kcal</strong>estimativa de gasto diário em atividade leve. <small>Uma avaliação profissional considera muito mais do que esta estimativa.</small>`;
});

const showFeedback = (form, message, isError = false) => {
  const feedback = form.querySelector('.form-feedback');
  if (feedback) {
    feedback.textContent = message;
    feedback.classList.toggle('error', isError);
  }
};

document.getElementById('contact-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) {
    showFeedback(form, 'Confira os campos obrigatórios para continuar.', true);
    form.reportValidity();
    return;
  }
  showFeedback(form, 'Obrigada! Recebi seus dados e vou entrar em contato em breve.');
  form.reset();
});

document.getElementById('newsletter-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  const email = form.querySelector('input');
  if (!email.checkValidity()) {
    showFeedback(form, 'Digite um e-mail válido para se inscrever.', true);
    email.focus();
    return;
  }
  showFeedback(form, 'Pronto! A próxima dose de leveza já está a caminho.');
  form.reset();
});
