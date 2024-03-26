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
      <div className='mt-12 w-1/5 cursor-pointer text-center text-white'>
        <span onClick={() => setCountOfTracks((prevState) => prevState + 1)}>
          {'Add new track +'}
        </span>
      </div>
      <div
        ref={ref}
        className='flex w-full flex-col items-start overflow-x-scroll bg-[#333333] p-4 text-white'
      >
        <div className='relative flex min-w-full justify-center '>
          {SEGMENTS.filter(
            ({ id }) => id % Math.floor(MAX_SEGMENT_WIDTH / scroll) === 0,
          ).map((segment) => (
            <div
              key={segment.id}
              style={{ width: scroll }}
              className='flex h-full items-end justify-between border-l-DEFAULT border-[#d3d3d3] px-1 '
            >
              <span className='px-1 text-sm'>
                {scroll > 100
                  ? ((segment.id + 1) * (scroll / 10)).toFixed(1)
                  : segment.id + 1}
                {/*{segment.id + 1}*/}
              </span>
              {scroll > 100 && (
                <div className='flex w-full items-end justify-between pr-1'>
                  {SUBSEGMENTS.map((subsegment) => (
                    <div
                      key={segment.id.toString() + subsegment.id.toString()}
                      className={clsx('flex h-2 w-px items-end bg-[#d3d3d3] ')}
                    ></div>
                  ))}
                </div>
              )}
            </div>
          ))}
          <div className='absolute bottom-0 h-[2px] w-full bg-[#d3d3d3]' />
        </div>
        <div className={"w-full'> flex flex-col flex-wrap text-white"}>
          {TRACKS.map(({ id }) => (
            <div key={id} className='flex'>
              {SEGMENTS.filter(
                ({ id }) => id % Math.floor(MAX_SEGMENT_WIDTH / scroll) === 0,
              ).map((segment) => (
                <div
                  key={segment.id}
                  style={{ width: scroll }}
                  className='flex h-16 w-full border-collapse justify-between border-x-DEFAULT border-b-DEFAULT border-[#A19E9EFF] px-1'
                >
                  <span className='px-[3px] text-sm text-[#333333]'>
                    {segment.id + 1}
                  </span>
                  {scroll > 150 && (
                    <div className='ml-[2px] flex size-full justify-between pr-[3px]'>
                      {SUBSEGMENTS.map((subsegment) => (
                        <div
                          key={segment.id.toString() + subsegment.id.toString()}
                          className={clsx(
                            'flex h-full w-px items-end bg-[#d3d3d3] ',
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
