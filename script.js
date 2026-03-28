document.addEventListener('DOMContentLoaded', () => {
    // قاعدة بيانات المنتجات الموحدة للبحث
    const allProducts = [
        { id: 1, name: "ساعة النخبة الذهبية", price: "4,200", img: "https://images.unsplash.com/photo-1547996160-81dfa63595aa?q=80&w=1974", link: "index.html#products" },
        { id: 2, name: "قلم كلاسيكي مطلي بالذهب", price: "950", img: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?q=80&w=2000", link: "index.html#products" },
        { id: 3, name: "خاتم عقيق يماني فاخر", price: "1,500", img: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?q=80&w=2070", link: "index.html#products" },
        { id: 101, name: "بدلة إيطالية فاخرة", price: "4,500", img: "https://images.unsplash.com/photo-1594932224828-b4b059b6f6f9?q=80&w=2070", link: "men.html" },
        { id: 102, name: "ساعة كرونوغراف ملكية", price: "6,500", img: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1974", link: "men.html" },
        { id: 103, name: "طقم أزرار من العقيق", price: "1,200", img: "https://images.unsplash.com/photo-1614164185128-e4ec99c436d7?q=80&w=1974", link: "men.html" },
        { id: 104, name: "عطر العود الكمبودي", price: "2,100", img: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?q=80&w=1974", link: "men.html" },
        { id: 201, name: "قفطان ملكي مرصع", price: "5,800", img: "https://images.unsplash.com/photo-1566174053879-31528523f8ae?q=80&w=1908", link: "women.html" },
        { id: 202, name: "طقم مجوهرات الزمرد", price: "15,000", img: "https://images.unsplash.com/photo-1599643478123-53d71c5b059b?q=80&w=1974", link: "women.html" },
        { id: 203, name: "حقيبة كروكو بلمسات ذهبية", price: "4,100", img: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=1935", link: "women.html" },
        { id: 204, name: "عطر روح الورد الفاخر", price: "1,200", img: "https://images.unsplash.com/photo-1541643600914-78b084683601?q=80&w=2008", link: "women.html" }
    ];

    const searchInput = document.getElementById('main-search');
    const resultsContainer = document.getElementById('search-results-container');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            if (query.length < 2) {
                resultsContainer.style.display = 'none';
                return;
            }

            const matches = allProducts.filter(p => 
                p.name.toLowerCase().includes(query)
            );

            displaySearchResults(matches);
        });

        // إغلاق النتائج عند النقر خارجها
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !resultsContainer.contains(e.target)) {
                resultsContainer.style.display = 'none';
            }
        });
    }

    function displaySearchResults(items) {
        resultsContainer.innerHTML = '';
        if (items.length === 0) {
            resultsContainer.innerHTML = '<div style="padding: 20px; text-align: center;">لا توجد نتائج تطابق بحثك..</div>';
        } else {
            items.forEach(item => {
                const div = document.createElement('a');
                div.href = item.link;
                div.className = 'search-item';
                div.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <div class="search-item-info">
                        <h4>${item.name}</h4>
                        <p>${item.price} ر.س</p>
                    </div>
                `;
                resultsContainer.appendChild(div);
            });
        }
        resultsContainer.style.display = 'block';
    }

    // جلب البيانات من localStorage
    let cart = JSON.parse(localStorage.getItem('luxury_cart')) || [];
    const cartCountElement = document.getElementById('cart-count');

    const updateCartCount = () => {
        if(cartCountElement) {
            cartCountElement.innerText = cart.length;
            // إضافة تأثير نبض عند التحديث لجذب الانتباه
            cartCountElement.classList.remove('pulse');
            void cartCountElement.offsetWidth; // إعادة تفعيل الأنميشن
            cartCountElement.classList.add('pulse');
        }
    };
    updateCartCount();

    // منطق الإضافة للسلة (في الصفحة الرئيسية)
    const addButtons = document.querySelectorAll('.add-to-cart');
    addButtons.forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const product = {
                id: card.dataset.id,
                name: card.querySelector('h3').innerText,
                price: parseInt(card.querySelector('.price').innerText.replace(/[^0-9]/g, '')),
                img: card.querySelector('img').src
            };
            cart.push(product);
            localStorage.setItem('luxury_cart', JSON.stringify(cart));
            updateCartCount();
            button.innerText = "تمت الإضافة";
            setTimeout(() => button.innerText = "إضافة للسلة", 1000);
        });
    });

    // منطق عرض السلة (في صفحة السلة)
    const cartTableBody = document.getElementById('cart-items-body');
    if (cartTableBody) {
        const renderCart = () => {
            if (cart.length === 0) {
                document.getElementById('cart-wrapper').style.display = 'none';
                document.getElementById('cart-empty-msg').style.display = 'block';
                return;
            }

            cartTableBody.innerHTML = '';
            let total = 0;

            cart.forEach((item, index) => {
                total += item.price;
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="product-info">
                        <img src="${item.img}">
                        <span>${item.name}</span>
                    </td>
                    <td>${item.price} ر.س</td>
                    <td><button class="remove-item" data-index="${index}">حذف</button></td>
                `;
                cartTableBody.appendChild(row);
            });

            document.getElementById('cart-total-price').innerText = total;

            // حذف عنصر
            document.querySelectorAll('.remove-item').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = e.target.dataset.index;
                    cart.splice(idx, 1);
                    localStorage.setItem('luxury_cart', JSON.stringify(cart));
                    renderCart();
                    updateCartCount();
                });
            });
        };
        renderCart();
    }

    // مراقب التمرير لتفعيل تأثيرات الظهور
    const observerOptions = {
        threshold: 0.15 // يبدأ التأثير عندما يظهر 15% من العنصر
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // تغيير خلفية الهيدر عند التمرير
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.main-header');
        if (window.scrollY > 50) {
            header.style.background = 'rgba(0, 42, 23, 0.98)';
            header.style.height = '70px';
        } else {
            header.style.background = 'rgba(0, 66, 37, 0.95)';
            header.style.height = '80px';
        }
    });

    // منطق فلترة الأسعار في صفحات الأقسام
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    if (filterButtons.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const range = btn.dataset.range;

                productCards.forEach(card => {
                    const price = parseInt(card.querySelector('.price').innerText.replace(/[^0-9]/g, ''));
                    let isVisible = false;

                    if (range === 'all') isVisible = true;
                    else if (range === '0-2000' && price < 2000) isVisible = true;
                    else if (range === '2000-5000' && price >= 2000 && price <= 5000) isVisible = true;
                    else if (range === '5000-up' && price > 5000) isVisible = true;

                    if (isVisible) {
                        card.style.display = 'block';
                        setTimeout(() => card.classList.add('active'), 10);
                    } else {
                        card.style.display = 'none';
                        card.classList.remove('active');
                    }
                });
            });
        });
    }
});