import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import type { User } from '@/types/User';
import UserDetails from '@/components/userDetails/UserDetails';
import { getWithExpiry } from '@/lib/utils';

export default function UserDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = getWithExpiry<User>('selectedUser');

    if (storedUser && storedUser.id && storedUser.id.toString() === id) {
      setUser(storedUser);
      return;
    }

    fetch('/mock/users.json')
      .then((res) => res.json())
      .then((data: User[]) => {
        const foundUser = data.find((u) => u.id.toString() === id);
        setUser(foundUser || null);
      });
  }, [id]);

  if (!user) return console.log('user not found');

  return <UserDetails user={user} />;
}
