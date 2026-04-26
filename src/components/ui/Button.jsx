import { Link } from 'react-router-dom'

const Button = ({ 
  children, 
  variant = 'primary',
  to, 
  href,
  className = '',
  ...props 
}) => {
  const baseStyles = 'btn-premium'
  
  const variants = {
    primary: 'bg-primary text-white hover:bg-opacity-90',
    secondary: 'border border-primary text-primary hover:bg-primary hover:text-white',
    outline: 'border border-outline text-on-surface hover:border-primary hover:text-primary',
    ghost: 'text-on-surface-variant hover:text-primary',
  }

  const style = `${baseStyles} ${variants[variant]} ${className}`

  const content = (
    <>
      <span className="relative z-10">{children}</span>
    </>
  )

  if (to) {
    return <Link to={to} className={style} {...props}>{content}</Link>
  }
  
  if (href) {
    return <a href={href} className={style} target="_blank" rel="noopener noreferrer" {...props}>{content}</a>
  }

  return <button className={style} {...props}>{content}</button>
}

export default Button