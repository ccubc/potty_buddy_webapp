import { useState } from 'react';
import Head from 'next/head';
import UserRegistration from '../components/UserRegistration';
import MainDashboard from '../components/MainDashboard';

interface User {
  id: number;
  username: string;
}

export default function Home() {
  const [user, setUser] = useState<User | null>(null);

  const handleUserCreated = (userId: number, username: string) => {
    setUser({ id: userId, username });
  };

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      setUser(null);
      // Optional: You could add a toast notification here
      console.log('User logged out successfully');
    }
  };

  return (
    <>
      <Head>
        <title>Potty Buddy - Track Your Child's Progress</title>
        <meta name="description" content="Simple potty training tracker for parents" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        {user ? (
          <MainDashboard userId={user.id} username={user.username} onLogout={handleLogout} />
        ) : (
          <UserRegistration onUserCreated={handleUserCreated} />
        )}
      </main>
    </>
  );
} 