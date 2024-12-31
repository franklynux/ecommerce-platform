export const Button = ({ 
    children, 
    variant = 'primary', 
    className = '', 
    ...props 
  }) => {
    const baseClasses = 'px-4 py-2 rounded-md font-medium transition-colors';
    const variants = {
      primary: 'bg-blue-600 text-white hover:bg-blue-700',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
    };
  
    return (
      <button 
        className={`${baseClasses} ${variants[variant]} ${className}`} 
        {...props}
      >
        {children}
      </button>
    );
  };