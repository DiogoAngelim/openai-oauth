import { useState } from 'react';

export default function OrgManagement() {
  const [members, setMembers] = useState([
    { email: 'owner@example.com', role: 'OWNER' },
    { email: 'admin@example.com', role: 'ADMIN' },
    { email: 'user@example.com', role: 'USER' },
  ]);
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-white">
      <h1 className="text-xl font-bold mb-4">Organization Members</h1>
      <ul className="w-full max-w-md">
        {members.map((m, i) => (
          <li key={i} className="flex justify-between p-2 border-b">
            <span>{m.email}</span>
            <span className="font-mono text-xs bg-gray-200 rounded px-2">{m.role}</span>
          </li>
        ))}
      </ul>
    </main>
  );
}
