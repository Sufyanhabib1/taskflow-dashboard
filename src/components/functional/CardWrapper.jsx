export default function CardWrapper({ children, className = '', ...props }) {
  return <section className={`panel ${className}`} {...props}>{children}</section>;
}
