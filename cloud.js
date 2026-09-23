document.querySelectorAll('input[type="range"]').forEach(slider => {
	const updateFill = () => {
		const min = +slider.min || 0;
		const max = +slider.max || 100;
		const val = +slider.value;
		const percent = ((val - min) / (max - min)) * 100;
		slider.style.setProperty('--fill', percent + '%');
	};
		slider.addEventListener('input', updateFill);
		updateFill(); // reset
	});
	  
    document.addEventListener('DOMContentLoaded', () => {
      // Elements Slider
      const cpuSlider = document.getElementById('cpu-slider');
      const ramSlider = document.getElementById('ram-slider');
      const storageSlider = document.getElementById('storage-slider');
      const periodSlider = document.getElementById('period-slider');

      // Elements Value Badge
      const valCpu = document.getElementById('val-cpu');
      const valRam = document.getElementById('val-ram');
      const valStorage = document.getElementById('val-storage');
      const valPeriod = document.getElementById('val-period');

      // Elements Table
      const tdOs = document.getElementById('td-os');
      const tdCpuType = document.getElementById('td-cputype');
      const tdCpu = document.getElementById('td-cpu');
      const tdRam = document.getElementById('td-ram');
      const tdDisk = document.getElementById('td-disk');
      const tdPeriod = document.getElementById('td-period');

      // Elements Total Price
      const totalPrice = document.getElementById('total-price');

      // Elements Radio Buttons
      const osRadios = document.querySelectorAll('input[name="os"]');
      const cpuTypes = document.querySelectorAll('input[name="cputype"]');

      // Function Update UI and Table Data
      function updateUIAndTable() {
        valCpu.innerText = cpuSlider.value + ' Core';
        valRam.innerText = ramSlider.value + ' GB';
        valStorage.innerText = storageSlider.value + ' GB';
        valPeriod.innerText = periodSlider.value + ' Bulan';

        const selectedOs = document.querySelector('input[name="os"]:checked');
        const selectedCpuType = document.querySelector('input[name="cputype"]:checked');

        tdOs.innerText = selectedOs ? (selectedOs.value.charAt(0).toUpperCase() + selectedOs.value.slice(1)) : '-';
        tdCpuType.innerText = selectedCpuType ? (selectedCpuType.value === 'shared' ? 'Shared' : 'Dedicated') : '-';
        tdCpu.innerText = cpuSlider.value + ' Core';
        tdRam.innerText = ramSlider.value + ' GB';
        tdDisk.innerText = storageSlider.value + ' GB';
        tdPeriod.innerText = periodSlider.value + ' Bulan';
      }

      // Function Calculate Total Order Price
      function updateOrderTotal() {
        updateUIAndTable();

        let cpu = parseInt(cpuSlider.value);
        let ram = parseInt(ramSlider.value);
        let storage = parseInt(storageSlider.value);
        let period = parseInt(periodSlider.value);

        const priceCpuPerCore = 3000;
        const priceRamPerGB = 3000;
        const priceStoragePerGB = 2000;

        let cpuMultiplier = priceCpuPerCore;
        const selectedCpuType = document.querySelector('input[name="cputype"]:checked');
        if (selectedCpuType && selectedCpuType.value === 'dedicated') {
          cpuMultiplier = 50000;
        }

        let monthlyTotal = (cpu * cpuMultiplier) + (ram * priceRamPerGB) + (storage * priceStoragePerGB);

        const selectedOS = document.querySelector('input[name="os"]:checked');
        if (selectedOS && selectedOS.value.includes('windows')) {
          monthlyTotal += 150000;
        }

        let finalTotal = monthlyTotal * period;
        totalPrice.innerText = finalTotal.toLocaleString('id-ID');
      }

      // Add Listener to all Sliders
      const allSliders = [cpuSlider, ramSlider, storageSlider, periodSlider];
      allSliders.forEach(slider => {
        slider.addEventListener('input', () => {
          updateOrderTotal();
        });
      });

      // Add Listener to Radio Buttons
      cpuTypes.forEach(radio => radio.addEventListener('change', updateOrderTotal));
      osRadios.forEach(radio => radio.addEventListener('change', updateOrderTotal));

      // Initial Calculation
      updateOrderTotal();
    
      const pricingToggle = document.getElementById('cpu-pricing-toggle');
      const labelShared = document.getElementById('label-shared');
      const labelDedicated = document.getElementById('label-dedicated');
      const priceVals = document.querySelectorAll('.price-val');

      if (pricingToggle) {
        pricingToggle.addEventListener('change', function() {
          if (this.checked) {
            labelShared.classList.remove('active');
            labelDedicated.classList.add('active');
            priceVals.forEach(el => el.innerText = el.getAttribute('data-dedicated'));
          } else {
            labelDedicated.classList.remove('active');
            labelShared.classList.add('active');
            priceVals.forEach(el => el.innerText = el.getAttribute('data-shared'));
          }
        });
      }

      window.selectPackageFromPricing = function(packName) {
        const isDedicated = pricingToggle.checked;
        const cpuValue = isDedicated ? 'dedicated' : 'shared';

        const cpuRadio = document.querySelector(`input[name="cputype"][value="${cpuValue}"]`);
        if (cpuRadio) {
          cpuRadio.checked = true;
          cpuRadio.dispatchEvent(new Event('change')); 
        }
      };
    });
