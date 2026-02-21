// Biodata form validation
document.addEventListener('DOMContentLoaded', function() {
	// Clear all input values for a fresh form
	document.querySelectorAll('.input-field').forEach(input => {
		if (input.tagName === 'SELECT') {
			input.selectedIndex = 0;
		} else {
			input.value = '';
		}
	});
	// Uncheck radio and checkbox
	document.querySelectorAll('input[type="radio"], input[type="checkbox"]').forEach(input => {
		input.checked = false;
	});
	// Reset photo preview
	const preview = document.getElementById('preview');
	if (preview) preview.src = 'default.png';
	// ...existing code...
	// Select all input fields
	const inputFields = document.querySelectorAll('.input-field');
	const rows = document.querySelectorAll('.row');
	const genderInputs = document.querySelectorAll('input[name="gender"]');
	const hobbiesInputs = document.querySelectorAll('input[type="checkbox"]');
	const photoInput = document.querySelector('input[type="file"]');

	// Add error message span to each row
	rows.forEach(row => {
		if (!row.querySelector('.error-message')) {
			const errorSpan = document.createElement('span');
			errorSpan.className = 'error-message';
			errorSpan.style.color = 'red';
			errorSpan.style.fontSize = '13px';
			errorSpan.style.marginLeft = '10px';
			row.appendChild(errorSpan);
		}
	});

	// Patterns
	const contactPattern = /^01[3-9]\d{8}$/;

	// Validation for each field
	function validateField(input, row) {
		const errorSpan = row.querySelector('.error-message');
		errorSpan.textContent = '';
		const placeholder = input.getAttribute('placeholder') || '';
		const value = input.value.trim();
		// Name validation
		if (placeholder === 'Enter name') {
			if (value === '') {
				errorSpan.textContent = 'Name is required.';
				return false;
			}
			if (/^\d+$/.test(value)) {
				errorSpan.textContent = 'Name cannot be numeric.';
				return false;
			}
			if (/^\d/.test(value)) {
				errorSpan.textContent = 'Name should not start with a number.';
				return false;
			}
			if (!/^[A-Za-z\s'-]+$/.test(value)) {
				errorSpan.textContent = 'Name can only contain letters, spaces, apostrophes, and hyphens.';
				return false;
			}
		}
		// Contact validation
		else if (placeholder === 'Enter contact number') {
			if (value === '') {
				errorSpan.textContent = 'Contact number is required.';
				return false;
			}
			if (!contactPattern.test(value)) {
				errorSpan.textContent = 'Enter a valid Bangladeshi contact number (e.g. 017XXXXXXXX).';
				return false;
			}
		}
		// Birthdate validation (text input)
		else if (input.classList.contains('birthdate-input')) {
			if (!value) {
				errorSpan.textContent = 'Birthdate is required.';
				return false;
			}
			if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
				errorSpan.textContent = 'Birthdate must be in YYYY-MM-DD format.';
				return false;
			}
			// Check valid date
			const dateParts = value.split('-');
			const year = parseInt(dateParts[0], 10);
			const month = parseInt(dateParts[1], 10);
			const day = parseInt(dateParts[2], 10);
			const dateObj = new Date(value);
			if (
				dateObj.getFullYear() !== year ||
				dateObj.getMonth() + 1 !== month ||
				dateObj.getDate() !== day
			) {
				errorSpan.textContent = 'Birthdate is not a valid date.';
				return false;
			}
		}
		// Blood group validation
		else if (input.tagName === 'SELECT') {
			if (!value) {
				errorSpan.textContent = 'Select a blood group.';
				return false;
			}
			if (!['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].includes(value)) {
				errorSpan.textContent = 'Select a valid blood group.';
				return false;
			}
		}
		// Other text fields
		else if (input.type === 'text') {
			if (value === '') {
				errorSpan.textContent = 'This field is required.';
				return false;
			}
			if (row.innerText.includes('Nationality') && !/^[A-Za-z\s]+$/.test(value)) {
				errorSpan.textContent = 'Nationality can only contain letters and spaces.';
				return false;
			}
			if (row.innerText.includes('Religion') && !/^[A-Za-z\s]+$/.test(value)) {
				errorSpan.textContent = 'Religion can only contain letters and spaces.';
				return false;
			}
			if (row.innerText.includes('Father Name') && !/^[A-Za-z\s'-]+$/.test(value)) {
				errorSpan.textContent = 'Father name can only contain letters, spaces, apostrophes, and hyphens.';
				return false;
			}
			if (row.innerText.includes('Mother Name') && !/^[A-Za-z\s'-]+$/.test(value)) {
				errorSpan.textContent = 'Mother name can only contain letters, spaces, apostrophes, and hyphens.';
				return false;
			}
		}
		return true;
	}

	// Gender validation
	function validateGender() {
		const genderRow = genderInputs[0].closest('.row');
		const errorSpan = genderRow.querySelector('.error-message');
		errorSpan.textContent = '';
		if (![...genderInputs].some(input => input.checked)) {
			errorSpan.textContent = 'Select gender.';
			return false;
		}
		return true;
	}

	// Hobbies validation
	function validateHobbies() {
		const hobbiesRow = hobbiesInputs[0].closest('.row');
		const errorSpan = hobbiesRow.querySelector('.error-message');
		errorSpan.textContent = '';
		if (![...hobbiesInputs].some(input => input.checked)) {
			errorSpan.textContent = 'Select at least one hobby.';
			return false;
		}
		return true;
	}

	// Photo validation (optional)
	function validatePhoto() {
		if (!photoInput.files.length) return true;
		const file = photoInput.files[0];
		if (!file.type.startsWith('image/')) {
			alert('Upload a valid image file.');
			return false;
		}
		return true;
	}

	// Validate all fields
	function validateForm() {
		let valid = true;
		inputFields.forEach(input => {
			const row = input.closest('.row');
			if (!validateField(input, row)) valid = false;
		});
		if (!validateGender()) valid = false;
		if (!validateHobbies()) valid = false;
		if (!validatePhoto()) valid = false;
		return valid;
	}

	// Submit button handler
	const submitBtn = document.querySelector('.submit-btn');
	if (submitBtn) {
		submitBtn.addEventListener('click', function(e) {
			e.preventDefault();
			if (validateForm()) {
				alert('Form submitted successfully!');
			}
		});
	}

	// Real-time validation
	inputFields.forEach(input => {
		input.addEventListener('blur', function() {
			const row = input.closest('.row');
			validateField(input, row);
		});
	});
});
