'use client';
import React, { useState } from 'react';

const COUNT_OF_SEGMENTS = 15;
const SEGMENTS = Array(COUNT_OF_SEGMENTS)
  .fill(null)
  .map((_, id: number) => ({
    id,
  }));

const COUNT_PER_SEGMENT = 3;
const SUBSEGMENTS = Array(COUNT_PER_SEGMENT)
  .fill(null)
  .map((_, id: number) => ({
    id,
  }));

const Measure = () => {
  const [scroll, setScroll] = useState<number>(0);

  const horizontalScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    setScroll((prevState) => prevState + e.deltaY);
  };

  return (
    <div
      onWheel={horizontalScroll}
      className='flex w-5/6 flex-col items-center overflow-hidden bg-[#333333] p-4 text-white'
    >
      <div className='flex min-w-full justify-center'>
        {SEGMENTS.map((segment) => (
          <div
            key={segment.id}
            style={{ width: 100 + scroll / 10 }}
            className='flex items-end justify-between border-l-2 border-[#d3d3d3] px-1'
          >
            <span className='px-1 text-sm'>{segment.id}</span>
            <div className='flex w-full justify-between'>
              {SUBSEGMENTS.map((subsegment) => (
                <div
                  key={segment.id.toString() + subsegment.id.toString()}
                  className='h-2 w-[2px] bg-[#d3d3d3]'
                ></div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className='h-[2px] w-[110%] bg-[#d3d3d3]' />
    </div>
  );
};

export default Measure;
