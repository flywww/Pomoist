import { createContext } from 'react';
import { Settings } from '../utils/db';

export interface SettingContextType {
    settings: Settings;
    updateSettings: (newSettings: Partial<Settings>) => void;
}

export const SettingsContext = createContext<SettingContextType | undefined>(undefined);