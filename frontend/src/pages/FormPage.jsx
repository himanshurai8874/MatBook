import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from '@tanstack/react-form';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { getFormSchema, submitForm } from '../api/client';
import FormField from '../components/FormField';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert';

export default function FormPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { data: schema, isLoading, error } = useQuery({
    queryKey: ['formSchema'],
    queryFn: getFormSchema,
  });

  const mutation = useMutation({
    mutationFn: submitForm,
    onSuccess: () => {
      setSubmitSuccess(true);
      setSubmitError(null);
      queryClient.invalidateQueries({ queryKey: ['submissions'] });

      setTimeout(() => {
        navigate('/submissions');
      }, 1500);
    },
    onError: (error) => {
      setSubmitError(error);
      setSubmitSuccess(false);
    },
  });

  const form = useForm({
    defaultValues: {},
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      setSubmitSuccess(false);
      mutation.mutate(value);
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px] px-4">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary-500 mx-auto" />
          <p className="mt-4 text-gray-400 text-sm sm:text-base">Loading form...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertTitle>Error Loading Form</AlertTitle>
          <AlertDescription>{error.message}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl sm:text-2xl">{schema.title}</CardTitle>
          <CardDescription className="text-sm sm:text-base">{schema.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {submitSuccess && (
            <Alert variant="success" className="mb-6">
              <AlertTitle>Form submitted successfully!</AlertTitle>
              <AlertDescription>Redirecting to submissions...</AlertDescription>
            </Alert>
          )}

          {submitError && submitError.errors && (
            <Alert variant="destructive" className="mb-6">
              <AlertTitle>Please fix the following errors:</AlertTitle>
              <AlertDescription>
                <ul className="mt-2 list-disc list-inside">
                  {Object.entries(submitError.errors).map(([field, message]) => (
                    <li key={field}>{message}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              e.stopPropagation();
              form.handleSubmit();
            }}
          >
            <div className="space-y-6">
              {schema.fields.map((field) => (
                <form.Field
                  key={field.id}
                  name={field.id}
                  validators={{
                    onChange: ({ value }) => {
                      return validateField(value, field);
                    },
                  }}
                >
                  {(fieldApi) => (
                    <FormField
                      field={field}
                      fieldApi={fieldApi}
                      serverError={submitError?.errors?.[field.id]}
                    />
                  )}
                </form.Field>
              ))}
            </div>

            <div className="mt-8">
              <Button
                type="submit"
                disabled={mutation.isPending}
                className="w-full"
                size="lg"
              >
                {mutation.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                {mutation.isPending ? 'Submitting...' : 'Submit Form'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

function validateField(value, field) {
  // Check required
  if (field.required) {
    if (value === undefined || value === null || value === '' ||
        (Array.isArray(value) && value.length === 0) ||
        (typeof value === 'boolean' && value === false && field.type === 'switch')) {
      return `${field.label} is required`;
    }
  }

  // Skip validation if not required and empty
  if (!field.required && (value === undefined || value === null || value === '')) {
    return undefined;
  }

  if (!field.validation) return undefined;

  const validation = field.validation;

  // Text validations
  if (field.type === 'text' || field.type === 'textarea') {
    if (validation.minLength && value.length < validation.minLength) {
      return `Must be at least ${validation.minLength} characters`;
    }
    if (validation.maxLength && value.length > validation.maxLength) {
      return `Must not exceed ${validation.maxLength} characters`;
    }
    if (validation.regex) {
      const regex = new RegExp(validation.regex);
      if (!regex.test(value)) {
        return 'Invalid format';
      }
    }
  }

  // Number validations
  if (field.type === 'number') {
    const numValue = Number(value);
    if (isNaN(numValue)) {
      return 'Must be a valid number';
    }
    if (validation.min !== undefined && numValue < validation.min) {
      return `Must be at least ${validation.min}`;
    }
    if (validation.max !== undefined && numValue > validation.max) {
      return `Must not exceed ${validation.max}`;
    }
  }

  // Date validations
  if (field.type === 'date') {
    if (validation.minDate) {
      const selectedDate = new Date(value);
      const minDate = new Date(validation.minDate);
      if (selectedDate < minDate) {
        return `Must be ${minDate.toISOString().split('T')[0]} or later`;
      }
    }
  }

  // Multi-select validations
  if (field.type === 'multi-select') {
    if (!Array.isArray(value)) {
      return 'Must be a valid selection';
    }
    if (validation.minSelected && value.length < validation.minSelected) {
      return `Please select at least ${validation.minSelected} option(s)`;
    }
    if (validation.maxSelected && value.length > validation.maxSelected) {
      return `Please select no more than ${validation.maxSelected} option(s)`;
    }
  }

  return undefined;
}