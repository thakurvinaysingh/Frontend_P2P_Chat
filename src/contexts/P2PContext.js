import axios from 'axios';

const API_URL = 'https://P2P.upbpay.com/api/order/all?P2pType=Buy';

export const fetchBuyOrders = async () => {
    try {
        const response = await axios.get(API_URL, {
            auth: {
                username: 'UPBA_getById',
                password: '7hfn894f4jUPBP'
            },
            headers: {
                Method: 'GetById'
            }
        });

        console.log('🔍 API Response:', response.data); // log full response

        // Check if response.data is array or inside a field
        if (Array.isArray(response.data)) {
            return response.data;
        } else if (Array.isArray(response.data.data)) {
            return response.data.data;
        } else {
            return []; // fallback if not array
        }

    } catch (error) {
        console.error('❌ Error fetching buy orders:', error.response?.data || error.message);
        return [];
    }
};

