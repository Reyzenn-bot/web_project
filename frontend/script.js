document.addEventListener('DOMContentLoaded', function () {
    let unitPrice = 0;
    const qtyInput = document.getElementById('modalQty');
    const priceElement = document.getElementById('modalPrice');
    const detailButtons = document.querySelectorAll('.view-detail-btn');

    // ==========================================
    // ១. ផ្នែកចុច View Detail
    // ==========================================
    detailButtons.forEach(button => {
        button.addEventListener('click', function () {
            const title = this.getAttribute('data-title');
            const imgSrc = this.getAttribute('data-img');
            const priceStr = this.getAttribute('data-price') || '$0';

            unitPrice = parseFloat(priceStr.replace(/[^0-9.-]+/g, "")) || 0;

            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalImg').src = imgSrc;

            const spec1Label = this.getAttribute('data-spec1-label') || 'CPU:';
            const spec1Val   = this.getAttribute('data-spec1-val') || this.getAttribute('data-cpu') || 'N/A';

            const spec2Label = this.getAttribute('data-spec2-label') || 'RAM:';
            const spec2Val   = this.getAttribute('data-spec2-val') || this.getAttribute('data-ram') || 'N/A';

            const spec3Label = this.getAttribute('data-spec3-label') || 'Storage:';
            const spec3Val   = this.getAttribute('data-spec3-val') || this.getAttribute('data-storage') || 'N/A';

            const spec4Label = this.getAttribute('data-spec4-label') || 'GPU/VGA:';
            const spec4Val   = this.getAttribute('data-spec4-val') || this.getAttribute('data-gpu') || 'N/A';

            setSpecField('modalCpu', spec1Label, spec1Val);
            setSpecField('modalRam', spec2Label, spec2Val);
            setSpecField('modalStorage', spec3Label, spec3Val);
            setSpecField('modalGpu', spec4Label, spec4Val);

            const extraLabel = this.getAttribute('data-display-label') || 'Display:';
            const extraVal   = this.getAttribute('data-display-val') || this.getAttribute('data-display') || 'N/A';
            setSpecField('modalDisplay', extraLabel, extraVal);

            document.getElementById('modalRecommend').textContent = this.getAttribute('data-recommend') || 'Recommended for General Use';
            document.getElementById('modalFreeGift').textContent = this.getAttribute('data-free') || 'N/A';

            if (qtyInput) qtyInput.value = 1;
            updateTotalPrice();
        });
    });

    function setSpecField(elementId, labelText, valueText) {
        const el = document.getElementById(elementId);
        if (el) {
            if (el.parentElement && el.parentElement.querySelector('strong')) {
                el.parentElement.querySelector('strong').textContent = labelText + ' ';
            }
            el.textContent = valueText;
        }
    }

    // ==========================================
    // ២. មុខងារបូក/ដក Qty និងគណនាតម្លៃ
    // ==========================================
    const btnPlus = document.getElementById('btnPlus');
    const btnMinus = document.getElementById('btnMinus');

    if (btnPlus && btnMinus && qtyInput) {
        btnPlus.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value) || 1;
            qtyInput.value = currentQty + 1;
            updateTotalPrice();
        });

        btnMinus.addEventListener('click', () => {
            let currentQty = parseInt(qtyInput.value) || 1;
            if (currentQty > 1) {
                qtyInput.value = currentQty - 1;
                updateTotalPrice();
            }
        });
    }

    function updateTotalPrice() {
        if (!qtyInput || !priceElement) return;
        let currentQty = parseInt(qtyInput.value) || 1;
        let totalPrice = unitPrice * currentQty;
        priceElement.textContent = '$' + totalPrice.toLocaleString('en-US');
    }

    // ==========================================
    // ៣. ផ្នែក ADD TO CART & DELETE
    // ==========================================
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const btnAddToCartModal = document.getElementById('btnAddToCartModal');

    if (btnAddToCartModal) {
        btnAddToCartModal.addEventListener('click', function () {
            if (unitPrice === 0 && priceElement) {
                const currentPriceText = priceElement.textContent || '$0';
                const currentQty = parseInt(qtyInput ? qtyInput.value : 1) || 1;
                const totalVal = parseFloat(currentPriceText.replace(/[^0-9.-]+/g, "")) || 0;
                unitPrice = totalVal / currentQty;
            }

            const product = {
                title: document.getElementById('modalTitle') ? document.getElementById('modalTitle').textContent : 'Product',
                img: document.getElementById('modalImg') ? document.getElementById('modalImg').src : '',
                price: unitPrice,
                qty: parseInt(qtyInput ? qtyInput.value : 1) || 1
            };

            addToCart(product);

            // បិទ Modal
            const modalEl = document.getElementById('productDetailModal');
            if (modalEl) {
                const modalInstance = bootstrap.Modal.getInstance(modalEl);
                if (modalInstance) modalInstance.hide();
            }

            // សម្អាត Backdrop ចាស់ៗចេញ[cite: 5]
            document.querySelectorAll('.modal-backdrop').forEach(el => el.remove());

            // បើក Cart Offcanvas
            const cartOffcanvasEl = document.getElementById('cartOffcanvas');
            if (cartOffcanvasEl) {
                const cartOffcanvas = bootstrap.Offcanvas.getInstance(cartOffcanvasEl) || new bootstrap.Offcanvas(cartOffcanvasEl);
                cartOffcanvas.show();
            }
        });
    }

    function addToCart(product) {
        const existingIndex = cart.findIndex(item => item.title === product.title);

        if (existingIndex > -1) {
            cart[existingIndex].qty += product.qty;
        } else {
            cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartUI();
    }

    function renderCartUI() {
        const cartContainer = document.getElementById('cart-items-container');
        const cartTotalElement = document.getElementById('cart-total');

        if (!cartContainer) return;

        cartContainer.innerHTML = '';
        let grandTotal = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p class="text-center text-muted mt-4">Your cart is empty.</p>';
        } else {
            cart.forEach((item, index) => {
                const itemTotal = item.price * item.qty;
                grandTotal += itemTotal;

                cartContainer.innerHTML += `
                    <div class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                        <div class="d-flex align-items-center gap-2">
                            <img src="${item.img}" style="width: 50px; height: 50px; object-fit: contain;">
                            <div>
                                <h6 class="mb-0 small fw-bold">${item.title}</h6>
                                <small class="text-muted">$${item.price.toLocaleString('en-US')} x ${item.qty}</small>
                            </div>
                        </div>
                        <div class="text-end">
                            <div class="fw-bold small">$${itemTotal.toLocaleString('en-US')}</div>
                            <button type="button" class="btn btn-sm text-danger p-0 border-0 btn-delete-item" onclick="event.stopPropagation(); removeFromCart(${index});">
                                <small>Delete</small>
                            </button>
                        </div>
                    </div>
                `;
            });
        }

        if (cartTotalElement) {
            cartTotalElement.textContent = '$' + grandTotal.toLocaleString('en-US');
        }
    }

    window.removeFromCart = function (index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCartUI();
    };

    renderCartUI();

    // ==========================================
    // ៤. មុខងារចុច Outside ដើម្បីបិទ Cart
    // ==========================================
    document.addEventListener('click', function (event) {
        const cartOffcanvasEl = document.getElementById('cartOffcanvas');

        if (cartOffcanvasEl && cartOffcanvasEl.classList.contains('show')) {
            const isClickInsideCart = cartOffcanvasEl.contains(event.target);
            const isClickDeleteBtn = event.target.closest('.btn-delete-item');
            const isClickAddBtn = event.target.closest('#btnAddToCartModal');
            const isClickDetailBtn = event.target.closest('.view-detail-btn');

            // បើមិនមែនចុចលើ Cart, ប៊ូតុង Delete, ប៊ូតុង Add ឬ View Detail ទេ ទើបបិទ Cart
            if (!isClickInsideCart && !isClickDeleteBtn && !isClickAddBtn && !isClickDetailBtn) {
                const cartOffcanvas = bootstrap.Offcanvas.getInstance(cartOffcanvasEl);
                if (cartOffcanvas) {
                    cartOffcanvas.hide();
                }
            }
        }
    });

    // សម្អាត Backdrop និងលុប Class ស្ទះពេល Offcanvas បិទផុត
    const cartOffcanvasEl = document.getElementById('cartOffcanvas');
    if (cartOffcanvasEl) {
        cartOffcanvasEl.addEventListener('hidden.bs.offcanvas', function () {
            document.querySelectorAll('.offcanvas-backdrop, .modal-backdrop').forEach(el => el.remove());
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
        });
    }
});