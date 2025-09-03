const comunasPorRegion = {
    Ari: ['Arica', 'Camarones', 'Putre'],
    Tar: ['Iquique', 'Alto Hospicio'],
    
  };

  const regionSelect = document.getElementById('region');
  const comunaSelect = document.getElementById('comuna');

  regionSelect.addEventListener('change', () => {
    const regionSeleccionada = regionSelect.value;
    comunaSelect.innerHTML = '<option value="">--Selecciona tu Comuna--</option>';

    if (regionSeleccionada && comunasPorRegion[regionSeleccionada]) {
      comunasPorRegion[regionSeleccionada].forEach(comuna => {
        const option = document.createElement('option');
        option.value = comuna.toLowerCase().replace(/\s+/g, '-');
        option.textContent = comuna;
        comunaSelect.appendChild(option);
      });
    }
  });