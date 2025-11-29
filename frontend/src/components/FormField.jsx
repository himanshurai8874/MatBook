import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Switch } from "./ui/switch";
import { Checkbox } from "./ui/checkbox";
import { cn } from "../lib/utils";

export default function FormField({ field, fieldApi, serverError }) {
  const { handleChange, handleBlur, state } = fieldApi;
  const value = state.value;
  const error = state.meta.errors[0] || serverError;

  return (
    <div className="space-y-2">
      <Label htmlFor={field.id} className={cn(error && "text-red-600")}>
        {field.label}
        {field.required && <span className="text-red-500 ml-1">*</span>}
      </Label>

      {field.type === 'text' && (
        <Input
          id={field.id}
          type="text"
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      )}

      {field.type === 'number' && (
        <Input
          id={field.id}
          type="number"
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      )}

      {field.type === 'date' && (
        <Input
          id={field.id}
          type="date"
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          min={field.validation?.minDate}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      )}

      {field.type === 'textarea' && (
        <Textarea
          id={field.id}
          placeholder={field.placeholder}
          value={value || ''}
          onChange={(e) => handleChange(e.target.value)}
          onBlur={handleBlur}
          rows={4}
          className={cn(error && "border-red-500 focus-visible:ring-red-500")}
        />
      )}

      {field.type === 'select' && (
        <Select value={value || ''} onValueChange={handleChange}>
          <SelectTrigger className={cn(error && "border-red-500 focus:ring-red-500")}>
            <SelectValue placeholder={field.placeholder || 'Select an option'} />
          </SelectTrigger>
          <SelectContent>
            {field.options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {field.type === 'multi-select' && (
        <div className="space-y-3 pt-2">
          {field.options.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <Checkbox
                id={`${field.id}-${option.value}`}
                checked={Array.isArray(value) && value.includes(option.value)}
                onChange={(e) => {
                  const currentValue = Array.isArray(value) ? value : [];
                  if (e.target.checked) {
                    handleChange([...currentValue, option.value]);
                  } else {
                    handleChange(currentValue.filter((v) => v !== option.value));
                  }
                }}
              />
              <Label
                htmlFor={`${field.id}-${option.value}`}
                className="text-sm font-normal cursor-pointer"
              >
                {option.label}
              </Label>
            </div>
          ))}
        </div>
      )}

      {field.type === 'switch' && (
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id={field.id}
            checked={value || false}
            onCheckedChange={handleChange}
          />
        </div>
      )}

      {error && (
        <p className="text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}