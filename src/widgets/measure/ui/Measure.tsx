'use client';
import { clsx } from 'clsx';
import throttle from 'lodash.throttle';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
  const [countOfTracks, setCountOfTracks] = useState<number>(0);
  const ref = useRef<HTMLDivElement | null>(null);

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

  const TRACKS = useMemo(
    () =>
      Array(countOfTracks)
        .fill(null)
        .map((_, id: number) => ({
          id,
        })),
    [countOfTracks],
  );

  const throttleSetScroll = useCallback(
    throttle((value: number) => {
      setScroll(value);
    }, 20),
    [],
  );

  const horizontalScroll = (e: WheelEvent) => {
    if (e.ctrlKey) {
      e.preventDefault();
      e.stopPropagation();
      const sign = e.deltaY >= 0 ? -1 : 1;
      const newValue = scroll + 10 * -sign;
      throttleSetScroll(
        newValue < MIN_SEGMENT_WIDTH || newValue > MAX_SEGMENT_WIDTH
          ? scroll
          : newValue,
      );
    }
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener('wheel', horizontalScroll, { passive: false });
    }
    return () => element?.removeEventListener('wheel', horizontalScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scroll]);

  return (
    <div className='flex gap-3'>
      <div className='w-1/5 text-white text-center mt-12 cursor-pointer'>
        <span onClick={() => setCountOfTracks((prevState) => prevState + 1)}>
          Add new track +
        </span>
      </div>
      <div
        ref={ref}
        className='flex w-full flex-col items-start overflow-x-scroll bg-[#333333] p-4 text-white'
      >
        <div className='relative flex min-w-full justify-center'>
          {SEGMENTS.filter(
            ({ id }) => id % Math.floor(MAX_SEGMENT_WIDTH / scroll) === 0,
          ).map((segment) => (
            <div
              key={segment.id}
              style={{ width: scroll }}
              className='flex items-end justify-between border-l-[1px] border-[#d3d3d3] px-1'
            >
              <span className='px-1 text-sm'>{segment.id + 1}</span>
              {scroll > 100 && (
                <div className='flex w-full items-end justify-between pr-1'>
                  {SUBSEGMENTS.map((subsegment) => (
                    <div
                      key={segment.id.toString() + subsegment.id.toString()}
                      className={clsx(
                        'flex h-2 w-[1px] items-end bg-[#d3d3d3] ',
                      )}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className='absolute bottom-0 h-[2px] w-full bg-[#d3d3d3]' />
        </div>
        <div className='flex flex-col  text-white flex-wrap w-full'>
          {TRACKS.map(({ id }) => (
            <div key={id} className='flex'>
              {SEGMENTS.filter(
                ({ id }) => id % Math.floor(MAX_SEGMENT_WIDTH / scroll) === 0,
              ).map((segment) => (
                <div
                  key={segment.id}
                  style={{ width: scroll }}
                  className='h-16 w-full flex justify-between border-x-[1px] border-b-[1px] border-[#A19E9EFF] px-1 border-collapse'
                >
                  <span className='px-[3.5px] text-sm text-[#333333]'>
                    {segment.id + 1}
                  </span>
                  {scroll > 150 && (
                    <div className='w-full h-full flex justify-between ml-[2px] pr-[3px]'>
                      {SUBSEGMENTS.map((subsegment) => (
                        <div
                          key={segment.id.toString() + subsegment.id.toString()}
                          className={clsx(
                            'flex h-full w-[1px] items-end bg-[#d3d3d3] ',
                          )}
                        ></div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Measure;
