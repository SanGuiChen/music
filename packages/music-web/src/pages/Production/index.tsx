import LyricEditor from '@/components/LyricEditor';
import React from 'react';

const content = `最美的不是下雨天
而是与你走过域的一切`;

const Production: React.FC = () => {
  return (
    <div className=" w-full h-full rounded p-5 flex justify-center items-center">
      <LyricEditor
        initialContent={content
          .split('\n')
          .map((text) => ({ type: 'text', children: [{ text }] }))}
      />
    </div>
  );
};

export default Production;
