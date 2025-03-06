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
    importance: initialData.importance || 3,
    media: initialData.media || [],
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
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formState]);
  
  // Finalize the new content item and add it to the state
  const submitForm = useCallback(async (): Promise<string | null> => {
    if (!validateForm()) return null;
    
    // Create a new content item
    const newItem: Omit<ContentItem, 'id'> = {
      title: formState.title,
      date: formState.date.toISOString(),
      type,
      notes: formState.notes || undefined,
      emoji: formState.emoji || undefined,
      importance: type === 'insight' ? formState.importance : undefined,
      media: formState.media.length > 0 ? formState.media : undefined,
    };
    
    // Add the item
    return addContentItem(newItem);
  }, [formState, type, validateForm, addContentItem]);
  
  // Reset the form
  const resetForm = useCallback(() => {
    setFormState({
      title: '',
      notes: '',
      date: new Date(),
      emoji: '',
      importance: 3,
      media: [],
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
    handleSubmit: submitForm,
    resetForm,
    addMedia,
    removeMedia,
    isValid: validateForm,
  };
}

// Default export for Expo Router compatibility
export default useContentForm; 