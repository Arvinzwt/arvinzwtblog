'use client';
import React, {useEffect, useRef, useState} from 'react';
import animation from '../animation'

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
  const [data, setData] = useState(getNumTemplate('88:88:88').numTemplate);

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true;
      return renderHandle()
    }
    return () => {
      if (animationFrameId) {
        return clearTimeout(animationFrameId);
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
      ['L', opp * 3, adj],
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
      numbs: currentTimeArr.map((tItem, tIndex) => {
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
      numTemplate: currentTimeArr.map((tItem, tIndex) => {
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

  function getDefaultTemplate(currentTime = '') {
    const currentTimeArr = currentTime ? (currentTime + '').split('') : []
    const {opp, adj} = calculateTriangleSides(config.shortSide, config.angle)
    const point = [
      ['M', 0, adj],
      ['L', opp, 0],
      ['L', opp, 0],
      ['L', opp * 2, adj],
      ['L', opp, adj * 2],
      ['L', opp, adj * 2],
    ];
    const len = currentTimeArr.length * 7;
    const sw = opp * 2, sh = adj * 2;

    return {
      numTemplate: currentTimeArr.map((tItem, tIndex) => {
        return new Array(9).fill(null).map(((lItem, lIndex) => {
          return {
            point: point.map(pItem => [
              pItem[0],
              pItem[1] + (tIndex * currentTimeArr.length + lIndex) * (windowSize.width / len) - sw / 2,
              pItem[2] + windowSize.height - sh - config.interval,
            ]),
            fill: false
          }
        }))
      }),
    }
  }

  function getCurrentNumber() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    let currentTime = `${hours}:${minutes}:${seconds}`

    const numbsObj = getNumTemplate(currentTime)
    const defaultObj = getDefaultTemplate(currentTime)

    numbsObj.numTemplate.map((item1, index1) => {
      item1.map((item2, index2) => {
        if (!item2.fill) {
          numbsObj.numTemplate[index1][index2].point = defaultObj.numTemplate[index1][index2].point
        }
      })
    })

    return numbsObj.numTemplate
  }

  function renderHandle() {
    /*不循环的处理*/

    /*循环的处理*/
    animationHandle();
  }

  function animation(from, to, duration, callback) {
    let start = 0;
    let during = Math.ceil(duration / 17);
    let req = null;

    const easeOut = function (t, b, c, d) {
      if ((t /= d) < (1 / 2.75)) {
        return c * (7.5625 * t * t) + b;
      } else if (t < (2 / 2.75)) {
        return c * (7.5625 * (t -= (1.5 / 2.75)) * t + .75) + b;
      } else if (t < (2.5 / 2.75)) {
        return c * (7.5625 * (t -= (2.25 / 2.75)) * t + .9375) + b;
      } else {
        return c * (7.5625 * (t -= (2.625 / 2.75)) * t + .984375) + b;
      }
    }
    const step = function () {
      // value就是当前的位置值
      // 例如我们可以设置DOM.style.left = value + 'px'实现定位
      // 当前的运动位置
      let value = easeOut(start, from, to - from, during);

      // 时间递增
      start++;
      // 如果还没有运动到位，继续
      if (start <= during) {
        callback(value);
        req = requestAnimationFrame(step);
      } else {
        // 动画结束，这里可以插入回调...
        callback(to, true);
      }
    };

    step();
  }

  function animationHandle() {
    const numTemplate = getCurrentNumber()

    setData(numTemplate)

    animationFrameId = setTimeout(animationHandle, 1000);
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