export const formSchema = {
  title: "Employee Onboarding Form",
  description: "Please fill out this form to complete your onboarding process.",
  fields: [
    {
      id: "fullName",
      type: "text",
      label: "Full Name",
      placeholder: "Enter your full name",
      required: true,
      validation: {
        minLength: 2,
        maxLength: 50
      }
    },
    {
      id: "email",
      type: "text",
      label: "Email Address",
      placeholder: "you@example.com",
      required: true,
      validation: {
        regex: "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
      }
    },
    {
      id: "age",
      type: "number",
      label: "Age",
      placeholder: "Enter your age",
      required: true,
      validation: {
        min: 18,
        max: 65
      }
    },
    {
      id: "department",
      type: "select",
      label: "Department",
      placeholder: "Select your department",
      required: true,
      options: [
        { value: "engineering", label: "Engineering" },
        { value: "marketing", label: "Marketing" },
        { value: "sales", label: "Sales" },
        { value: "hr", label: "Human Resources" },
        { value: "finance", label: "Finance" }
      ]
    },
    {
      id: "skills",
      type: "multi-select",
      label: "Skills",
      placeholder: "Select your skills",
      required: true,
      options: [
        { value: "javascript", label: "JavaScript" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
        { value: "react", label: "React" },
        { value: "nodejs", label: "Node.js" },
        { value: "sql", label: "SQL" },
        { value: "aws", label: "AWS" },
        { value: "docker", label: "Docker" }
      ],
      validation: {
        minSelected: 1,
        maxSelected: 5
      }
    },
    {
      id: "startDate",
      type: "date",
      label: "Start Date",
      placeholder: "Select your start date",
      required: true,
      validation: {
        minDate: new Date().toISOString().split('T')[0]
      }
    },
    {
      id: "bio",
      type: "textarea",
      label: "Bio",
      placeholder: "Tell us about yourself",
      required: false,
      validation: {
        maxLength: 500
      }
    },
    {
      id: "agreeToTerms",
      type: "switch",
      label: "I agree to the terms and conditions",
      required: true
    }
  ]
};