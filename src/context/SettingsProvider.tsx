import React, { useEffect, useState } from 'react';
import { db, Settings } from '../utils/db';
import { SettingsContext } from './settingsContext';

export const SettingsProvider: React.FC<{children: React.ReactNode}> = ({children}) => {
    const defaultSettings: Settings = {
        focusTime: 1,
        shortBreakTime: 2,
        longBreakTime: 3,
        breakInterval: 2,
        alarmSoundEnabled: false,
        notificationEnabled: false
    }
    const [settings, setSettings] = useState<Settings>(defaultSettings);

    useEffect(() =>{
        const loadSettings = async () => {
            const savedSettings = await db.settings.toArray();
            if(savedSettings.length >0){
                setSettings(savedSettings[0]);
            }else{
                await db.settings.add(defaultSettings);
            }
        };
        loadSettings();
    }, []) ;

    const updateSettings = async (newSettings: Partial<Settings>) => {
        try {
            const updatedSettings = {...settings, ...newSettings};
            await db.settings.put(updatedSettings);
            setSettings(updatedSettings);
        } catch (error) {
            console.error(`Update settings error: ${error}`);
        }
    }

    return (
        <SettingsContext.Provider value = {{settings, updateSettings}}>
            {children}
        </SettingsContext.Provider>
    )
};