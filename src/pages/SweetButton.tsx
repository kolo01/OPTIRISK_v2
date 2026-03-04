import * as React from 'react';

interface SweetButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const SweetButton: React.FC<SweetButtonProps> = ({ 
    children, 
    className = '', 
    ...props 
}) => {
    // Styles de base obligatoires
    const baseStyles = 'px-4 py-2 rounded-md font-medium transition-colors duration-200';
    
    return (
        <button 
            className={`${baseStyles} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};

export default SweetButton;