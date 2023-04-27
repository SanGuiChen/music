import LyricEditor from '@/components/LyricEditor';
import Title from 'antd/es/typography/Title';
import React from 'react';

const content = `最美的不是下雨天
而是曾与你走过雨的一切`;

const Production: React.FC = () => {
  return (
    <div className=" w-full h-full rounded p-5 ">
      <Title level={3}>音乐生产</Title>
      <div className="flex justify-center items-center">
        <LyricEditor
          initialContent={content
            .split('\n')
            .map((text) => ({ type: 'text', children: [{ text }] }))}
          initialPlayUrl="https://zz123.com/xplay/?act=songplay&id=ukdav"
        />
      </div>
    </div>
  );
};

export default Production;
