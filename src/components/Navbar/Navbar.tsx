import { MdMyLocation, MdOutlineLocationOn, MdWbSunny } from 'react-icons/md'

import React from 'react'
import { SearchBox } from '../SearchBox'

export const Navbar = () => {
  const handleSearch = (value: string) => {
	console.log(value);
  }

  const handleSubmit = () => {
	handleSearch('value');
  }
  return (
	<nav className="shadow-sm sticky top-0 left-0 z-50 bg-white">
		<div className="h-[80px] w-full flex justify-between items-center max-w-7xl px-3 mx-auto">
			<p className="flex justify-center items-center gap-2">
				<h2>Weather</h2>
				<MdWbSunny size={30} className="text-3xl mt-1 text-yellow-300" />
			</p>
			<section className="flex gap-2 items-center">
				<MdMyLocation size={30} className="text-2xl  text-gray-400 hover:opacity-80 cursor-pointer" />
				<MdOutlineLocationOn size={30} className="text-3xl" />
				<p className="text-slate-900/80 text-sm">India</p>
				{/* <div><SearchBox value={''} onChange={undefined} onSubmit={handleSubmit}/></div> */}
			</section>
		</div>
	</nav>
  )
}
