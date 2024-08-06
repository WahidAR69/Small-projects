document.querySelectorAll('.toggle-content').forEach(function(button) {
    button.addEventListener('click', function() {
        var content = this.closest('li').querySelector('.content');
        content.style.display = content.style.display === 'none' ? 'block' : 'none';
        this.classList.toggle('active');
    });
});

