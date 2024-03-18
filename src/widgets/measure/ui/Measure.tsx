'use client';
const COUNT_OF_SEGMENTS = 15;
const SEGMENTS = Array(COUNT_OF_SEGMENTS)
  .fill(null)
  .map((_, id: number) => ({
    id,
  }));

const Measure = () => {
  return (
    <div className='flex border-b border-black justify-between'>
      {SEGMENTS.map((el) => (
        <div key={el.id} className='h-4 w-2 bg-black'></div>
      ))}
    </div>
  );
};

export default Measure;
