declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          query_id?: string;
          user?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
            language_code?: string;
            is_premium?: boolean;
            allows_write_to_pm?: boolean;
          };
          receiver?: {
            id: number;
            first_name?: string;
            last_name?: string;
            username?: string;
          };
          chat_instance?: string;
          chat_type?: string;
          chat?: {
            id: number;
            type: string;
            title?: string;
            username?: string;
            first_name?: string;
            last_name?: string;
            photo_url?: string;
          };
          start_param?: string;
          can_save_after?: boolean;
          auth_date: number;
          hash: string;
        };
        version: string;
        platform: string;
        colorScheme: 'light' | 'dark' | 'dark_dimmed';
        themeParams: {
          bg_color?: string;
          text_color?: string;
          hint_color?: string;
          link_color?: string;
          button_color?: string;
          button_text_color?: string;
          secondary_bg_color?: string;
        };
        isExpanded: boolean;
        viewportHeight: number;
        viewportStableHeight: number;
        headerColor: string;
        backgroundColor: string;
        isClosingConfirmationEnabled: boolean;
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          offClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive?: boolean) => void;
          hideProgress: () => void;
          setParams: (params: {
            text?: string;
            color?: string;
            text_color?: string;
            is_active?: boolean;
            is_visible?: boolean;
          }) => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
        expand: () => void;
        close: () => void;
        ready: () => void;
        onEvent: (eventType: string, eventHandler: Function) => void;
        offEvent: (eventType: string, eventHandler: Function) => void;
        sendData: (data: string) => void;
        switchInlineQuery: (query: string, choose_chat_types?: string[]) => void;
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void;
        openTelegramLink: (url: string) => void;
        openInvoice: (url: string, callback?: (status: 'paid' | 'cancelled' | 'failed' | 'pending') => void) => void;
        showPopup: (params: {
          title?: string;
          message: string;
          buttons: Array<{
            id?: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }, callback?: (buttonId: string) => void) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        showScanQrPopup: (params: { text?: string }, callback: (text: string) => void) => void;
        closeScanQrPopup: () => void;
        readTextFromClipboard: (callback: (text: string | null) => void) => void;
        requestWriteAccess: (callback?: (access_granted: boolean) => void) => void;
        requestContact: (callback: (phone_number: string) => void) => void;
        requestLocation: (callback: (location: { latitude: number; longitude: number }) => void) => void;
        requestPoll: (params: {
          question: string;
          options: string[];
          multiple?: boolean;
          anonymous?: boolean;
        }, callback: (poll: {
          id: string;
          question: string;
          options: Array<{ text: string; voter_count: number }>;
          is_anonymous: boolean;
          allows_multiple_answers: boolean;
          type: 'regular' | 'quiz';
        }) => void) => void;
        setHeaderColor: (color: string) => void;
        setBackgroundColor: (color: string) => void;
        enableClosingConfirmation: () => void;
        disableClosingConfirmation: () => void;
        onEvent: (eventType: 'viewportChanged' | 'themeChanged' | 'mainButtonClicked', eventHandler: Function) => void;
        offEvent: (eventType: string, eventHandler: Function) => void;
      };
    };
  }
}

export {};
