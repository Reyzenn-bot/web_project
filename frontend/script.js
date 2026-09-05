document.addEventListener('DOMContentLoaded', function () {
    let unitPrice = 0;
    const qtyInput = document.getElementById('modalQty');
    const priceElement = document.getElementById('modalPrice');

    const detailButtons = document.querySelectorAll('.view-detail-btn');
    
    detailButtons.forEach(button => {
        button.addEventListener('click', function () {
            const title = this.getAttribute('data-title');
            const imgSrc = this.getAttribute('data-img');
            const priceStr = this.getAttribute('data-price') || '$0';
            
            unitPrice = parseFloat(priceStr.replace(/[^0-9.-]+/g, "")) || 0;

            document.getElementById('modalTitle').textContent = title;
            document.getElementById('modalImg').src = imgSrc;
            
            // ១. ព័ត៌មានលម្អិត Specs ទាំង ៤ បន្ទាត់ (CPU, RAM, Storage, GPU)
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

            // ២. Dynamic Label សម្រាប់ Display / OS / Warranty
            const extraLabel = this.getAttribute('data-display-label') || 'Display:';
            const extraVal   = this.getAttribute('data-display-val') || this.getAttribute('data-display') || 'N/A';
            setSpecField('modalDisplay', extraLabel, extraVal);

            // ៣. Recommendations & Free Gifts
            document.getElementById('modalRecommend').textContent = this.getAttribute('data-recommend') || 'Recommended for General Use';
            document.getElementById('modalFreeGift').textContent = this.getAttribute('data-free') || 'N/A';

            qtyInput.value = 1;
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

    // មុខងារបូក/ដក Qty និងគណនាតម្លៃ
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
        let currentQty = parseInt(qtyInput.value) || 1;
        let totalPrice = unitPrice * currentQty;
        priceElement.textContent = '$' + totalPrice.toLocaleString('en-US');
    }
});