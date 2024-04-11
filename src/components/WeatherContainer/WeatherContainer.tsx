import React, { HTMLAttributes } from 'react'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  // can extend this interface if i have other props
}

export const WeatherContainer: React.FC<Props> = ({className, ...props}) => {
  return (
	<div 
		{...props} 
		className={`flex w-full bg-white border rounded-xl py-4 shadow-sm ${className}`}
	/>
  )
}
