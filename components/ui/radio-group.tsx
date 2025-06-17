import React from 'react'

interface RadioGroupProps {
  children: React.ReactNode
  value?: string
  onValueChange?: (value: string) => void
  className?: string
}

interface RadioGroupItemProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string
}

export const RadioGroup: React.FC<RadioGroupProps> = ({ 
  children, 
  value, 
  onValueChange, 
  className = '' 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {React.Children.map(children, child => {
        if (
          React.isValidElement<RadioGroupItemProps>(child) &&
          (child.type === RadioGroupItem || (child.type as any).displayName === RadioGroupItem.displayName)
        ) {
          return React.cloneElement(child, {
            checked: child.props.value === value,
            onChange: () => onValueChange?.(child.props.value)
          });
        }
        return child;
      })}
    </div>
  )
}

export const RadioGroupItem: React.FC<RadioGroupItemProps> = ({ 
  value, 
  children, 
  className = '', 
  ...props 
}) => {
  return (
    <label className={`flex items-center space-x-2 cursor-pointer ${className}`}>
      <input
        type="radio"
        value={value}
        className="text-blue-600 focus:ring-blue-500"
        {...props}
      />
      <span>{children}</span>
    </label>
  )
}

