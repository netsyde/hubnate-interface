import { Button } from '@components/Utility';
const settings = require('@images/ui/settings.svg')

interface IPool {
    name: string,
    description?: string,
    logotype: any,
    totalDonated: number,
    chance: number,
    yourDeposit: number,
    donaters: number

}

interface IPoolContainer {
    pools: IPool[]
}

const PoolContainer = (props: IPoolContainer) => {

    const onClickSettings = (e: any) => {
        alert('not implemented')
    }
    return <div className = "pools_container">
        <div className="pools_container__title">
            <h1>Pools</h1>
            <img onClick = {(e) => onClickSettings(e)}src={settings} alt="settings"/>
        </div>
      
       <table className = "pools_container__table">
           <tbody>
               {props.pools.map((pool: IPool) =>
                    <tr>
                        <td>
                            <div className = "pools_container__table_token">
                                <img className = "pools_container__table_token__icon" src={pool.logotype} alt="BNB"/>
                                <p className = "pools_container__table_token__ticker">{pool.name}</p>
                            </div>
                        </td>
                        <td>
                            <p className = "pools_container__table_meta">Total donated</p>
                            <p className = "pools_container__table_meta-number">${pool.totalDonated}</p>
                        </td>
                        <td>
                            <p className = "pools_container__table_meta">Chance</p>
                            <p className = "pools_container__table_meta-number">{pool.chance}%</p>
                        </td>
                        <td>
                            <p className = "pools_container__table_meta">Your Deposit</p>
                            <p className = "pools_container__table_meta-number">${pool.yourDeposit}</p>
                        </td>
                        <td>
                            <p className = "pools_container__table_meta">Donaters</p>
                            <p className = "pools_container__table_meta-number">{pool.donaters}</p>
                        </td>
                        <td>
                            <Button 
                                name = "Donate"
                                link = {`#${pool.name}`}
                                isTransparent = {false}
                                padding = "10px 100px"
                            
                            />
                        </td>
                    </tr>
                )}
            </tbody>
       </table>
    </div>
}

export default PoolContainer;