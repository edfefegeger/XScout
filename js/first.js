document.addEventListener('DOMContentLoaded', () => {
    const inputField = document.getElementById('username2');
  
    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); 
            submitForm(); 
        }
    });
  
    function extractUsername(input) {
        input = input.trim();
        const urlPattern = /https?:\/\/(?:x\.com|twitter\.com)\/([^/?#]+)/;
        const match = input.match(urlPattern);
        if (match) {
            return match[1]; 
        }
        if (input.startsWith('@')) {
            return input.substring(1); 
        }
        return input; 
    }
    async function submitForm() {
        const rawInput = inputField.value;
        const username = extractUsername(rawInput);
    
        if (!username) {
            console.error("Некорректный ввод");
            return;
        }
    
        const userInfoUrl = `https://api.tweetscout.io/v2/info/${username}`;
        const userScoreUrl = `https://api.tweetscout.io/v2/score/${username}`;
    
        const userInfoOptions = {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'ApiKey': ''
            }
        };
    
        try {
            const [userInfoResponse, userScoreResponse] = await Promise.all([
                fetch(userInfoUrl, userInfoOptions),
                fetch(userScoreUrl, userInfoOptions)
            ]);
    
            if (!userInfoResponse.ok || !userScoreResponse.ok) {
                throw new Error('Ошибка при запросе данных');
            }
    
            const userData = await userInfoResponse.json();
            const userScoreData = await userScoreResponse.json();

            const trustScore = calculateTrustScore(userScoreData.score || 0);
    
            localStorage.setItem('avatar', userData.avatar);
            localStorage.setItem('followersCount', userData.followers_count);
            localStorage.setItem('userId', userData.id);
            localStorage.setItem('userName', username);
            localStorage.setItem('screenName', userData.screen_name);
            localStorage.setItem('score', userScoreData.score);
            localStorage.setItem('trustScore', trustScore); 
    
            window.location.href = 'app.html';
        } catch (error) {
            console.error('Ошибка при запросе API:', error);
        }
    }

    function calculateTrustScore(score) {
        if (score >= 5000) return 1000;
        if (score >= 1000) return 200;
        return Math.floor(score / 5); 
    }
        // Функция для добавления случайных данных в элементы
        function populateItems() {
            const items = document.querySelectorAll('.slide-one-bottom__items');
            items.forEach(item => {
                const nameElement = item.querySelector('.slide-one-bottom__txt span');
                const textElement = item.querySelector('.slide-one-bottom__txt p');
                const scoreElement = item.querySelector('.slide-one-bottom__cifres');
                
                // Генерация случайных данных
                const randomName = generateRandomName();
                const randomScore = generateRandomScore();
                
                // Присваиваем сгенерированные значения
                nameElement.textContent = `@${randomName}`;
                textElement.textContent = `Some description about ${randomName}`;
                scoreElement.textContent = randomScore;
            });
        }
        populateItems();
  });
  
