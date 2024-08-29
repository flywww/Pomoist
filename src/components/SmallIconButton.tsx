import React from "react"

type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
interface SmallIconButtonProps {
    onClick?: ClickHandler;
    buttonType?: "button" | "submit" | "reset";
    buttonColor: "primary" | "secondary";
    imgURL: string;
    imgDescribe: string;
}

export const SmallIconButton: React.FC<SmallIconButtonProps> = ({onClick, buttonType, imgURL, imgDescribe, buttonColor}) => {
    
    return(
        <button 
            className = {`smallIconButton smallIconButton--${buttonColor}`}
            onClick = {onClick}
            type = {buttonType}
        >
            <img 
                className = "iconButton__img" 
                src = {imgURL} 
                alt = {imgDescribe}
            />
        </button>
    )
}