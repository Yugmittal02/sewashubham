import { useRef, useEffect, useCallback } from 'react';

/**
 * Custom hook for order notifications with Hindi voice alerts
 * Features:
 * - Sound notification on new order
 * - Hindi voice: "नया ऑर्डर आ गया!" 
 * - 10-minute pending alerts: "यह ऑर्डर X मिनट से पेंडिंग है"
 */
const useOrderNotification = (orders, isActive = true) => {
    const previousOrderCountRef = useRef(0);
    const alertedOrdersRef = useRef(new Set()); // Track which orders we've alerted for each 10-min interval
    const speechSynthRef = useRef(null);
    const audioContextRef = useRef(null);

    // Initialize audio context
    useEffect(() => {
        if (typeof window !== 'undefined' && window.AudioContext) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        }
        return () => {
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    // Generate beep sound
    const playBeep = useCallback((frequency = 800, duration = 200, type = 'sine') => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            }
            const ctx = audioContextRef.current;
            const oscillator = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            oscillator.type = type;
            oscillator.frequency.value = frequency;
            
            gainNode.gain.setValueAtTime(0.5, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration / 1000);
            
            oscillator.start();
            oscillator.stop(ctx.currentTime + duration / 1000);
        } catch (e) {
            console.log('Audio not supported');
        }
    }, []);

    // Play new order sound (cheerful melody)
    const playNewOrderSound = useCallback(() => {
        // Play a cheerful 3-note melody
        playBeep(523, 150, 'sine'); // C5
        setTimeout(() => playBeep(659, 150, 'sine'), 150); // E5
        setTimeout(() => playBeep(784, 200, 'sine'), 300); // G5
    }, [playBeep]);

    // Play alert sound (urgent)
    const playAlertSound = useCallback(() => {
        playBeep(600, 100, 'square');
        setTimeout(() => playBeep(600, 100, 'square'), 150);
        setTimeout(() => playBeep(600, 100, 'square'), 300);
    }, [playBeep]);

    // Speak in Hindi (falls back to English if Hindi voice unavailable)
    const speakHindi = useCallback((hindiText, englishFallback) => {
        if (!('speechSynthesis' in window)) return;

        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(hindiText);
        
        // Try to find Hindi voice
        const voices = window.speechSynthesis.getVoices();
        const hindiVoice = voices.find(v => 
            v.lang.includes('hi') || 
            v.lang.includes('Hindi') || 
            v.name.includes('Hindi')
        );
        
        if (hindiVoice) {
            utterance.voice = hindiVoice;
            utterance.lang = 'hi-IN';
        } else {
            // Fallback to English
            utterance.text = englishFallback;
            utterance.lang = 'en-IN';
        }
        
        utterance.rate = 0.9;
        utterance.pitch = 1;
        utterance.volume = 1;
        
        window.speechSynthesis.speak(utterance);
    }, []);

    // Announce new order
    const announceNewOrder = useCallback(() => {
        playNewOrderSound();
        setTimeout(() => {
            speakHindi(
                'नया ऑर्डर आ गया!',
                'New order received!'
            );
        }, 500);
    }, [playNewOrderSound, speakHindi]);

    // Announce pending order alert
    const announcePendingAlert = useCallback((minutesPending) => {
        playAlertSound();
        setTimeout(() => {
            speakHindi(
                `यह ऑर्डर ${minutesPending} मिनट से पेंडिंग है`,
                `Order pending for ${minutesPending} minutes`
            );
        }, 500);
    }, [playAlertSound, speakHindi]);

    // Check for new orders
    useEffect(() => {
        if (!isActive || !orders) return;

        const currentCount = orders.length;
        const prevCount = previousOrderCountRef.current;

        // New order detected
        if (currentCount > prevCount && prevCount > 0) {
            announceNewOrder();
        }

        previousOrderCountRef.current = currentCount;
    }, [orders, isActive, announceNewOrder]);

    // Check for 10-minute pending alerts
    useEffect(() => {
        if (!isActive || !orders) return;

        const checkPendingOrders = () => {
            const pendingOrders = orders.filter(o => 
                o.status === 'Pending' && !o.isAccepted
            );

            pendingOrders.forEach(order => {
                const createdAt = new Date(order.createdAt);
                const minutesPending = Math.floor((Date.now() - createdAt) / 60000);
                
                // Alert at 10, 20, 30 minute marks
                const alertIntervals = [10, 20, 30, 45, 60];
                
                alertIntervals.forEach(interval => {
                    const alertKey = `${order._id}-${interval}`;
                    if (minutesPending >= interval && !alertedOrdersRef.current.has(alertKey)) {
                        alertedOrdersRef.current.add(alertKey);
                        announcePendingAlert(interval);
                    }
                });
            });
        };

        // Initial check
        checkPendingOrders();

        // Check every minute
        const intervalId = setInterval(checkPendingOrders, 60000);

        return () => clearInterval(intervalId);
    }, [orders, isActive, announcePendingAlert]);

    // Helper to calculate minutes since order creation
    const getMinutesSinceCreation = useCallback((createdAt) => {
        return Math.floor((Date.now() - new Date(createdAt)) / 60000);
    }, []);

    // Format time display
    const formatPendingTime = useCallback((createdAt) => {
        const minutes = getMinutesSinceCreation(createdAt);
        if (minutes < 60) {
            return `${minutes}m`;
        }
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    }, [getMinutesSinceCreation]);

    // Get urgency level for styling
    const getUrgencyLevel = useCallback((createdAt, status, isAccepted) => {
        if (status !== 'Pending') return 'none';
        if (isAccepted) return 'low';
        
        const minutes = getMinutesSinceCreation(createdAt);
        if (minutes >= 30) return 'critical';
        if (minutes >= 20) return 'high';
        if (minutes >= 10) return 'medium';
        return 'low';
    }, [getMinutesSinceCreation]);

    // Manual trigger for testing
    const testNotification = useCallback(() => {
        announceNewOrder();
    }, [announceNewOrder]);

    return {
        getMinutesSinceCreation,
        formatPendingTime,
        getUrgencyLevel,
        testNotification,
        playNewOrderSound,
        speakHindi
    };
};

export default useOrderNotification;
