import React, { forwardRef } from 'react';

import { City } from '../../types';
import Link from 'next/link';

export const CityRow = forwardRef<HTMLTableRowElement, { city: City }>((props, ref) => {
  const { city } = props;
  return (
    <tr ref={ref} className="border-b">
      <td className="p-4">
        <Link href={`/cities/${city.id}`} className="text-blue-500 hover:underline">
          {city.name}
        </Link>
      </td>
      <td className="p-4">{city.country}</td>
      <td className="p-4">{city.timezone}</td>
    </tr>
  );
});

CityRow.displayName = 'CityRow';

