import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SimplifiedContentLibrary from '../content/SimplifiedContentLibrary';
import Card from '../shared/Card';

export default function ContentLibraryCard() {
  const [isExpanded, setIsExpanded] = useState(false);
  const contentLibraryColor = '#5856D6'; // Purple color for content library

  const toggleIcon = (
    <TouchableOpacity onPress={() => setIsExpanded(!isExpanded)}>
      <Ionicons 
        name={isExpanded ? "chevron-up" : "chevron-down"} 
        size={16} 
        color="#AEAEB2" 
      />
    </TouchableOpacity>
  );

  return (
    <Card
      title="Content Library"
      iconName="library"
      iconColor={contentLibraryColor}
      borderColor={contentLibraryColor}
      rightHeaderContent={toggleIcon}
    >
      <SimplifiedContentLibrary 
        isExpanded={isExpanded}
        onToggleExpand={() => setIsExpanded(!isExpanded)}
      />
    </Card>
  );
} 