document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const cardRect = card.getBoundingClientRect();
             const mouseX = e.clientX - cardRect.left;
             const mouseY = e.clientY - cardRect.top;
            card.style.setProperty('--mouse-x', `${mouseX}px`);
           card.style.setProperty('--mouse-y', `${mouseY}px`);
        });
    });

    const filterButtons = document.querySelectorAll('.filter-button');
    const allProducts = document.querySelectorAll('.product-card');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
              filterButtons.forEach(btn => btn.classList.remove('active'));
             button.classList.add('active');
            const category = button.getAttribute('data-category');
            allProducts.forEach(product => {
               if(category === 'all') {
                 product.style.display = 'flex';
                 return
               }
                const productCategory = product.getAttribute('data-category');
                if (productCategory === category) {
                   product.style.display = 'flex';
                 } else {
                   product.style.display = 'none';
                }
            });
        });
    });
});