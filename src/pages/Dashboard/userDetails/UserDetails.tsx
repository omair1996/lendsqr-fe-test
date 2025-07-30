import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { User } from '@/types/User';
import UserDetails from '@/components/userDetails/UserDetails';

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    fetch('/mock/users.json')
      .then((res) => res.json())
      .then((data: User[]) => {
        const foundUser = data.find((u) => u.id.toString() === id);
        setUser(foundUser || null);
      });
  }, [id]);

  if (!user) return <p>User not found...</p>;

  return <UserDetails user={user} />;
}
