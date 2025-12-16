import { toast, ToastOptions } from 'react-toastify';

const defaultOptions: ToastOptions = {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
};

export const toastService = {
    // Başarı mesajları
    success: (message: string, options?: ToastOptions) => {
        toast.success(message, { ...defaultOptions, ...options });
    },

    // Hata mesajları
    error: (message: string, options?: ToastOptions) => {
        toast.error(message, { ...defaultOptions, ...options });
    },

    // Bilgi mesajları
    info: (message: string, options?: ToastOptions) => {
        toast.info(message, { ...defaultOptions, ...options });
    },

    // Uyarı mesajları
    warning: (message: string, options?: ToastOptions) => {
        toast.warning(message, { ...defaultOptions, ...options });
    },

    // Yükleniyor mesajı (promise-based)
    loading: (message: string) => {
        return toast.loading(message, defaultOptions);
    },

    // Yükleniyor mesajını güncelleme
    update: (toastId: any, type: 'success' | 'error' | 'info' | 'warning', message: string) => {
        toast.update(toastId, {
            render: message,
            type: type,
            isLoading: false,
            ...defaultOptions,
        });
    },

    // Toast'u kapatma
    dismiss: (toastId?: any) => {
        if (toastId) {
            toast.dismiss(toastId);
        } else {
            toast.dismiss();
        }
    },

    // Önceden tanımlı mesajlar
    messages: {
        // Başarı mesajları
        loginSuccess: () => toastService.success('Giriş başarılı! Yönlendiriliyorsunuz... 🎉'),
        registerSuccess: () => toastService.success('Kayıt başarılı! Hoş geldiniz 🎉'),
        saveSuccess: () => toastService.success('Başarıyla kaydedildi ✅'),
        updateSuccess: () => toastService.success('Başarıyla güncellendi ✅'),
        deleteSuccess: () => toastService.success('Başarıyla silindi 🗑️'),
        
        // Hata mesajları
        loginError: (message?: string) => toastService.error(message || 'Giriş başarısız. Email veya şifrenizi kontrol edin.'),
        registerError: (message?: string) => toastService.error(message || 'Kayıt başarısız oldu. Lütfen tekrar deneyin.'),
        networkError: () => toastService.error('Bağlantı hatası. Lütfen internet bağlantınızı kontrol edin.'),
        genericError: (message?: string) => toastService.error(message || 'Bir hata oluştu. Lütfen tekrar deneyin.'),
        validationError: (message?: string) => toastService.error(message || 'Lütfen tüm alanları doğru şekilde doldurun.'),
        
        // Bilgi mesajları
        noData: () => toastService.info('Gösterilecek veri bulunamadı.'),
        processing: () => toastService.info('İşleminiz işleniyor...'),
        
        // Uyarı mesajları
        unsavedChanges: () => toastService.warning('Kaydedilmemiş değişiklikler var!'),
        confirmAction: () => toastService.warning('Bu işlemi onaylıyor musunuz?'),
    }
};

// Kullanım örnekleri:
// toastService.success('İşlem başarılı!');
// toastService.error('Bir hata oluştu!');
// toastService.messages.loginSuccess();
// toastService.messages.networkError();
