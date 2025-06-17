import React from 'react'

interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {}

export const Form: React.FC<FormProps> = ({ children, className = '', ...props }) => {
  return (
    <form className={`space-y-4 ${className}`} {...props}>
      {children}
    </form>
  )
}

interface FormFieldProps {
  children: React.ReactNode
  className?: string
}

export const FormField: React.FC<FormFieldProps> = ({ children, className = '' }) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {children}
    </div>
  )
}

// If you have a Label component, import it like this:
import { Label } from './label'

export const FormLabel = Label
export const FormControl: React.FC<FormFieldProps> = ({ children }) => <>{children}</>
export const FormMessage: React.FC<{ children?: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  return children ? (
    <p className={`text-sm text-red-600 ${className}`}>{children}</p>
  ) : null
}