document.addEventListener('DOMContentLoaded', function () {
    let unitPrice = 0; // រក្សាតម្លៃដើមនៃ Item នីមួយៗ
    const qtyInput = document.getElementById('modalQty');
    const priceElement = document.getElementById('modalPrice');
    const closeBtn = document.querySelector('#productDetailModal .btn-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', function () {
            const modalElement = document.getElementById('productDetailModal');
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            if (modalInstance) {
                modalInstance.hide();
            }
        });
    }

    // ១. បាញ់ Data ចូល Modal ពេលចុច View Detail
    const detailButtons = document.querySelectorAll('.view-detail-btn');

    detailButtons.forEach(button => {
        button.addEventListener('click', function () {
            // ចាប់យកទិន្នន័យពី Button
            const title = this.getAttribute('data-title');
            const imgSrc = this.getAttribute('data-img');
            const priceStr = this.getAttribute('data-price') || '$0';

            // បម្លែងតម្លៃពី String "$1,299" ទៅជា Number 1299 ដើម្បីយកទៅគុណ
            unitPrice = parseFloat(priceStr.replace(/[^0-9.-]+/g, "")) || 0;

            // បំពេញ Data ចូល Modal
            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalImg').src = imgSrc;
            document.getElementById('modalCpu').textContent = this.getAttribute('data-cpu');
            document.getElementById('modalRam').textContent = this.getAttribute('data-ram');
            document.getElementById('modalStorage').textContent = this.getAttribute('data-storage');
            document.getElementById('modalGpu').textContent = this.getAttribute('data-gpu') || 'N/A';
            document.getElementById('modalDisplay').textContent = this.getAttribute('data-display') || 'N/A';
            document.getElementById('modalRecommend').textContent = this.getAttribute('data-recommend') || 'Recommended for General Use';
            document.getElementById('modalFreeGift').textContent = this.getAttribute('data-free') || 'BAG , MOUSE WIRELESS';

            // Reset Qty មកត្រឹម 1 វិញ និងបង្ហាញតម្លៃដើម
            qtyInput.value = 1;
            updateTotalPrice();
        });
    });

    // ២. មុខងារបូក/ដក Qty និងគុណគណនាតម្លៃសរុប
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

    // Function គណនាតម្លៃ (តម្លៃដើម x ចំនួន Qty)
    function updateTotalPrice() {
        let currentQty = parseInt(qtyInput.value) || 1;
        let totalPrice = unitPrice * currentQty;

        // បង្ហាញតម្លៃដែលមាន Comma (ឧទាហរណ៍៖ $2,598)
        priceElement.textContent = '$' + totalPrice.toLocaleString('en-US');
    }
});