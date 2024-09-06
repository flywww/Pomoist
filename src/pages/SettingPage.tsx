import { useContext } from "react";
import { SettingsContext } from "../context/settingsContext";

export const SettingPage = () => {

    const settingsContext = useContext(SettingsContext);
    if (!settingsContext){
        throw Error ("Settings must be used within a PomodoroProvider");
    }
    const {settings, updateSettings} = settingsContext;
    const handleSelectorOnChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.currentTarget;
        console.log (`name: ${name} , value ${value}`)
        updateSettings({ [name]: value === 'true'})
    }

    //TODO: build react compoment for input for input validation (number and on/off)
    return (
        <div className="settingsPage">
            <div className="timeSetting">
                <h4 className="timeSetting__title">Time(minutes)</h4>
                <div className="timeSetting__sector">
                    <label className="timeSetting__label">
                        Focus time
                        <input 
                                className="timeSetting__input"
                                type="number" 
                                name="focusTime" 
                                value={settings.focusTime}
                                min={1}
                                onChange={(e) =>updateSettings({focusTime: Number(e.target.value)})}
                                />
                    </label>
                    <label className="timeSetting__label">
                        Short break time
                        <input 
                            className="timeSetting__input"
                            type="number" 
                            name="shortBreakTime" 
                            value={settings.shortBreakTime}
                            min={1}
                            onChange={(e) => updateSettings({shortBreakTime: Number(e.target.value)})}
                            />
                    </label>
                    <label className="timeSetting__label">
                        Long break time 
                        <input 
                            className="timeSetting__input"
                            type="number" 
                            name="longBreakTime" 
                            value={settings.longBreakTime}
                            min={1}
                            onChange={(e) => updateSettings({longBreakTime: Number(e.target.value)})}
                            />
                    </label>
                    <label className="timeSetting__label">
                        Break interval 
                        <input 
                            className="timeSetting__input"
                            type="number" 
                            name="breakInterval" 
                            value={settings.breakInterval}
                            min={1}
                            onChange={(e) => updateSettings({breakInterval: Number(e.target.value)})}
                            />
                    </label> 
                </div>
            </div>
        </div>
    )
}