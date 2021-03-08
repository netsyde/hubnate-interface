interface IStatistic {
    items: IStatisticItem[]
}

interface IStatisticItem {
    title: string; // example: All Time Volume
    value: string // example: $100B
}

const StatisticItem = (props: IStatisticItem) => {
    return <div className="statistic_item">
        <p className="statistic_item__value">
            {props.value}
            <span>+</span>
        </p>
        <p className="statistic_item__title">{props.title}</p>
    </div>
}

const Statistic = (props: IStatistic) => {
    return <div className="statistic">
        {props.items.map((item, index) => 
            <StatisticItem key={index} title={item.title} value={item.value} />
        )}
    </div>
}

export default Statistic;