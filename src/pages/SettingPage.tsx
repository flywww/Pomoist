import { useContext } from "react";
import { SettingsContext } from "../context/settingsContext";

export const SettingPage = () => {

    const settingsContext = useContext(SettingsContext);
    if (!settingsContext){
        throw Error ("Settings must be used within a PomodoroProvider");
    }
    const {settings, updateSettings} = settingsContext;

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
                                onChange={(e) =>updateSettings({focusTime: Math.max(Number(e.target.value), 1)})}
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
                            onChange={(e) => updateSettings({shortBreakTime: Math.max(Number(e.target.value), 1)})}
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
                            onChange={(e) => updateSettings({longBreakTime: Math.max(Number(e.target.value), 1)})}
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
                            onChange={(e) => updateSettings({breakInterval: Math.max(Number(e.target.value), 1)})}
                            />
                    </label> 
                </div>
            </div>
        </div>
    )
}