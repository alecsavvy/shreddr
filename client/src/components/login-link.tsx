import { Link } from '@tanstack/react-router'
import { setAuthRedirect } from '@/lib/auth-redirect'

type LoginLinkProps = Omit<React.ComponentProps<typeof Link>, 'to' | 'onClick'> & {
  /** Optional custom redirect path. Defaults to current pathname. */
  redirectTo?: string
}

export function LoginLink({ redirectTo, children, ...props }: LoginLinkProps) {
  const handleClick = () => {
    const path = redirectTo ?? window.location.pathname
    setAuthRedirect(path)
  }

  return (
    <Link to="/login" onClick={handleClick} {...props}>
      {children}
    </Link>
  )
}
