import { redirect } from 'next/navigation';

export default function AuthPage() {
  // Redirigir a la página de inicio de sesión por defecto
  redirect('/auth/signin');
}
