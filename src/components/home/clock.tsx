'use client';
import React, {useEffect, useRef, useState} from 'react';

export default function Clock() {
  const svgRef = useRef(null);
  const initialized = useRef(false);
  let animationFrameId;
  const windowSize = {
    width: 500,
    height: 150,
  }
  const config = {
    shortSide: 10,
    longSide: 20,
    angle: 30,
    gap: 3,
    interval: 5,
  }

  const [currentData, setCurrentData] = useState([]);

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

  function getNumTemplate(currentTime = '') {
    const {opp, adj} = calculateTriangleSides(config.shortSide, config.angle)
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
      ['L', opp * 2, 0],
      ['L', opp * 3, adj],
      ['L', opp * 2, adj * 2],
      ['L', opp * 2, adj * 2],
    ]
    const numTemplate = [
      hLine.map(item => [item[0], item[1] + config.interval / 2 + config.gap, item[2] + config.interval]),
      vLine.map(item => [item[0], item[1] + config.interval / 2 + config.gap * 2 + mLong, item[2] + config.interval + config.gap]),
      hLine.map(item => [item[0], item[1] + config.interval / 2 + config.gap, item[2] + config.interval + config.gap * 2 + mLong]),
      vLine.map(item => [item[0], item[1] + config.interval / 2, item[2] + config.interval + config.gap * 3 + mLong]),
      hLine.map(item => [item[0], item[1] + config.interval / 2 + config.gap, item[2] + config.interval + config.gap * 4 + mLong * 2]),
      vLine.map(item => [item[0], item[1] + config.interval / 2 + config.gap * 2 + mLong, item[2] + config.interval + config.gap * 3 + mLong]),
      vLine.map(item => [item[0], item[1] + config.interval / 2, item[2] + config.interval + config.gap]),
      point.map(item => [item[0], item[1] + config.interval / 2 + config.gap + config.longSide / 2, item[2] + config.interval + config.gap + mLong / 2]),
      point.map(item => [item[0], item[1] + config.interval / 2 + config.gap + config.longSide / 2, item[2] + config.interval + config.gap * 3 + mLong / 2 * 3]),
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
    const sWidth = (adj * 2 + config.gap * 2 + config.interval) + (config.longSide + opp * 2 + (opp - adj) * 2);
    const sHeight = (adj * 2 + config.gap * 2 + config.interval * 3) + (config.longSide + opp * 2 + (opp - adj) * 2) * 2;
    const currentTimeArr = currentTime ? (currentTime + '').split('') : []

    return {
      points: currentTimeArr.map((tItem, tIndex) => {
        return new Array(9).fill(null).map(((lItem, lIndex) => {
          let pIn = tIndex * numTemplate.length + lIndex
          let len = currentTimeArr.length * numTemplate.length;
          let pw = opp * 2, ph = adj * 2;
          return {
            point: point.map(pItem => [
              pItem[0],
              pItem[1] + pIn * ((windowSize.width / len)) - opp + (windowSize.width / len - pw) / 2,
              pItem[2] + windowSize.height - ph - config.interval,
            ]),
            fill: false
          }
        }))
      }),
      numbs1: currentTimeArr.map((tItem, tIndex) => {
        let xOffset = (windowSize.width - currentTimeArr.length * sWidth) / 2;
        let yOffset = (windowSize.height - sHeight) / 2;
        return numbs[tItem].map(item => numTemplate[item]).map(nItem => {
          return {
            point: nItem.map(pItem => [
              pItem[0],
              pItem[1] + tIndex * sWidth + xOffset,
              pItem[2] + yOffset
            ]),
            fill: true
          }
        })
      }),
      numbs2: currentTimeArr.map((tItem, tIndex) => {
        let xOffset = (windowSize.width - currentTimeArr.length * sWidth) / 2;
        let yOffset = (windowSize.height - sHeight) / 2;
        return numTemplate.map((nItem, nIndex) => {
          return {
            point: nItem.map(pItem => [
              pItem[0],
              pItem[1] + tIndex * sWidth + xOffset,
              pItem[2] + yOffset
            ]),
            fill: numbs[tItem].includes(nIndex),
          }
        })
      }),
      sWidth,
      sHeight,
    }
  }

  function getCurrentNumber() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let currentTime = `${hours}:${minutes}:${seconds}`

    const numbsObj = getNumTemplate(currentTime)

    numbsObj.numbs2.map((item1, index1) => {
      item1.map((item2, index2) => {
        if (!item2.fill) {
          numbsObj.numbs2[index1][index2].point = numbsObj.points[index1][index2].point
        }
      })
    })

    return numbsObj.numbs2
  }

  function renderHandle() {
    /*不循环的处理*/
    const newData = getCurrentNumber()
    const {numbs2: oldData} = getNumTemplate('88:88:88')

    // console.log(oldData,111)
    // for (let i = 0; i < oldData.length; i++) {
    //   for (let j = 0; j < oldData[i].length; j++) {
    //     for (let k = 0; k < oldData[i][j].point.length; k++) {
    //       let [key1, x1, y1] = oldData[i][j].point[k]
    //       let [key2, x2, y2] = newData[i][j].point[k]
    //       let xstep = (x2 - x1) / 500;
    //       let ystep = (y2 - y1) / 500;
    //       let stepCount = 0;
    //     }
    //   }
    // }


    /*循环的处理*/
    animationFrameId = requestAnimationFrame(animationHandle);
  }

  function animationHandle() {
    const newData = getCurrentNumber()
    setCurrentData(newData)

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
        currentData.map((numItem, numIndex) => (
          <g fill="transparent" key={'num' + numIndex} stroke="#f7f8fb">
            {
              numItem.map((lItem, lIndex) => {
                // if (lItem.fill) {
                //   return (
                //     <path d={`${lItem.point.map(pItem => pItem.join(' ')).join(' ')} Z`}
                //           key={'num' + numIndex + '-' + lIndex}
                //           fill={lItem.fill ? 'black' : 'null'}/>
                //   )
                // }
                return (<path d={`${lItem.point.map(pItem => pItem.join(' ')).join(' ')} Z`}
                              key={'num' + numIndex + '-' + lIndex}
                              fill={lItem.fill ? '#999999' : 'null'}/>)
              })
            }
          </g>
        ))
      }
    </svg>
  );
}