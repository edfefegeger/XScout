// Функция для генерации случайных имен, usernames и очков
function generateRandomData() {
    const randomNames = [
        "Alice Johnson", "Bob Smith", "Charlie Brown", "David Taylor", "Eve Davis",
        "Frank Miller", "Grace Wilson", "Hannah Moore", "Jack Clark", "Liam Lewis"
    ];
    
    const randomUsernames = [
        "alice.johnson92", "bob_smith45", "charlie.brown23", "david_taylor11", "eve.davis21",
        "frank.miller89", "grace_wilson65", "hannah.moore78", "jack.clark30", "liam_lewis22"
    ];

    const randomScores = Array.from({ length: 5 }, () => Math.floor(Math.random() * 901) + 100); // Рандом от 100 до 1000

    const randomIndex = Math.floor(Math.random() * randomNames.length);

    return {
        name: randomNames[randomIndex],
        username: randomUsernames[randomIndex],
        score: randomScores[randomIndex]
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const avatar = localStorage.getItem('avatar');
    const followersCount = localStorage.getItem('followersCount');
    const userId = localStorage.getItem('userId');
    const userName = localStorage.getItem('userName');
    const screenName = localStorage.getItem('screenName');
    const score = localStorage.getItem('score');
    const trustScore = localStorage.getItem('trustScore'); // Получаем trustScore из localStorage

    console.log("Загруженные данные из localStorage:", {
        avatar,
        followersCount,
        userId,
        userName,
        screenName,
        score,
        trustScore
    });

    // Если нет данных, генерируем случайные
    const { name, username, score: randomScore } = generateRandomData();
    document.getElementById('score').textContent = score || randomScore;

    const avatarElem = document.getElementById('avatar');
    if (avatar && avatarElem) {
        const highResAvatar = avatar.replace("_normal", "_bigger");
        avatarElem.src = highResAvatar;
    }

    document.getElementById('followersCount').textContent = formatNumber(followersCount);
    document.getElementById('userId').textContent = userId || 'N/A';
    document.getElementById('UserName').textContent = userName || username; 

    document.getElementById('Trust_score').textContent = trustScore || '0';

    const randomUsernames = [
        'moonlight_247', 'cosmic_rider', 'storm_chaser42', 'electric_wolf', 'blue_sky_82',
        'silver_shadow_21', 'night_hunter_53', 'neon_flash_88', 'space_ranger_99', 'phantom_wave_36'
    ];
    
    const randomScores = Array.from({ length: 10 }, () => Math.floor(Math.random() * 901) + 100); 


    const container = document.querySelector('.slide-one__block-folovers');
    randomUsernames.forEach((username, index) => {
        const { name: randomName } = generateRandomData();
        const newItem = document.createElement('div');
        newItem.classList.add('slide-one__item');
        newItem.innerHTML = `
        <div class="slide-one__imgg">
            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/800px-X_logo.jpg" alt style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover;">
        </div>
        <div class="slide-one__wp">
            <span>@${username}</span>
            <p>${randomName}</p>
        </div>
        <div class="slide-one__cif">${randomScores[index]}</div>
    `;
    container.appendChild(newItem);
    });


    const userInfoOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'ApiKey': '60d72145-422b-4640-895c-5509bf37a10a'
        }
    };

    if (screenName) {
        const followersStatsUrl = `https://api.tweetscout.io/v2/followers-stats?user_handle=${screenName}`;
        fetch(followersStatsUrl, userInfoOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Данные о фолловерах:", data);
                document.getElementById('Influencers_count2').textContent = formatNumber(data.influencers_count);
                document.getElementById('projects_count').textContent = formatNumber(data.projects_count);
                document.getElementById('capital_count').textContent = formatNumber(data.venture_capitals_count);
            })
            .catch(error => console.error('Ошибка при получении данных о фолловерах:', error));
    }

    if (userName) {
        const userScoreUrl = `https://api.tweetscout.io/v2/score/${userName}`;
        fetch(userScoreUrl, userInfoOptions)
            .then(response => response.json())
            .then(data => {
                console.log("Очки пользователя:", data);
                document.getElementById('score').textContent = formatNumber(data.score);

                const trustScoreElem = document.getElementById('Trust_score');
                const trustScoreCalculated = calculateTrustScore(data.score || 0);
                trustScoreElem.textContent = trustScoreCalculated;
            })
            .catch(error => console.error('Ошибка при получении очков пользователя:', error));
    }

    function formatNumber(number) {
        if (!number) return '0';
        const num = Number(number);
        if (num >= 1e9) {
            return (num / 1e9).toFixed(2) + 'B';
        } else if (num >= 1e6) {
            return (num / 1e6).toFixed(2) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(2) + 'K';
        } else {
            return num.toString();
        }
    }

    function calculateTrustScore(score) {
        if (score >= 5000) return 1000;
        if (score >= 1000) return 200;
        return Math.floor(score / 5); 
    }
});
