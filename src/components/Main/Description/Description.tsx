import { Button } from '@components/Utility'

interface IButton {
    name: string,
    link: string,
    isTransparent: boolean,
    padding?: string
}

interface IButtonList {
    items: IButton[]
}

interface IDescription {
    title: string,
    description: string,
    buttons: IButtonList
}

const ButtonList = (props: IButtonList) => {
    return <div className="description_buttons">
        {props.items.map((item, index) => 
            <Button key={index} name={item.name} link={item.link} isTransparent={item.isTransparent} />
        )}
    </div>
}

const Description = (props: IDescription) => {
    return <div className="description">
        <h1 className="description_title">
            {props.title}
        </h1>
        <h2 className="description_text">{props.description}</h2>
        <ButtonList items={props.buttons.items}/>
    </div>
}

export default Description;