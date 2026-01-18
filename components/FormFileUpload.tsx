import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Upload, File, X } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
}

interface FormFileUploadProps {
  label: string;
  files: FileAttachment[];
  onFilesChange: (files: FileAttachment[]) => void;
  error?: string;
  required?: boolean;
  maxFiles?: number;
}

export default function FormFileUpload({
  label,
  files,
  onFilesChange,
  error,
  required,
  maxFiles = 5,
}: FormFileUploadProps) {
  const handleAddFile = () => {
    const newFile: FileAttachment = {
      id: Date.now().toString(),
      name: `document_${files.length + 1}.pdf`,
      size: Math.floor(Math.random() * 1000000) + 100000,
      type: 'application/pdf',
    };
    onFilesChange([...files, newFile]);
  };

  const handleRemoveFile = (id: string) => {
    onFilesChange(files.filter(f => f.id !== id));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.required}> *</Text>}
      </Text>
      
      <TouchableOpacity
        style={[styles.uploadButton, files.length >= maxFiles && styles.uploadButtonDisabled]}
        onPress={handleAddFile}
        activeOpacity={0.7}
        disabled={files.length >= maxFiles}
      >
        <Upload size={20} color={files.length >= maxFiles ? Colors.textMuted : Colors.primary} />
        <Text style={[styles.uploadText, files.length >= maxFiles && styles.uploadTextDisabled]}>
          {files.length >= maxFiles ? `Max ${maxFiles} files` : 'Attach files'}
        </Text>
      </TouchableOpacity>

      {files.length > 0 && (
        <ScrollView style={styles.filesList} nestedScrollEnabled>
          {files.map((file) => (
            <View key={file.id} style={styles.fileItem}>
              <File size={18} color={Colors.primary} />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
                <Text style={styles.fileSize}>{formatFileSize(file.size)}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveFile(file.id)}
                style={styles.removeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <X size={16} color={Colors.textMuted} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}

      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600' as const,
    color: Colors.text,
    marginBottom: 8,
  },
  required: {
    color: Colors.danger,
  },
  uploadButton: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    borderStyle: 'dashed',
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.5,
  },
  uploadText: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500' as const,
  },
  uploadTextDisabled: {
    color: Colors.textMuted,
  },
  filesList: {
    marginTop: 12,
    maxHeight: 200,
  },
  fileItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.surface,
    borderRadius: 8,
    marginBottom: 8,
  },
  fileInfo: {
    flex: 1,
  },
  fileName: {
    fontSize: 14,
    color: Colors.text,
    marginBottom: 2,
  },
  fileSize: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  removeButton: {
    padding: 4,
  },
  errorText: {
    fontSize: 12,
    color: Colors.danger,
    marginTop: 4,
  },
});
