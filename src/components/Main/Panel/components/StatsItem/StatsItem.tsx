import Skeleton from 'react-loading-skeleton';

interface IStatsItem {
    title: string,
    value: number
}

const StatsItem = (props: IStatsItem) => {
    return (
        <div className="pools_panel__content_stats__item">
            <p className="pools_panel__content_stats__item_title">
                {props.title || <Skeleton />} 
            </p>
            <p className="pools_panel__content_stats__item_value">
                {props.value || <Skeleton />}
            </p>
        </div>
    )
}

export default StatsItem;