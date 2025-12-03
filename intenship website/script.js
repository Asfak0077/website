const animatedNodes = document.querySelectorAll('[data-animate]');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const revealInstantly = () => {
	animatedNodes.forEach(node => {
		node.style.transition = 'none';
		node.classList.add('is-visible');
	});
};

if (prefersReducedMotion.matches) {
	revealInstantly();
} else {
	const observer = new IntersectionObserver((entries, obs) => {
		entries.forEach(entry => {
			if (!entry.isIntersecting) return;
			const node = entry.target;
			const delay = Number(node.dataset.delay || 0);
			node.style.transitionDelay = `${delay}s`;
			node.classList.add('is-visible');
			obs.unobserve(node);
		});
	}, {
		threshold: 0.25,
		rootMargin: '0px 0px -10% 0px'
	});

	animatedNodes.forEach(node => observer.observe(node));
}

prefersReducedMotion.addEventListener('change', event => {
	if (event.matches) {
		revealInstantly();
	}
});

const toastContainer = (() => {
	const existing = document.querySelector('[data-toast-container]');
	if (existing) return existing;
	const container = document.createElement('div');
	container.className = 'toast-container';
	container.setAttribute('data-toast-container', '');
	document.body.appendChild(container);
	return container;
})();

const showToast = message => {
	const toast = document.createElement('div');
	toast.className = 'toast';
	toast.textContent = message;
	toastContainer.appendChild(toast);

	requestAnimationFrame(() => toast.classList.add('is-visible'));

	setTimeout(() => {
		toast.classList.remove('is-visible');
		toast.addEventListener('transitionend', () => toast.remove(), { once: true });
	}, 3200);
};

document.querySelectorAll('form').forEach(form => {
	form.addEventListener('submit', event => {
		event.preventDefault();
		if (!form.checkValidity()) {
			form.reportValidity();
			return;
		}
		const title = form.querySelector('h3')?.textContent?.trim() || 'Form';
		showToast(`${title} submitted successfully ✅`);
		form.reset();
	});
});
