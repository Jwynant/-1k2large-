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
  
  // Validate the form
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
  
  // Submit the form
  const handleSubmit = useCallback(() => {
    // Validate form fields
    const newErrors: ContentFormErrors = {};
    
    if (!formState.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (type === 'goal' && !formState.focusAreaId) {
      newErrors.focusAreaId = 'Please select a focus area';
    }
    
    // If there are validation errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return null;
    }
    
    // Clear errors
    setErrors({});
    
    // Prepare the common content item data
    const contentData: ContentItem = {
      id: nanoid(),
      type,
      title: formState.title.trim(),
      date: formState.date.toISOString().split('T')[0],
      notes: formState.notes,
      emoji: formState.emoji,
      categoryIds: formState.categoryIds,
    };
    
    // Add type-specific data
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
    }
    
    // Add content item and return it
    return addContentItem(contentData);
  }, [formState, type, addContentItem]);
  
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
    isValid: validateForm,
  };
}

// Default export for Expo Router compatibility
export default useContentForm; 