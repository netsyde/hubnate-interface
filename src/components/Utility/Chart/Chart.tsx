import React, { useRef, useEffect } from 'react'
import { IChartApi } from 'lightweight-charts'
import { IUserInPool } from '@src/types/Pools'

interface IChart {
    chart: IChartApi,
    setChart: any,
    data: IUserInPool
    selectedPool: number
}

const Chart =  (props: IChart) => {
    let ref = useRef(null)
    const toolTipRef = useRef(null)

    const drawGraph = async () => {
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

            })

            let areaSeries = chart.addAreaSeries({
                topColor: props.data.secondaryPoolColor,
                bottomColor: props.data.mainPoolColor,
                lineColor: props.data.lineColor,
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
            
            areaSeries.setData(props.data.chances);

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

                    toolTip.innerHTML = (
                        `<div class = "tooltip_container">
                            <p class = "tooltip_title">${props.data.poolName} Pool Chance</p>
                            <p class = "tooltip_chance">${chance}%</p>
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
            props.setChart(chart)
 
        } catch (e) {
            // console.log(e)
        }
    } 

    useEffect(() => {
        if (props.chart) {
            props.chart.remove()
        }
        drawGraph()
    }, [props.selectedPool]);
    
    return (
        <div>
            <div ref={toolTipRef} className="tooltip"></div>
            <div ref={ref} className = "chart" id="test-id" />
        </div>
    )
    
}

export default Chart;