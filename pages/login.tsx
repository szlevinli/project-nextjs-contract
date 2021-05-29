import Link from 'next/link';

export default function Login() {
  return (
    <Link href="/api/auth/login">
      <a>Login</a>
    </Link>
  );
}
