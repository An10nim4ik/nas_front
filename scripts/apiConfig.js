const API_BASE_URL = 'http://127.0.0.1:8000';

function getAuthToken(){
    return localStorage.getItem('accessToken');
}


async function fetchWithAuth(url, options = {}){
    const token = getAuthToken();
    const headers = {
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    if(!(options.body instanceof FormData) && (options.method === 'POST' || options.method === 'PUT') && options.body){
        if(!headers['Content-Type']){
            headers['Content-Type'] = 'application/json';
        }
    }
    const response = await fetch(url, {...options, headers});

    if(response.status === 401){
        console.error("Unauthorized access token or token expired. Redirecting to login.");
        localStorage.removeItem('accessToken');
    }
    
    return response;
}

