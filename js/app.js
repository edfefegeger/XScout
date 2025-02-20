document.addEventListener('DOMContentLoaded', () => {
    const userInfoOptions = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'ApiKey': ''
        }
    };

    const inputField = document.getElementById('username');

    inputField.addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();
            submitForm();
        }
    });

    inputField.addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            submitForm();
        }
    });

    async function submitForm() {
        const usernameInput = inputField.value.trim();

        if (!usernameInput) {
            console.error("Ошибка: пустое поле поиска!");
            return;
        }

        let username = usernameInput;
        const urlPattern = /https?:\/\/(?:www\.)?(?:twitter\.com|x\.com)\/([^\/\?]+)/i;
        const match = usernameInput.match(urlPattern);
        if (match) {
            username = match[1]; 
        }

        try {
            const userInfoUrl = `https://api.tweetscout.io/v2/info/${username}`;
            const userInfoResponse = await fetch(userInfoUrl, userInfoOptions);
            const userData = await userInfoResponse.json();

            if (!userData || !userData.screen_name) {
                console.error("Ошибка: пользователь не найден!");
                return;
            }

            const { avatar, followers_count, id, screen_name } = userData;
            console.log(avatar);

            const avatarElem = document.getElementById('avatar');
            if (avatar) {
                const highResAvatar = avatar.replace("_normal", "_bigger");
                avatarElem.src = highResAvatar;
            }

            document.getElementById('followersCount').textContent = formatNumber(followers_count) || '0';
            document.getElementById('userId').textContent = id || 'N/A';
            document.getElementById('UserName').textContent = username || 'N/A';
            document.getElementById('influencers_count2').textContent = formatNumber(userData.influencers_count || 0);
            document.getElementById('projects_count').textContent = formatNumber(userData.projects_count || 0);
            document.getElementById('capital_count').textContent = formatNumber(userData.venture_capitals_count || 0);

            generateRandomFollows();

            const userScoreUrl = `https://api.tweetscout.io/v2/score/${username}`;
            const userScoreResponse = await fetch(userScoreUrl, userInfoOptions);
            const userScoreData = await userScoreResponse.json();

            document.getElementById('score').textContent = userScoreData.score || '0';

            const trustScoreElem = document.getElementById('Trust_score');

            const calculateTrustScore = (score) => {
                if (score >= 5000) return 1000;
                if (score >= 1000) return 200;
                return Math.floor(score / 5); 
            };

            const trustScore = calculateTrustScore(userScoreData.score || 0);
            trustScoreElem.textContent = trustScore;

        } catch (error) {
            console.error('Ошибка при выполнении API-запросов:', error);
        }
    }

    function formatNumber(number) {
        if (!number || isNaN(number)) return '0';
        if (number >= 1e9) {
            return (number / 1e9).toFixed(2) + 'B';
        } else if (number >= 1e6) {
            return (number / 1e6).toFixed(2) + 'M'; 
        } else if (number >= 1e3) {
            return (number / 1e3).toFixed(2) + 'K'; 
        } else {
            return number.toString();
        }
    }

    function generateRandomFollows() {
        const followList = document.querySelector('.slide-one__block-folovers');
        for (let i = 0; i < 6; i++) {
            const followItem = document.createElement('div');
            followItem.classList.add('slide-one__item');

            const randomName = generateRandomName();
            const randomUsername = generateRandomUsername();
            const randomScore = generateRandomScore();

            followItem.innerHTML = `
                <div class="slide-one__imgg"><img src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b7/X_logo.jpg/800px-X_logo.jpg" alt style="border-radius: 50%; width: 50px; height: 50px; object-fit: cover;"></div>
                <div class="slide-one__wp">
                    <span>@${randomUsername}</span>
                    <p>${randomName}</p>
                </div>
                <div class="slide-one__cif">${randomScore}</div>
            `;

            followList.appendChild(followItem);
        }
    }

    function generateRandomName() {
        const names = ['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank', 'Grace', 'Hannah', 'Ivy', 'Jack'];
        return names[Math.floor(Math.random() * names.length)];
    }
    function generateRandomUsername() {
        const usernames = ['user123', 'coolguy99', 'techguru', 'randomDude', 'fastCoder', 'devExpert', 'creativeMind'];
        return usernames[Math.floor(Math.random() * usernames.length)];
    }
    function generateRandomScore() {
        return Math.floor(Math.random() * (1000 - 100 + 1)) + 100;
    }
});
