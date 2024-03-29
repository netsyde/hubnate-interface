import { IPool, IPoolSelector } from '@src/types/Pools';

const PoolSelector = (props: IPoolSelector) => {
    return (
        <div className="account_poolSelector">
            <p className = {"account_text"}>Pool:</p>
            <select 
                className="account_poolSelector__input"
                value = {props.selectedPool}
                onChange = {(e) => props.setSelectedPool(e.target.value)}
            >
                
                {props.pools.map((pool: IPool, index: number) => 
                    <option className="account_poolSelector__input_option"
                        key = {index}
                        value = {index}
                    >
                        {pool.token.name}
                    </option>
                )}
            </select>
        </div>
    )
}

export default PoolSelector;