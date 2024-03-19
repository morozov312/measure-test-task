'use client';
import React, { useCallback, useState } from 'react';

import {
  COUNT_SEGMENTS,
  COUNT_SUBSEGMENTS,
  MAX_SEGMENT_WIDTH,
  MIN_SEGMENT_WIDTH,
} from './constants';
// import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { debounce } from 'next/dist/server/utils';

const SEGMENTS = Array(COUNT_SEGMENTS)
  .fill(null)
  .map((_, id: number) => ({
    id,
  }));

const SUBSEGMENTS = Array(COUNT_SUBSEGMENTS)
  .fill(null)
  .map((_, id: number) => ({
    id,
  }));

const Measure = () => {
  const [scroll, setScroll] = useState<number>(MIN_SEGMENT_WIDTH);

  const throttleSetScroll = useCallback(
    throttle((value: number) => {
      setScroll(value);
    }, 20),
    [],
  );

  const horizontalScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    const currentState = scroll + e.deltaY;
    throttleSetScroll(
      currentState < MIN_SEGMENT_WIDTH || currentState > MAX_SEGMENT_WIDTH
        ? scroll
        : currentState,
    );
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
            style={{ width: scroll }}
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
