import { City } from '../../types';
import Link from 'next/link';
import React from 'react';

export const CityRow: React.FC<{ city: City }> = ({ city }) => {
  return (
    <tr className="border-b">
      <td className="p-4">
        <Link href={`/${city.id}`} className="text-blue-500 hover:underline">
           {city.name}
        </Link>
      </td>
      <td className="p-4">{city.country}</td>
      <td className="p-4">{city.timezone}</td>
    </tr>
  );
};

