 const textarea = document.getElementById('contenido');

  textarea.addEventListener('input', () => {
    textarea.style.height = 'auto'; // Reinicia altura
    textarea.style.height = textarea.scrollHeight + 'px'; // Ajusta altura al contenido
  });
