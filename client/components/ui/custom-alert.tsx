import React, { createContext, useContext, useState, useCallback } from 'react';
import { Modal, View, Text, Pressable, StyleSheet } from 'react-native';

type AlertButton = {
  text: string;
  onPress?: () => void;
  style?: 'default' | 'cancel' | 'destructive';
};

type AlertOptions = {
  cancelable?: boolean;
  onDismiss?: () => void;
};

type AlertContextType = {
  showAlert: (title: string, message?: string, buttons?: AlertButton[], options?: AlertOptions) => void;
  hideAlert: () => void;
};

const AlertContext = createContext<AlertContextType | undefined>(undefined);

export const useAlert = () => {
  const context = useContext(AlertContext);
  if (!context) {
    throw new Error('useAlert must be used within an AlertProvider');
  }
  return context;
};

export const AlertProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState<string | undefined>('');
  const [buttons, setButtons] = useState<AlertButton[]>([]);
  const [options, setOptions] = useState<AlertOptions>({});

  const showAlert = useCallback((title: string, message?: string, buttons: AlertButton[] = [], options: AlertOptions = {}) => {
    setTitle(title);
    setMessage(message);
    setButtons(buttons.length > 0 ? buttons : [{ text: 'OK', onPress: () => {} }]);
    setOptions(options);
    setVisible(true);
  }, []);

  const hideAlert = useCallback(() => {
    setVisible(false);
    if (options.onDismiss) {
        options.onDismiss();
    }
  }, [options]);

  const contextValue = React.useMemo(() => ({ showAlert, hideAlert }), [showAlert, hideAlert]);

  return (
    <AlertContext.Provider value={contextValue}>
      {children}
      <Modal
        transparent={true}
        visible={visible}
        animationType="fade"
        onRequestClose={() => {
            if (options.cancelable) {
                hideAlert();
            }
        }}
      >
        <View style={styles.overlay}>
          <View style={styles.alertContainer}>
            <Text style={styles.title}>{title}</Text>
            {message ? <Text style={styles.message}>{message}</Text> : null}
            <View style={styles.buttonContainer}>
              {buttons.map((btn, index) => (
                <Pressable
                  key={index}
                  style={[
                    styles.button,
                    btn.style === 'cancel' && styles.cancelButton,
                    btn.style === 'destructive' && styles.destructiveButton,
                  ]}
                  onPress={() => {
                    if (btn.onPress) {
                        btn.onPress();
                    }
                    setVisible(false); 
                  }}
                >
                  <Text
                    style={[
                      styles.buttonText,
                      btn.style === 'cancel' && styles.cancelButtonText,
                      btn.style === 'destructive' && styles.destructiveButtonText,
                    ]}
                  >
                    {btn.text}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  alertContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 10,
    width: '100%',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 80,
    alignItems: 'center',
    backgroundColor: '#1428A0',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#e5e7eb',
  },
  cancelButtonText: {
    color: '#374151',
  },
  destructiveButton: {
    backgroundColor: '#ef4444',
  },
  destructiveButtonText: {
    color: 'white',
  },
});
