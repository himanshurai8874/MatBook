export function validateSubmission(formData, schema) {
  const errors = {};
  schema.fields.forEach(field => {
    const value = formData[field.id];

    // Check required fields
    if (field.required) {
      if (value === undefined || value === null || value === '' ||
          (Array.isArray(value) && value.length === 0) ||
          (typeof value === 'boolean' && value === false && field.type === 'switch')) {
        errors[field.id] = `${field.label} is required`;
        return;
      }
    }

    // Skip validation if field is not required and empty
    if (!field.required && (value === undefined || value === null || value === '')) {
      return;
    }

    // Validate based on field type and validation rules
    if (field.validation) {
      const validation = field.validation;

      // Text validations
      if (field.type === 'text' || field.type === 'textarea') {
        if (validation.minLength && value.length < validation.minLength) {
          errors[field.id] = `${field.label} must be at least ${validation.minLength} characters`;
        }
        if (validation.maxLength && value.length > validation.maxLength) {
          errors[field.id] = `${field.label} must not exceed ${validation.maxLength} characters`;
        }
        if (validation.regex) {
          const regex = new RegExp(validation.regex);
          if (!regex.test(value)) {
            errors[field.id] = `${field.label} format is invalid`;
          }
        }
      }

      // Number validations
      if (field.type === 'number') {
        const numValue = Number(value);
        if (isNaN(numValue)) {
          errors[field.id] = `${field.label} must be a valid number`;
        } else {
          if (validation.min !== undefined && numValue < validation.min) {
            errors[field.id] = `${field.label} must be at least ${validation.min}`;
          }
          if (validation.max !== undefined && numValue > validation.max) {
            errors[field.id] = `${field.label} must not exceed ${validation.max}`;
          }
        }
      }

      // Date validations
      if (field.type === 'date') {
        if (validation.minDate) {
          const selectedDate = new Date(value);
          const minDate = new Date(validation.minDate);
          if (selectedDate < minDate) {
            errors[field.id] = `${field.label} must be ${minDate.toISOString().split('T')[0]} or later`;
          }
        }
      }

      // Multi-select validations
      if (field.type === 'multi-select') {
        if (!Array.isArray(value)) {
          errors[field.id] = `${field.label} must be an array`;
        } else {
          if (validation.minSelected && value.length < validation.minSelected) {
            errors[field.id] = `Please select at least ${validation.minSelected} option(s)`;
          }
          if (validation.maxSelected && value.length > validation.maxSelected) {
            errors[field.id] = `Please select no more than ${validation.maxSelected} option(s)`;
          }
        }
      }
    }

    // Validate select options
    if (field.type === 'select' && value) {
      const validOptions = field.options.map(opt => opt.value);
      if (!validOptions.includes(value)) {
        errors[field.id] = `Invalid option selected for ${field.label}`;
      }
    }

    // Validate multi-select options
    if (field.type === 'multi-select' && Array.isArray(value)) {
      const validOptions = field.options.map(opt => opt.value);
      const invalidOptions = value.filter(v => !validOptions.includes(v));
      if (invalidOptions.length > 0) {
        errors[field.id] = `Invalid options selected for ${field.label}`;
      }
    }
  });

  return errors;
}