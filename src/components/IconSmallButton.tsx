import React from "react"

type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
interface IconButtonProps {
    onClick?: ClickHandler;
    buttonType?: "button" | "submit" | "reset";
    buttonColor: "primary" | "secondary";
    imgURL: string;
    imgDescribe: string;
}

export const IconSmallButton: React.FC<IconButtonProps> = ({onClick, buttonType, imgURL, imgDescribe, buttonColor}) => {
    
    return(
        <button 
            className = {`iconSmallButton iconSmallButton--${buttonColor}`}
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