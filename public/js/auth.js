document.addEventListener('DOMContentLoaded', function () {
    const authModal = document.getElementById('auth-modal');
    const openLoginButtons = document.querySelectorAll('#open-login, #open-login-top');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalScreen = document.getElementById('modal-close-bg');
    const guestCloseBtn = document.getElementById('close-modal-guest'); // Nút đóng ở dưới cùng
    
    const tabs = document.querySelectorAll('.tab');
    const forms = document.querySelectorAll('.auth-form');
    
    // Nút hiển thị form email
    const showEmailBtn = document.getElementById('show-email-form');
    const emailWrapper = document.getElementById('email-forms-wrapper');

    const openModal = () => {
        if (authModal) {
            authModal.classList.add('active');
            authModal.style.display = 'flex'; 
        }
    };

    const closeModalFn = (e) => {
        if (e) e.preventDefault();
        if (authModal) {
            authModal.classList.remove('active');
            authModal.style.display = 'none';
        }
    };

    openLoginButtons.forEach(button => button.addEventListener('click', (e) => { e.preventDefault(); openModal(); }));
    
    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModalFn);
    if (modalScreen) modalScreen.addEventListener('click', closeModalFn);
    if (guestCloseBtn) guestCloseBtn.addEventListener('click', closeModalFn);

    // Xử lý mở form ẩn
    if (showEmailBtn) {
        showEmailBtn.addEventListener('click', () => {
            emailWrapper.style.display = emailWrapper.style.display === 'none' ? 'block' : 'none';
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            const target = this.getAttribute('data-target');
            tabs.forEach(t => t.classList.remove('active'));
            forms.forEach(f => {
                f.classList.remove('active');
                f.style.display = 'none'; 
            });
            this.classList.add('active');
            const targetForm = document.getElementById(`${target}-form`);
            if (targetForm) {
                targetForm.classList.add('active');
                targetForm.style.display = 'block'; 
            }
        });
    });
});