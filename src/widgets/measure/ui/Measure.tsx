'use client';
import clsx from 'clsx';
import throttle from 'lodash.throttle';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  COUNT_SEGMENTS,
  COUNT_SUBSEGMENTS,
  MAX_SEGMENT_WIDTH,
  MIN_SEGMENT_WIDTH,
} from './constants';

const SEGMENTS = Array(COUNT_SEGMENTS)
  .fill(null)
  .map((_, id: number) => ({
    id,
  }));

const Measure = () => {
  const [scroll, setScroll] = useState<number>(MIN_SEGMENT_WIDTH);
  const [currentCountSubsegments, setCurrentCountSubsegments] =
    useState<number>(COUNT_SUBSEGMENTS);

  const throttleSetCountOfSegments = useCallback(
    throttle((value: number) => {
      setCurrentCountSubsegments(value);
    }, 100),
    [],
  );

  useEffect(() => {
    const hundreds = Math.ceil(scroll / 100);
    if (COUNT_SUBSEGMENTS * hundreds !== currentCountSubsegments) {
      throttleSetCountOfSegments(COUNT_SUBSEGMENTS * hundreds);
    }
  }, [scroll]);

  const SUBSEGMENTS = useMemo(
    () =>
      Array(currentCountSubsegments)
        .fill(null)
        .map((_, id: number) => ({
          id,
        })),
    [currentCountSubsegments],
  );

  const throttleSetScroll = useCallback(
    throttle((value: number) => {
      setScroll(value);
    }, 20),
    [],
  );

  const horizontalScroll = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.ctrlKey) {
      const currentState = scroll + e.deltaY;
      throttleSetScroll(
        currentState < MIN_SEGMENT_WIDTH || currentState > MAX_SEGMENT_WIDTH
          ? scroll
          : currentState,
      );
    }
  };

  console.log(scroll);

  return (
    <div
      onWheel={horizontalScroll}
      className='flex w-5/6 flex-col items-start overflow-x-scroll bg-[#333333] p-4 text-white'
    >
      <div className='relative flex min-w-full justify-center'>
        {SEGMENTS.map((segment) => (
          <div
            key={segment.id}
            style={{ width: scroll }}
            className='flex items-end justify-between border-l-2 border-[#d3d3d3] px-1'
          >
            <span className='px-1 text-sm'>{segment.id + 1}</span>
            <div className='flex w-full justify-between items-end'>
              {SUBSEGMENTS.map((subsegment, index) => (
                <div
                  key={segment.id.toString() + subsegment.id.toString()}
                  className={clsx('h-2 w-[2px] bg-[#d3d3d3] flex items-end ', {
                    'h-4': (index + 1) % 10 === 0,
                  })}
                >
                  {(index + 1) % 10 === 0 && (
                    <span className='px-1 text-sm'>
                      {segment.id +
                        1 +
                        Number((10 / currentCountSubsegments).toFixed(1))}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className='absolute bottom-0 h-[2px] w-full bg-[#d3d3d3]' />
      </div>
    </div>
  );
};

export default Measure;
