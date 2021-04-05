import { Main } from '@src/layouts'
import { Container } from '@components/Utility'
import { Button } from '@components/Utility'
// import { createChart } from 'lightweight-charts'
import React, { useRef } from 'react'
import dynamic from 'next/dynamic'
// const Button = dynamic(() => import("@components/Utility/Button"))
// import loadable from '@loadable/component'
// import { createChart } from 'lightweight-charts'
// import { createChart } from 'lightweight-charts'
// const Pizda = loadable.lib(() => import('lightweight-charts'))

interface IToolTip {
    title: string,
    chance: number,
    date: string
}

const Tooltip = (props: IToolTip) => {
    console.log(props.title)
    return (
        `<div className="tooltip">
            <p className = "tooltip_title">{props.title}</p>
            <p className = "tooltip_chance">{props.chance}</p>
            <p className = "tooltip_date">{props.date}</p>
        </div>`
    )
}
const Chart =  () => {
    const ref = useRef(null)
    const toolTipRef = useRef(null)

    let drawGraph = async () => {
        try {
            const { createChart } = await import("lightweight-charts"); 
            let chart = createChart(ref.current, {
                height: 500,
                leftPriceScale: {
                    visible: false,
                },
                rightPriceScale: {
                    visible: false,
                },
                overlayPriceScales: {
                    drawTicks: true
                },
                
                grid: {
                    vertLines: {
                        visible: false,
                    },
                    horzLines: {
                        visible: false,
                    },
                },
                timeScale: {
                    visible: false,
                },
                layout: {
                    backgroundColor: '#fff',
                },
                crosshair: {
                    vertLine: {
                        visible: false,
                        labelVisible: false,
                    },
                    horzLine: {
                        visible: false,
                        labelVisible: false,
                    },
                },

            });
            
            let areaSeries = chart.addAreaSeries({
                topColor: 'rgba(219, 172, 238, 0.35)',
                bottomColor: 'rgba(142, 68, 173, 0)',
                lineColor: 'rgba(142, 68, 173, 1)',
                lineWidth: 2,
                baseLineVisible: false,
                priceLineVisible: false,
                
                
            });

            chart.applyOptions({
                timeScale: {
                    rightOffset: 0,
                    barSpacing: 12,
                    fixLeftEdge: true,
                    lockVisibleTimeRangeOnResize: true,
                    secondsVisible: false,
                },
            });
            
            areaSeries.setData([
                { time: '2016-07-18', value: 64.04 },
                { time: '2016-07-25', value: 63.97 },
                { time: '2016-08-01', value: 66.30 },
                { time: '2016-08-08', value: 65.32 },
                { time: '2016-08-15', value: 65.86 },
                { time: '2016-08-22', value: 66.22 },
                { time: '2016-08-29', value: 67.49 },
                { time: '2016-09-05', value: 66.65 },
                { time: '2016-09-12', value: 65.82 },
                { time: '2016-09-19', value: 67.25 },
                { time: '2016-09-26', value: 66.59 },
                { time: '2016-10-03', value: 68.11 },
                { time: '2016-10-10', value: 67.52 },
                { time: '2016-10-17', value: 68.49 },
                { time: '2016-10-24', value: 69.11 },
                { time: '2016-10-31', value: 67.76 },
                { time: '2016-11-07', value: 76.69 },
                { time: '2016-11-14', value: 77.71 },
                { time: '2016-11-21', value: 78.83 },
                { time: '2016-11-28', value: 81.60 },
                { time: '2016-12-05', value: 85.49 },
                { time: '2016-12-12', value: 84.94 },
                { time: '2016-12-19', value: 87.05 },
                { time: '2016-12-26', value: 86.29 },
                { time: '2017-01-02', value: 86.12 },
                { time: '2017-01-09', value: 86.70 },
                { time: '2017-01-16', value: 83.67 },
                { time: '2017-01-23', value: 86.93 },
                { time: '2017-01-30', value: 87.18 },
                { time: '2017-02-06', value: 87.00 },
                { time: '2017-02-13', value: 90.23 },
                { time: '2017-02-20', value: 90.33 },
                { time: '2017-02-27', value: 92.80 },
                { time: '2017-03-06', value: 91.28 },
                { time: '2017-03-13', value: 90.68 },
                { time: '2017-03-20', value: 87.29 },
                { time: '2017-03-27', value: 87.84 },
                { time: '2017-04-03', value: 86.18 },
                { time: '2017-04-10', value: 84.40 },
                { time: '2017-04-17', value: 84.52 },
                { time: '2017-04-24', value: 87.00 },
                { time: '2017-05-01', value: 87.00 },
                { time: '2017-05-08', value: 86.92 },
                { time: '2017-05-15', value: 84.78 },
                { time: '2017-05-22', value: 85.36 },
                { time: '2017-05-29', value: 82.64 },
                { time: '2017-06-05', value: 86.96 },
                { time: '2017-06-12', value: 86.18 },
                { time: '2017-06-19', value: 86.86 },
                { time: '2017-06-26', value: 91.40 },
                { time: '2017-07-03', value: 93.85 },
                { time: '2017-07-10', value: 92.25 },
                { time: '2017-07-17', value: 90.89 },
                { time: '2017-07-24', value: 91.28 },
                { time: '2017-07-31', value: 93.66 },
                { time: '2017-08-07', value: 91.42 },
                { time: '2017-08-14', value: 90.74 },
                { time: '2017-08-21', value: 91.89 },
                { time: '2017-08-28', value: 91.70 },
                { time: '2017-09-04', value: 88.42 },
                { time: '2017-09-11', value: 91.62 },
                { time: '2017-09-18', value: 94.83 },
                { time: '2017-09-25', value: 95.51 },
                { time: '2017-10-02', value: 96.92 },
                { time: '2017-10-09', value: 95.86 },
                { time: '2017-10-16', value: 99.51 },
                { time: '2017-10-23', value: 101.77 },
                { time: '2017-10-30', value: 101.41 },
                { time: '2017-11-06', value: 97.51 },
                { time: '2017-11-13', value: 98.14 },
                { time: '2017-11-20', value: 98.32 },
                { time: '2017-11-27', value: 104.79 },
                { time: '2017-12-04', value: 105.93 },
                { time: '2017-12-11', value: 106.14 },
                { time: '2017-12-18', value: 107.45 },
                { time: '2017-12-25', value: 106.94 },
                { time: '2018-01-01', value: 108.34 },
                { time: '2018-01-08', value: 112.67 },
                { time: '2018-01-15', value: 113.01 },
                { time: '2018-01-22', value: 116.32 },
                { time: '2018-01-29', value: 114.28 },
                { time: '2018-02-05', value: 110.04 },
                { time: '2018-02-12', value: 114.68 },
                { time: '2018-02-19', value: 117.31 },
                { time: '2018-02-26', value: 113.32 },
                { time: '2018-03-05', value: 118.04 },
                { time: '2018-03-12', value: 115.44 },
                { time: '2018-03-19', value: 107.01 },
                { time: '2018-03-26', value: 109.97 },
                { time: '2018-04-02', value: 109.09 },
                { time: '2018-04-09', value: 110.30 },
                { time: '2018-04-16', value: 111.47 },
                { time: '2018-04-23', value: 109.40 },
                { time: '2018-04-30', value: 108.43 },
                { time: '2018-05-07', value: 113.86 },
                { time: '2018-05-14', value: 111.13 },
                { time: '2018-05-21', value: 110.66 },
                { time: '2018-05-28', value: 108.40 },
                { time: '2018-06-04', value: 111.11 },
                { time: '2018-06-11', value: 107.90 },
                { time: '2018-06-18', value: 105.75 },
                { time: '2018-06-25', value: 104.20 },
                { time: '2018-07-02', value: 104.06 },
                { time: '2018-07-09', value: 106.36 },
                { time: '2018-07-16', value: 111.28 },
                { time: '2018-07-23', value: 116.03 },
                { time: '2018-07-30', value: 117.09 },
                { time: '2018-08-06', value: 115.73 },
                { time: '2018-08-13', value: 114.77 },
                { time: '2018-08-20', value: 114.68 },
                { time: '2018-08-27', value: 114.58 },
                { time: '2018-09-03', value: 114.32 },
                { time: '2018-09-10', value: 113.50 },
                { time: '2018-09-17', value: 117.85 },
                { time: '2018-09-24', value: 112.84 },
                { time: '2018-10-01', value: 114.62 },
                { time: '2018-10-08', value: 106.95 },
                { time: '2018-10-15', value: 107.91 },
                { time: '2018-10-22', value: 103.42 },
                { time: '2018-10-29', value: 108.38 },
                { time: '2018-11-05', value: 111.29 },
                { time: '2018-11-12', value: 109.99 },
                { time: '2018-11-19', value: 106.65 },
                { time: '2018-11-26', value: 111.19 },
                { time: '2018-12-03', value: 103.29 },
                { time: '2018-12-10', value: 100.29 },
                { time: '2018-12-17', value: 94.17 },
                { time: '2018-12-24', value: 96.83 },
                { time: '2018-12-31', value: 100.69 },
                { time: '2019-01-07', value: 99.91 },
                { time: '2019-01-14', value: 104.59 },
                { time: '2019-01-21', value: 103.39 },
                { time: '2019-01-28', value: 103.88 },
                { time: '2019-02-04', value: 101.36 },
                { time: '2019-02-11', value: 105.55 },
                { time: '2019-02-18', value: 105.00 },
                { time: '2019-02-25', value: 104.43 },
                { time: '2019-03-04', value: 103.01 },
                { time: '2019-03-11', value: 106.55 },
                { time: '2019-03-18', value: 99.76 },
                { time: '2019-03-25', value: 101.23 },
                { time: '2019-04-01', value: 105.31 },
                { time: '2019-04-08', value: 111.21 },
                { time: '2019-04-15', value: 113.46 },
                { time: '2019-04-22', value: 114.47 },
                { time: '2019-04-29', value: 116.12 },
                { time: '2019-05-06', value: 112.51 },
                { time: '2019-05-13', value: 110.77 },
                { time: '2019-05-20', value: 109.71 },
                { time: '2019-05-27', value: 109.33 },
            ]);

            const businessDayToString = (businessDay: any) => {
                return businessDay.year + '-' + businessDay.month + '-' + businessDay.day;
            }

            let toolTip = toolTipRef.current;
            let toolTipWidth = 80;
            let toolTipHeight = 80;
            let toolTipMargin = 350;

            chart.subscribeCrosshairMove((param) => {
                if (param.point === undefined || !param.time || param.point.x < 0 || param.point.x > ref.current.clientWidth || param.point.y < 0 || param.point.y > ref.current.clientHeight) {
                    toolTip.style.display = 'none';
                } else {
                    const date = businessDayToString(param.time);
                    toolTip.style.display = 'block';
                    let chance = Number(param.seriesPrices.get(areaSeries));
                    let title = "BNB Pool Chance";

                    toolTip.innerHTML = (
                        `<div class = "tooltip_container">
                            <p class = "tooltip_title">${title}</p>
                            <p class = "tooltip_chance">${chance}</p>
                            <p class = "tooltip_date">${date}</p>
                        </div>`
                    )
                    let coordinate = areaSeries.priceToCoordinate(chance);
                    let shiftedCoordinate = param.point.x - 50;
                    if (coordinate === null) {
                        return;
                    }
                    shiftedCoordinate = Math.max(0, Math.min(ref.current.clientWidth - toolTipWidth, shiftedCoordinate));
                    let coordinateY = coordinate - toolTipHeight + toolTipMargin > 0 ? coordinate - toolTipHeight + toolTipMargin : Math.max(0, Math.min(ref.current.clientHeight - toolTipHeight - toolTipMargin, coordinate + toolTipMargin));
                    toolTip.style.left = shiftedCoordinate + 'px';
                    toolTip.style.top = coordinateY + 'px';
                }
            });
 
        } catch (e) {
            // console.log(e)
        }
    } 

    drawGraph()
    
    return (
        <div>
            <div ref={toolTipRef} className="tooltip"></div>
            <div ref={ref} className = "chart" id="test-id" />
        </div>
    )
    
}
const Account = () => {
    const ref = useRef()
    return (
        <Main>
            <div className = "account">
                <Container
                    title = {"Account"}
                    address = {"0xaC0dB4c98A3C2dDaa16Fe54B0487F86b227F7B1d"}
                >
                    <div className = "account_main">
                        <div className = "account_main__info">
                            <p className = {"account_text"}>Pool: BNB</p>
                            <p className = {"account_text"}>Chance: 21.4% (1589 tickets)</p>
                            <p className = {"account_text"}>Total donated: 327</p>
                        </div>
                        <div className = "account_main__buttons">
                        <Button 
                            name = "Tickets"
                            link = {`#`}
                            type = {'default'}
                            padding = "10px 20px"
                            className = {"mr10"}
                            
                        />
                        <Button 
                            name = "Donates"
                            link = {`#`}
                            type = {'default'}
                            padding = "10px 20px"
                        />
                        </div>
                    </div>
                    <Chart/>
                </Container>
            </div>
        </Main>
    )
}

export default Account;