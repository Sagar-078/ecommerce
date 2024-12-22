"use client";
import React, { useState, useEffect } from 'react';

const SideBar = ({ sidebarData, applyFilters, resetFilters }: any) => {
  const [selectedFilters, setSelectedFilters] = useState<any>({});

  // Initialize selected filters based on sidebarData
  useEffect(() => {
    const initialFilters = sidebarData.reduce((acc: any, item: any) => {
      acc[item.key] = [];
      return acc;
    }, {});
    setSelectedFilters(initialFilters);
  }, [sidebarData]);

  // Handle checkbox change for a specific key and value
  const handleCheckboxChange = (key: string, value: string) => {
    setSelectedFilters((prevFilters: any) => {
      const isSelected = prevFilters[key]?.includes(value);
      const updatedValues = isSelected
        ? prevFilters[key].filter((v: string) => v !== value)
        : [...prevFilters[key], value];
      return { ...prevFilters, [key]: updatedValues };
    });
  };

  return (
    <div className='w-[20%] h-full bg-white p-6 rounded-md flex flex-col'>
      <h1 className='font-semibold text-xl mb-6'>Filters</h1>
      
      <div className='flex flex-col gap-4 mb-4'>
        <button
          onClick={() => applyFilters(selectedFilters)}
          className='flex w-full items-center justify-center bg-red-400 rounded-sm py-2'
        >
          APPLY FILTERS
        </button>
        <button
          onClick={() => {
            resetFilters();
            setSelectedFilters(
              sidebarData.reduce((acc: any, item: any) => {
                acc[item.key] = [];
                return acc;
              }, {})
            );
          }}
          className='flex w-full items-center justify-center bg-gray-600 rounded-sm py-2'
        >
          RESET FILTERS
        </button>
      </div>

      <div className='flex flex-col overflow-y-scroll gap-6 sidebar'>
        {sidebarData.map((data: any, i: number) => (
          <div key={i} className='flex flex-col gap-3'>
            <div className='text-black text-lg'>{data?.key}</div>
            <div>
              {data.values.map((value: any, i: number) => (
                <div key={i} className='flex gap-3'>
                  <input
                    type='checkbox'
                    value={value}
                    checked={selectedFilters[data.key]?.includes(value) || false}
                    onChange={() => handleCheckboxChange(data.key, value)}
                  />
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SideBar;