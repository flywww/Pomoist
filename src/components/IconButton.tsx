import React, {memo} from "react"

type ClickHandler = (event: React.MouseEvent<HTMLButtonElement>) => void;
interface iconButtonProps {
    onClick?: ClickHandler;
    buttonType?: "button" | "submit" | "reset";
    buttonSize: "small" | "medium"
    buttonColor: "primary" | "secondary";
    imgURL: string;
    imgDescribe: string;
}

const NonMemorizedIconButton: React.FC<iconButtonProps> = ({onClick, buttonType, buttonSize, imgURL, imgDescribe, buttonColor}) => {
    
    return(
        <button 
            className = {`iconButton iconButton--${buttonSize} iconButton--${buttonColor}`}
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

export const IconButton = memo(NonMemorizedIconButton);