import { Link } from 'react-router-dom'

const Chip = ({ 
  children, 
  active = false,
  to,
  onClick,
  className = '',
  ...props 
}) => {
  const activeStyles = active 
    ? 'bg-primary-container text-on-primary-container' 
    : 'bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container'

  const style = `inline-flex px-4 py-2 text-xs font-medium uppercase tracking-wider rounded-full transition-all ${activeStyles} ${className}`

  if (to) {
    return <Link to={to} className={style} {...props}>{children}</Link>
  }

  if (onClick) {
    return (
      <button onClick={onClick} className={style} {...props}>
        {children}
      </button>
    )
  }

  return <span className={style} {...props}>{children}</span>
}

export default Chip