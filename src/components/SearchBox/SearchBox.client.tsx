import { IoSearch } from 'react-icons/io5'
import React from 'react'

interface Props {
	value: string;
	onChange: React.ChangeEventHandler<HTMLInputElement> | undefined;
	onSubmit: React.FormEventHandler<HTMLFormElement> | undefined;
}

export const SearchBox: React.FC<Props> = ({value, onChange, onSubmit}) => {
  return (
	<form onSubmit={onSubmit} className="flex relative justify-center items-center h-10">
		<input 
		type="text"
		placeholder="Search"
		value={value}
		onChange={onChange}
		className=" border border-gray-300 rounded-l-md  	focus:outline-none focus:border-blue-500 px-4 py-2 w-[230px] h-full" />
		<button className="rounded-r-md focus:outline-none text-white bg-blue-500 hover:bg-blue-600 px-3 py-[9px] h-full">
			<IoSearch />
		</button>
	</form>
  )
}
