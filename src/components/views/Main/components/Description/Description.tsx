import React, { useState, useEffect } from "react";
import "./Description.scss";

interface IButton {
    name: string,
    link: string,
    isTransparent: boolean
}

interface IButtonList {
    items: IButton[]
}

interface IDescription {
    title: string,
    description: string,
    buttons: IButtonList
}

const Button = (props: IButton) => {
    return <a className={props.isTransparent ? "transparent-button" : "hubnate-button"} href={props.link}>
        <p>
            {props.name}
        </p>
    </a>
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