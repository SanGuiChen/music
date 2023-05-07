import React from 'react';

interface IProps {
  artists?: any[];
  fontSize?: 'text-xs' | 'text-sm' | 'text-base';
  fontColor?: string;
}

const Artists: React.FC<IProps> = ({
  artists,
  fontSize = 'text-xs',
  fontColor = ''
}) => {
  return (
    <div className="flex items-center text-gray-400 font-normal">
      {artists?.map(({ name }, index) =>
        index !== artists?.length - 1 ? (
          <div key={index}>
            <span
              className={` ${fontSize} ${fontColor} cursor-pointer hover:text-gray-500 `}
            >
              {name}
            </span>
            <span className={`mx-1 ${fontSize} ${fontColor}`}>/</span>
          </div>
        ) : (
          <div key={index}>
            <span
              className={`cursor-pointer hover:text-gray-500 ${fontSize} ${fontColor}`}
            >
              {name}
            </span>
          </div>
        )
      )}
    </div>
  );
};

export default Artists;
