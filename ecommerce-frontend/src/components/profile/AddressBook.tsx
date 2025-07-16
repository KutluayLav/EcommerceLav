import type { Address } from './types';

type AddressBookProps = {
  addresses?: Address[];
};

export function AddressBook({ addresses }: AddressBookProps) {
  if (!addresses || addresses.length === 0) return null;

  return (
    <section className="mt-10">
      <h2 className="text-xl font-semibold mb-4">Address Book</h2>
      <ul className="space-y-3 max-h-48 overflow-y-auto border rounded-md p-4 bg-gray-50">
        {addresses.map((addr) => (
          <li key={addr.id} className="border-b last:border-b-0 pb-2">
            <p className="font-semibold">{addr.label}</p>
            <p className="text-sm">
              {addr.addressLine1}
              {addr.addressLine2 && `, ${addr.addressLine2}`}
            </p>
            <p className="text-sm">
              {addr.city}, {addr.state ? addr.state + ', ' : ''}
              {addr.zipCode}
            </p>
            <p className="text-sm">{addr.country}</p>
            {addr.phone && <p className="text-sm">Phone: {addr.phone}</p>}
          </li>
        ))}
      </ul>
    </section>
  );
}
