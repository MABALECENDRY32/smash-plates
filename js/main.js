document.addEventListener("DOMContentLoaded", () => {
    const year = document.getElementById("year");
    if (year) year.textContent = new Date().getFullYear();

    const navToggle = document.getElementById("navToggle");
    const nav = document.getElementById("mainNav");

    if (navToggle && nav) {
        const setOpen = (open) => {
            nav.classList.toggle("open", open);
            navToggle.setAttribute("aria-expanded", String(open));
            navToggle.setAttribute(
                "aria-label",
                open ? "Close navigation menu" : "Open navigation menu"
            );
        };

    
         navToggle.addEventListener("click", () => {
        const isOpen = nav.classList.contains("is-open");
        setOpen(!isOpen);
    });

    // Optional: close on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") setOpen(false);
    });
}

    document.querySelectorAll(".menu-card").forEach((card) => {
        const title = card.querySelector("h3");
        const price = card.querySelector(".price");
        if (!title || card.querySelector(".order-meal-btn")) return;

        const button = document.createElement("a");
        button.className = "btn btn-primary order-meal-btn";
        button.href = "contact.html";
        button.textContent = "Order This Meal";
        button.setAttribute("aria-label", `Order ${title.textContent.trim()}`);

        button.addEventListener("click", (event) => {
            event.preventDefault();
            const mealName = title.textContent.trim();
            const mealPrice = price ? price.textContent.trim() : "Price to confirm";
            const query = new URLSearchParams({ meal: mealName, price: mealPrice });
            window.location.href = `contact.html?${query.toString()}`;
        });

        card.appendChild(button);
    });

    const messageField = document.getElementById("message");
    if (messageField) {
        const params = new URLSearchParams(window.location.search);
        const meal = params.get("meal");
        const price = params.get("price");

        if (meal) {
            const orderDetails = `Meal: ${meal}\nPrice shown: ${price || "Please confirm"}\nQuantity: 1`;
            if (!messageField.value.trim()) {
                messageField.value = `${orderDetails}\n\nAdditional instructions: `;
            } else if (!messageField.value.includes(`Meal: ${meal}`)) {
                messageField.value += `\n\n${orderDetails}`;
            }
            messageField.focus();
        }
    }

    document.querySelectorAll(".menu-card img").forEach((img) => {
        img.addEventListener("error", () => {
            img.alt = img.alt || "Meal image unavailable";
            img.style.background = "#f5efd9";
            img.style.minHeight = "160px";
            img.style.objectFit = "contain";
        }, { once: true });
    });
});

  const contactForm = document.getElementById('contactForm');
        const whatsappStatus = document.getElementById('whatsappStatus');
        const whatsappNumber = '27760596502';

        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const formData = new FormData(contactForm);
            const draftMessage = [
                'Hello SMASH PLATE,',
                '',
                `Name: ${formData.get('name')}`,
                `WhatsApp number: ${formData.get('whatsapp')}`,
                '',
                'Message:',
                formData.get('message')
            ].join('\n');
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(draftMessage)}`;

            whatsappStatus.textContent = 'Preparing WhatsApp...';
            whatsappStatus.className = 'form-note';

            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 5000);
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { Accept: 'application/json' },
                    signal: controller.signal
                });
                clearTimeout(timeout);
                const result = await response.json();

                if (!response.ok || !result.success) {
                    whatsappStatus.textContent = 'Email delivery is unavailable. Opening WhatsApp instead...';
                    whatsappStatus.className = 'form-note form-note-error';
                } else {
                    whatsappStatus.textContent = 'Request sent. Opening WhatsApp...';
                    whatsappStatus.className = 'form-note form-note-success';
                }
            } catch (error) {
                whatsappStatus.textContent = 'Email delivery is unavailable. Opening WhatsApp instead...';
                whatsappStatus.className = 'form-note form-note-error';
            } finally {
                window.location.assign(whatsappUrl);
            }
        });