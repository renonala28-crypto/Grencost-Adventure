// Ubah nomor WA di WA_NUMBER dan harga/alat di PRODUCTS saat katalog diperbarui.
const WA_NUMBER = "6287796643786";
const WA_MESSAGE = "Halo Grencost Adventure, saya mau sewa alat. Bisa tanya ketersediaan?";

// Tarif dalam rupiah; `nextDay` berlaku untuk setiap hari setelah 24 jam pertama.
const PRODUCTS = [
    { name: "Hydropack 10L", category: "Tas", image: "tas", firstDay: 13000, nextDay: 11000, description: "Back mesh yang nyaman untuk hiking, trail running, dan aktivitas outdoor." },
    { name: "Carrier 45L", category: "Tas", image: "tas", firstDay: 13000, nextDay: 11000, description: "Ruang simpan luas dan sistem punggung nyaman untuk hiking & camping." },
    { name: "Carrier 65L", category: "Tas", image: "tas", firstDay: 15000, nextDay: 13000, description: "Carrier 60+5L dengan banyak kompartemen dan saku perlengkapan." },
    { name: "Carrier 100L", category: "Tas", image: "tas", firstDay: 25000, nextDay: 22000, description: "Kompartemen luas dan backsystem nyaman untuk ekspedisi panjang." },
    { name: "Head Lamp", category: "Penerangan", image: "penerangan", firstDay: 5000, nextDay: 5000, description: "Lampu LED dengan strap adjustable, termasuk 3 baterai AAA." },
    { name: "Lampu Tenda", category: "Penerangan", image: "penerangan", firstDay: 5000, nextDay: 5000, description: "LED portable dengan handle, termasuk 3 baterai AAA." },
    { name: "Senter", category: "Penerangan", image: "penerangan", firstDay: 5000, nextDay: 5000, description: "LED berbodi kokoh, termasuk 2 baterai AA untuk trekking & summit." },
    { name: "Lampu Hias", category: "Penerangan", image: "penerangan", firstDay: 5000, nextDay: 5000, description: "LED dekoratif, daya baterai AAA atau USB, panjang 5–10 m." },
    { name: "Cooking Set", category: "Masak", image: "masak", firstDay: 5000, nextDay: 5000, description: "Panci dan pan camping bergagang lipat untuk 1–2 orang." },
    { name: "Nesting TNI", category: "Masak", image: "masak", firstDay: 6000, nextDay: 6000, description: "Peralatan masak model persegi panjang untuk 3–4 orang." },
    { name: "Gelas Stainless", category: "Masak", image: "masak", firstDay: 5000, nextDay: 5000, description: "Gelas stainless ukuran 7 cm, teman ngopi santai saat camping." },
    { name: "Pan Persegi", category: "Masak", image: "masak", firstDay: 10000, nextDay: 8000, description: "Pan berpermukaan bergaris, cocok untuk daging, sosis, dan lainnya." },
    { name: "Kompor Kotak", category: "Kompor", image: "kompor", firstDay: 5000, nextDay: 5000, description: "Kompor gas portable yang ringkas dan mudah dibawa." },
    { name: "Kompor Mawar", category: "Kompor", image: "kompor", firstDay: 7000, nextDay: 5000, description: "Burner lebar dengan penyangga panci yang stabil." },
    { name: "Kompor Koper", category: "Kompor", image: "kompor", firstDay: 15000, nextDay: 12000, description: "Kompor berbentuk koper, praktis untuk camping bersama." },
    { name: "Gas Portable", category: "Kompor", image: "kompor", firstDay: 10000, nextDay: 8000, description: "Tabung butane portable untuk perlengkapan memasak." }
];

const productGrid = document.querySelector("#product-grid");
const estimateProduct = document.querySelector("#estimate-product");
const estimateDays = document.querySelector("#estimate-days");
const estimateTotal = document.querySelector("#estimate-total");
const rentalItems = document.querySelector("#rental-items");
const rentalItemCount = document.querySelector("#rental-item-count");
const addRentalItemButton = document.querySelector("#add-rental-item");
const estimateWhatsapp = document.querySelector("#estimate-whatsapp");
const rentalCart = new Map();

function formatRupiah(value) {
    return new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0
    }).format(value).replace(/\u00a0/g, " ");
}

function whatsappLink(message) {
    return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

function initializeWhatsAppLinks() {
    document.querySelectorAll("[data-wa-message]").forEach((link) => {
        const message = link.dataset.waMessage === "default"
            ? WA_MESSAGE
            : link.dataset.waMessage;
        link.href = whatsappLink(message);
    });

    const displayPhone = WA_NUMBER
        .replace(/^62/, "0")
        .replace(/^(\d{4})(\d{4})(\d{4})$/, "$1-$2-$3");
    document.querySelector("[data-wa-phone]").firstChild.textContent = `${displayPhone} `;
}

function renderProducts(category = "Semua") {
    const visibleProducts = category === "Semua"
        ? PRODUCTS
        : PRODUCTS.filter((product) => product.category === category);

    productGrid.innerHTML = visibleProducts.map((product) => `
        <article class="product-card">
            <div class="product-visual">
                <img src="/img/placeholder-${product.image}.svg" alt="Placeholder foto ${product.name}" loading="lazy" width="480" height="320">
                <span class="product-label">${product.name}</span>
            </div>
            <div class="product-body">
                <span class="product-category">${product.category}</span>
                <p class="product-desc">${product.description}</p>
                <div class="product-prices">
                    <span><span class="price-label">24 jam</span><strong class="price-value">${formatRupiah(product.firstDay)} <small>/ hari</small></strong></span>
                    <span><span class="price-label">&gt;24 jam</span><strong class="price-value">${formatRupiah(product.nextDay)} <small>/ hari</small></strong></span>
                </div>
                <a class="rent-button" href="${whatsappLink(`Halo, saya mau sewa ${product.name}. Apakah tersedia?`)}" target="_blank" rel="noopener noreferrer"><span>Sewa alat ini</span><span aria-hidden="true">↗</span></a>
            </div>
        </article>
    `).join("");
}

function getRentalDays() {
    const days = estimateDays.valueAsNumber;
    return Number.isInteger(days) && days >= 1 && days <= 365 ? days : null;
}

function setEstimateWhatsapp(message, enabled) {
    estimateWhatsapp.href = enabled ? whatsappLink(message) : "#";
    estimateWhatsapp.classList.toggle("is-disabled", !enabled);
    estimateWhatsapp.setAttribute("aria-disabled", String(!enabled));
    estimateWhatsapp.tabIndex = enabled ? 0 : -1;
}

function renderRentalCart() {
    const days = getRentalDays();
    const selectedItems = [...rentalCart.entries()]
        .map(([name, quantity]) => ({
            product: PRODUCTS.find((product) => product.name === name),
            quantity
        }))
        .filter((item) => item.product);
    const totalQuantity = selectedItems.reduce((sum, item) => sum + item.quantity, 0);

    rentalItemCount.textContent = totalQuantity
        ? `${selectedItems.length} jenis · ${totalQuantity} item`
        : "Belum ada alat";

    if (!selectedItems.length) {
        rentalItems.innerHTML = '<p class="rental-empty">Pilih alat di atas, lalu tekan “Tambah alat”.</p>';
        estimateTotal.textContent = days ? formatRupiah(0) : "Periksa lama sewa";
        setEstimateWhatsapp("", false);
        return;
    }

    if (!days) {
        rentalItems.querySelectorAll(".rental-item-info span").forEach((detail) => {
            detail.textContent = "Atur lama sewa untuk melihat rincian harga.";
        });
        rentalItems.querySelectorAll(".rental-item-subtotal").forEach((subtotal) => {
            subtotal.textContent = "—";
        });
        estimateTotal.textContent = "Periksa lama sewa";
        setEstimateWhatsapp("", false);
        return;
    }

    const lineItems = selectedItems.map(({ product, quantity }) => {
        const dailyCost = product.firstDay + Math.max(0, days - 1) * product.nextDay;
        const subtotal = dailyCost * quantity;
        const pricingBreakdown = days === 1
            ? `${formatRupiah(product.firstDay)} / item`
            : `${formatRupiah(product.firstDay)} + ${days - 1} × ${formatRupiah(product.nextDay)} / item`;

        return { product, quantity, subtotal, pricingBreakdown };
    });
    const total = lineItems.reduce((sum, item) => sum + item.subtotal, 0);

    rentalItems.innerHTML = lineItems.map(({ product, quantity, subtotal, pricingBreakdown }) => `
        <div class="rental-item">
            <div class="rental-item-info">
                <strong>${product.name}</strong>
                <span>${pricingBreakdown} × ${quantity} item</span>
            </div>
            <label class="rental-item-quantity">
                <span>Jumlah</span>
                <input type="number" min="1" max="99" step="1" value="${quantity}" data-rental-quantity="${product.name}" aria-label="Jumlah ${product.name}">
            </label>
            <strong class="rental-item-subtotal">${formatRupiah(subtotal)}</strong>
            <button class="rental-item-remove" type="button" data-remove-rental="${product.name}" aria-label="Hapus ${product.name} dari rincian">×</button>
        </div>
    `).join("");

    estimateTotal.textContent = formatRupiah(total);
    const messageLines = lineItems.map(({ product, quantity, subtotal }) => {
        const unitBreakdown = days === 1
            ? formatRupiah(product.firstDay)
            : `${formatRupiah(product.firstDay)} + ${days - 1} x ${formatRupiah(product.nextDay)}`;
        return `- ${product.name}: ${quantity} item x (${unitBreakdown}) = ${formatRupiah(subtotal)}`;
    });
    const message = [
        "Halo Grencost Adventure, saya mau tanya ketersediaan dan booking alat:",
        `Lama sewa: ${days} hari`,
        "Rincian:",
        ...messageLines,
        `Total estimasi: ${formatRupiah(total)}`,
        "Mohon konfirmasi ketersediaan dan total akhirnya. Terima kasih."
    ].join("\n");

    setEstimateWhatsapp(message, true);
}

function initializeEstimator() {
    const options = PRODUCTS.map((product) => {
        const option = document.createElement("option");
        option.value = product.name;
        option.textContent = `${product.name} — ${formatRupiah(product.firstDay)} / 24 jam`;
        return option;
    });
    estimateProduct.append(...options);
    estimateProduct.addEventListener("change", () => {
        addRentalItemButton.disabled = !estimateProduct.value;
    });
    addRentalItemButton.addEventListener("click", () => {
        const selected = estimateProduct.value;
        if (!PRODUCTS.some((product) => product.name === selected)) return;

        rentalCart.set(selected, Math.min(99, (rentalCart.get(selected) || 0) + 1));
        estimateProduct.value = "";
        addRentalItemButton.disabled = true;
        renderRentalCart();
    });
    estimateDays.addEventListener("input", renderRentalCart);
    rentalItems.addEventListener("change", (event) => {
        const input = event.target.closest("[data-rental-quantity]");
        if (!input) return;

        const quantity = Number.parseInt(input.value, 10);
        if (!Number.isInteger(quantity) || quantity < 1 || quantity > 99) {
            input.value = String(rentalCart.get(input.dataset.rentalQuantity));
            return;
        }

        rentalCart.set(input.dataset.rentalQuantity, quantity);
        renderRentalCart();
    });
    rentalItems.addEventListener("click", (event) => {
        const button = event.target.closest("[data-remove-rental]");
        if (!button) return;

        rentalCart.delete(button.dataset.removeRental);
        renderRentalCart();
    });
    renderRentalCart();
}

document.querySelector(".filter-row").addEventListener("click", (event) => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    document.querySelectorAll(".filter-button").forEach((filter) => {
        const active = filter === button;
        filter.classList.toggle("is-active", active);
        filter.setAttribute("aria-pressed", String(active));
    });
    renderProducts(button.dataset.category);
});

const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector("#site-nav");
menuToggle.addEventListener("click", () => {
    const expanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!expanded));
    menuToggle.setAttribute("aria-label", expanded ? "Buka menu" : "Tutup menu");
    siteNav.classList.toggle("is-open", !expanded);
});
siteNav.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
        siteNav.classList.remove("is-open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Buka menu");
    }
});

const revealItems = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => revealObserver.observe(item));
} else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
}

document.querySelector("#current-year").textContent = String(new Date().getFullYear());
initializeWhatsAppLinks();
renderProducts();
initializeEstimator();
