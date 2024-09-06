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
        <>
            <div className="timeSetting">
                <h2>Time</h2>
                <label>
                    Focus time: 
                    <input type="number" 
                            name="focusTime" 
                            value={settings.focusTime}
                            min={1}
                            onChange={(e) =>updateSettings({focusTime: Number(e.target.value)})}
                            />
                </label>
                <label>
                    Short break time: 
                    <input type="number" 
                            name="shortBreakTime" 
                            value={settings.shortBreakTime}
                            min={1}
                            onChange={(e) => updateSettings({shortBreakTime: Number(e.target.value)})}
                            />
                </label>
                <label>
                    Long break time: <input type="number" 
                                            name="longBreakTime" 
                                            value={settings.longBreakTime}
                                            min={1}
                                            onChange={(e) => updateSettings({longBreakTime: Number(e.target.value)})}
                                            />
                </label>
                <label>
                    Break interval: <input type="number" 
                                            name="breakInterval" 
                                            value={settings.breakInterval}
                                            min={1}
                                            onChange={(e) => updateSettings({breakInterval: Number(e.target.value)})}
                                            />
                </label>  
            </div>
            <div className="otherSetting">
                <h2>Time</h2>
                <label>
                    Alert: 
                    <select 
                        name="alarmSoundEnabled"
                        value={String(settings.alarmSoundEnabled)}
                        onChange={handleSelectorOnChange}
                    >
                        <option value="true">On</option>
                        <option value="false">Off</option>
                    </select>
                </label>
                <label>
                    Notification: 
                    <select 
                            name="notificationEnabled"
                            value={String(settings.notificationEnabled)}
                            onChange={handleSelectorOnChange}
                    >
                        <option value="true">On</option>
                        <option value="false">Off</option>
                    </select>
                </label>
            </div>
        </>
    )
}