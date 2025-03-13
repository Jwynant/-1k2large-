import { useState, useCallback } from 'react';
import { useContentManagement } from './useContentManagement';
import { ContentType, ContentFormState, ContentFormErrors, ContentItem } from '../types';
import { nanoid } from 'nanoid';

interface UseContentFormProps {
  type: ContentType;
  initialYear?: number;
  initialMonth?: number;
  initialWeek?: number;
  initialData?: Partial<ContentFormState>;
}

export function useContentForm({
  type,
  initialYear,
  initialMonth,
  initialWeek,
  initialData = {}
}: UseContentFormProps) {
  const { addContentItem } = useContentManagement();
  
  // Initialize form state
  const [formState, setFormState] = useState<ContentFormState>({
    title: initialData.title || '',
    notes: initialData.notes || '',
    date: initialData.date || new Date(),
    emoji: initialData.emoji || '',
    media: initialData.media || [],
    categoryIds: initialData.categoryIds || [],
  });
  
  // Form errors state
  const [errors, setErrors] = useState<ContentFormErrors>({});
  
  // Handle input changes
  const handleChange = useCallback((field: keyof ContentFormState, value: any) => {
    setFormState(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error for this field if it exists
    if (errors[field as keyof ContentFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  }, [errors]);
  
  // Validate the form without updating state (for external checks)
  const checkFormValidity = useCallback(() => {
    // Title is required
    if (!formState.title.trim()) {
      return false;
    }
    
    // Date is required
    if (!formState.date) {
      return false;
    }
    
    if (type === 'goal' && !formState.focusAreaId) {
      return false;
    }
    
    return true;
  }, [formState.title, formState.date, formState.focusAreaId, type]);
  
  // Validate the form and update errors state
  const validateForm = useCallback(() => {
    const newErrors: ContentFormErrors = {};
    
    // Title is required
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    // Date is required
    if (!formState.date) {
      newErrors.date = 'Date is required';
    }
    
    if (type === 'goal' && !formState.focusAreaId) {
      newErrors.focusAreaId = 'Please select a focus area';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState, type]);
  
  // Handle form submission
  const handleSubmit = useCallback(() => {
    console.log('useContentForm - handleSubmit called with type:', type);
    console.log('useContentForm - current formState:', JSON.stringify(formState, null, 2));
    
    // Validate form before submission
    if (!validateForm()) {
      console.error('useContentForm - form validation failed:', errors);
      return false;
    }
    
    // Prepare content data
    const contentData: Omit<ContentItem, 'id'> = {
      title: formState.title,
      date: formState.date.toISOString().split('T')[0],
      type: type,
      notes: formState.notes,
      emoji: formState.emoji,
      categoryIds: formState.categoryIds,
    };
    
    console.log('useContentForm - prepared contentData:', JSON.stringify(contentData, null, 2));
    
    // Add type-specific fields
    if (type === 'goal') {
      contentData.focusAreaId = formState.focusAreaId;
      contentData.progress = 0;
      contentData.isCompleted = false;
      
      if (formState.deadline) {
        contentData.deadline = formState.deadline.toISOString().split('T')[0];
      }
      
      if (formState.milestones && formState.milestones.length > 0) {
        contentData.milestones = formState.milestones;
      }
    } else if (type === 'memory') {
      contentData.media = formState.media;
      console.log('useContentForm - added media to memory:', formState.media);
    }
    
    // Add content item and return it
    try {
      console.log('useContentForm - calling addContentItem with:', JSON.stringify(contentData, null, 2));
      const result = addContentItem(contentData);
      console.log('useContentForm - addContentItem result:', result);
      return result;
    } catch (error) {
      console.error('useContentForm - error in addContentItem:', error);
      return false;
    }
  }, [formState, type, addContentItem, validateForm, errors]);
  
  // Reset the form
  const resetForm = useCallback(() => {
    setFormState({
      title: '',
      notes: '',
      date: new Date(),
      emoji: '',
      media: [],
      categoryIds: [],
    });
    setErrors({});
  }, []);
  
  // Add media to the form
  const addMedia = useCallback((mediaUri: string) => {
    setFormState(prev => ({
      ...prev,
      media: [...prev.media, mediaUri]
    }));
  }, []);
  
  // Remove media from the form
  const removeMedia = useCallback((index: number) => {
    setFormState(prev => ({
      ...prev,
      media: prev.media.filter((_, i) => i !== index)
    }));
  }, []);
  
  return {
    formState,
    errors,
    handleChange,
    handleSubmit,
    resetForm,
    addMedia,
    removeMedia,
    validateForm,
    isValid: checkFormValidity,
  };
}

// Default export for Expo Router compatibility
export default useContentForm; 