import React from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';

interface CustomFacesModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (faceValues: string[]) => void;
  initialValues?: string[];
}

export default function CustomFacesModal({ visible, onClose, onSave, initialValues }: CustomFacesModalProps) {
  const [faceValues, setFaceValues] = React.useState<string[]>(
    initialValues && initialValues.length === 6 ? initialValues : ['', '', '', '', '', '']
  );
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  React.useEffect(() => {
    if (visible && initialValues && initialValues.length === 6) {
      setFaceValues(initialValues);
    }
  }, [visible, initialValues]);

  const handleFaceChange = (index: number, value: string) => {
    const newValues = [...faceValues];
    newValues[index] = value;
    setFaceValues(newValues);
    
    if (errorMessage) {
      setErrorMessage('');
    }
  };

  const handleSave = () => {
    let isFilled = true;
    faceValues.forEach((value) => isFilled = isFilled && (value !== '' && value !== undefined && value !== null));

    if(!isFilled){
      setErrorMessage('⚠️ Please fill in all face values');
      Alert.alert(
        'Incomplete Fields',
        'Please fill in all 6 face values before saving.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    setErrorMessage('');
    onSave(faceValues);
    onClose();
  };

  const handleClose = () => {
    setErrorMessage('');
    onClose();
  };

  const handleReset = () => {
    onSave(['', '', '', '', '', '']);
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Custom Faces</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.contentWrapper}>
            <ScrollView 
              style={styles.modalContent}
              contentContainerStyle={styles.scrollContent}
              nestedScrollEnabled={true}
              bounces={false}
            >
              {errorMessage ? (
                <View style={styles.errorContainer}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              ) : null}

              {faceValues.map((value, index) => (
                <View key={index} style={styles.inputContainer}>
                  <Text style={styles.inputLabel}>Face {index + 1}</Text>
                  <TextInput
                    style={[
                      styles.input,
                      !value && errorMessage && styles.inputError
                    ]}
                    value={value}
                    onChangeText={(text) => handleFaceChange(index, text)}
                    placeholder={`Enter value for face ${index + 1}`}
                    placeholderTextColor="#666"
                    maxLength={10}
                  />
                </View>
              ))}
            </ScrollView>

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleReset}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '85%',
    height: '80%',
    backgroundColor: '#2a2a3e',
    borderRadius: 20,
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#3a3a4e',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3a3a4e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#a0a0b0',
    fontWeight: 'bold',
  },
  contentWrapper: {
    flex: 1,
    minHeight: 0,
  },
  modalContent: {
    flex: 1,
    minHeight: 0,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 10,
  },
  buttonContainer: {
    backgroundColor: '#2a2a3e',
    borderTopWidth: 1,
    borderTopColor: '#3a3a4e',
  },
  errorContainer: {
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  errorText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#a0a0b0',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a2e',
    borderWidth: 1,
    borderColor: '#3a3a4e',
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: '#ffffff',
  },
  inputError: {
    borderColor: '#DC2626',
    borderWidth: 2,
  },
  saveButton: {
    backgroundColor: '#DC2626',
    marginHorizontal: 20,
    marginVertical: 15,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  resetText: {
    color: '#a0a0b0',
    fontSize: 14,
    textAlign: 'center',
    paddingBottom: 15,
  },
});

