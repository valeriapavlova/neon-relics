// js/newsletter.js
// Formulario "Join the inner frequency" (index.html y about.html)
// Validación en el cliente: nombre, email y casilla de consentimiento.
// Los mensajes de error / éxito se muestran en .frequency__message

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

// Reglas de cada campo: cómo se valida y qué mensaje se muestra
const RULES = {
    name: (input) => input.value.trim().length > 1,
    email: (input) => EMAIL_RE.test(input.value.trim()),
    consent: (input) => input.checked,
};

export function initNewsletterForm() {
    const form = document.querySelector('.frequency .form');
    if (!form) return;

    const message = form.querySelector('.frequency__message');
    const fields = Object.keys(RULES).map((name) => form.elements[name]);

    const setMessage = (text, type) => {
        message.textContent = text;
        message.classList.toggle('frequency__message--error', type === 'error');
        message.classList.toggle('frequency__message--success', type === 'success');
    };

    // Marca un campo como válido / inválido y muestra su error
    const markField = (input, ok) => {
        input.setAttribute('aria-invalid', String(!ok));
        const error = document.getElementById(`${input.id}-error`);
        if (error) error.hidden = ok;
        return ok;
    };

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const invalid = fields.filter((input) => !markField(input, RULES[input.name](input)));

        if (invalid.length) {
            setMessage(
                invalid.length === 1
                    ? 'One field needs your attention.'
                    : `${invalid.length} fields need your attention.`,
                'error',
            );
            invalid[0].focus();
            return;
        }

        const name = form.elements.name.value.trim();
        form.reset();
        fields.forEach((input) => input.removeAttribute('aria-invalid'));
        setMessage(`You are in the orbit, ${name}. We will write when a new chapter opens.`, 'success');
    });

    // Al corregir un campo con error, se revalida en vivo
    fields.forEach((input) => {
        const eventName = input.type === 'checkbox' ? 'change' : 'input';
        input.addEventListener(eventName, () => {
            if (input.getAttribute('aria-invalid') !== 'true') return;
            markField(input, RULES[input.name](input));
            if (!form.querySelector('[aria-invalid="true"]')) setMessage('', null);
        });
    });
}
