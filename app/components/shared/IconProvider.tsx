import React, { createContext, useContext, ReactNode } from 'react';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

// Define the icons we actually use in the app
// This helps tree-shaking to only include the icons we need
type IconName = 
  | 'add'
  | 'add-circle'
  | 'arrow-back'
  | 'arrow-forward'
  | 'bug-outline'
  | 'calendar'
  | 'camera'
  | 'checkmark'
  | 'checkmark-circle'
  | 'chevron-down'
  | 'chevron-forward'
  | 'chevron-up'
  | 'close'
  | 'close-circle'
  | 'create'
  | 'ellipsis-horizontal'
  | 'ellipsis-vertical'
  | 'grid'
  | 'heart'
  | 'heart-outline'
  | 'help-circle'
  | 'home'
  | 'image'
  | 'information-circle'
  | 'list'
  | 'menu'
  | 'moon'
  | 'notifications'
  | 'options'
  | 'person'
  | 'person-circle'
  | 'search'
  | 'settings'
  | 'share'
  | 'share-social'
  | 'star'
  | 'sunny'
  | 'time'
  | 'trash'
  | 'warning';

type MaterialIconName =
  | 'account-circle'
  | 'settings';

interface IconContextType {
  Icon: (props: {
    name: IconName;
    size?: number;
    color?: string;
    style?: any;
  }) => JSX.Element;
  MaterialIcon: (props: {
    name: MaterialIconName;
    size?: number;
    color?: string;
    style?: any;
  }) => JSX.Element;
}

const IconContext = createContext<IconContextType | undefined>(undefined);

export const IconProvider = ({ children }: { children: ReactNode }) => {
  const Icon = ({ name, size = 24, color = 'black', style }: {
    name: IconName;
    size?: number;
    color?: string;
    style?: any;
  }) => {
    return <Ionicons name={name} size={size} color={color} style={style} />;
  };

  const MaterialIcon = ({ name, size = 24, color = 'black', style }: {
    name: MaterialIconName;
    size?: number;
    color?: string;
    style?: any;
  }) => {
    return <MaterialIcons name={name} size={size} color={color} style={style} />;
  };

  return (
    <IconContext.Provider value={{ Icon, MaterialIcon }}>
      {children}
    </IconContext.Provider>
  );
};

export const useIcons = () => {
  const context = useContext(IconContext);
  if (context === undefined) {
    throw new Error('useIcons must be used within an IconProvider');
  }
  return context;
}; 