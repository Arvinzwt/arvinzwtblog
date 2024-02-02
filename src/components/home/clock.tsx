'use client';
import React, {useEffect, useRef, useState} from 'react';

export default function Clock() {
  const svgRef = useRef(null);
  const initialized = useRef(false);
  let animationFrameId;
  const windowSize = {
    width: 300,
    height: 600,
  }

  const [data, setData] = useState([]);
  const [currentTime, setCurrentTime] = useState('88:88');

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return renderHandle()
    }
    return () => {
      if (animationFrameId) {
        return cancelAnimationFrame(animationFrameId);
      }
    }
  }, []);

  function calculateTriangleSides(long, angle) {
    // 将角度转换为弧度
    let radians = angle * (Math.PI / 180);

    // 返回结果
    return {
      opp: long * Math.sin(radians),
      adj: long * Math.cos(radians)
    };
  }

  function getNumTemplate() {
    const config = {
      shortSide: 5,
      longSide: 20,
      angle: 45,
      gap: 5,
      interval: 10,
    }
    const {opp, adj} = calculateTriangleSides(config.shortSide, config.angle)
    const starPoint = {x: 100, y: 100,}
    const vLong = config.longSide + opp * 2;
    const mLong = config.longSide + opp * 2 + (opp - adj) * 2;
    const hLine = [
      ['M', opp, adj],
      ['L', opp * 2, 0],
      ['L', vLong, 0],
      ['L', vLong + opp, adj],
      ['L', vLong, adj * 2],
      ['L', opp * 2, adj * 2],
    ]
    const vLine = hLine.map(item => [item[0], item[2], item[1]])
    const point = [
      ['M', opp, adj],
      ['L', opp * 2, 0],
      ['L', opp * 3, adj],
      ['L', opp * 2, adj * 2],
    ]
    const template = [
      hLine.map(item => [item[0], item[1] + config.gap * 2, item[2] + config.gap]),
      vLine.map(item => [item[0], item[1] + config.gap * 3 + mLong, item[2] + config.gap * 2]),
      hLine.map(item => [item[0], item[1] + config.gap * 2, item[2] + config.gap * 3 + mLong]),
      vLine.map(item => [item[0], item[1] + config.gap, item[2] + config.gap * 4 + mLong]),
      hLine.map(item => [item[0], item[1] + config.gap * 2, item[2] + config.gap * 5 + mLong * 2]),
      vLine.map(item => [item[0], item[1] + config.gap * 3 + mLong, item[2] + config.gap * 4 + mLong]),
      vLine.map(item => [item[0], item[1] + config.gap, item[2] + config.gap * 2]),
      point.map(item => [item[0], item[1] + config.gap * 2 + config.longSide / 2, item[2] + config.gap * 2 + mLong / 2]),
      point.map(item => [item[0], item[1] + config.gap * 2 + config.longSide / 2, item[2] + config.gap * 4 + mLong / 2 * 3]),
    ]
    const numbs = {
      '0': [0, 1, 3, 4, 5, 6],
      '1': [3, 6],
      '2': [0, 1, 2, 3, 4],
      '3': [0, 1, 2, 4, 5],
      '4': [1, 2, 5, 6],
      '5': [0, 2, 4, 5, 6],
      '6': [0, 2, 3, 4, 5, 6],
      '7': [0, 1, 5],
      '8': [0, 1, 2, 3, 4, 5, 6],
      '9': [0, 1, 2, 4, 5, 6],
      ':': [7, 8],
    }
    for (let key in numbs) {
      numbs[key] = numbs[key].map(item => template[item])
    }
    return {
      numbs,
      sWidth: (adj * 2 + config.gap * 4) + (config.longSide + opp * 2 + (opp - adj) * 2)
    }
  }


  function renderHandle() {
    /*不循环的处理*/
    const numbs = getNumTemplate()
    console.log(numbs)

    setData(currentTime.split('').map((tItem, tIndex) => (numbs.numbs[tItem].map(nItem => (
      nItem.map(pItem => [pItem[0], pItem[1] + tIndex * numbs.sWidth, pItem[2]].join(' '))
    )))))

    /*循环的处理*/
    animationFrameId = requestAnimationFrame(animationHandle);
  }

  function animationHandle() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    setCurrentTime(`${hours}:${minutes}`)
    animationFrameId = requestAnimationFrame(animationHandle);
  }


  return (
    <svg
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
      className="border border-solid border-orange-200 max-w-full h-auto"
      ref={svgRef}
      width={windowSize.width}
      height={windowSize.height}
      viewBox={[-0, -0, windowSize.width, windowSize.height]}
    >
      {
        data.map((numItem, numIndex) => (
          <g fill="transparent" key={'num' + numIndex} stroke="black">
            {
              numItem.map((pItem, pIndex) => (
                <path d={`${pItem} Z`} key={'num' + numIndex + '-' + pIndex}/>
              ))
            }
          </g>
        ))
      }
    </svg>
  );
}