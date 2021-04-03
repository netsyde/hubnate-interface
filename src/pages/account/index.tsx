import { Header } from '@components/Main'
import { Container } from '@components/Pools'
import menuItems from '../../data/menu.json'

const Account = () => {
    return <div className = "main">
        <div className = "main_opacity">
            {/* <Header 
                className = "header"
                logo = {{
                    className: "header_logo",
                    name: "Hubnate"
                }}
                menu = {{
                    className: "header_menu",
                    items: menuItems
                }}
            /> */}
            <div className = "pools">
                {/* <Container 
                    pools = {poolList}
                    openDonateModal = {openDonateModal}
                    setOpenDonateModal = {setOpenDonateModal}
                    setSelectedPool = {setSelectedPool}
                /> */}
            </div>
        </div>
    </div>
}

export default Account;