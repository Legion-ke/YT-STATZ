document.addEventListener('DOMContentLoaded', () => {
    const apiKey = 'AIzaSyDTKAVQjoXnexDUShbOf9Z-FWFz4UABonQ';

    const fetchButton = document.getElementById('fetchButton');
    const channelInput = document.getElementById('channelInput');
    const channelName = document.getElementById('channelName');
    const subscriberCount = document.getElementById('subscriberCount');

    fetchButton.addEventListener('click', () => {
        const channelURL = channelInput.value.trim();
        if (!channelURL) return;

        // Extract channel ID from the URL
        const channelID = extractChannelID(channelURL);

        if (!channelID) {
            channelName.textContent = 'Invalid channel URL or ID';
            subscriberCount.textContent = '';
            return;
        }

        // Fetch subscriber count
        fetchSubscriberCount(apiKey, channelID)
            .then(data => {
                channelName.textContent = data.name;
                subscriberCount.textContent = `Subscribers: ${data.subscriberCount}`;
            })
            .catch(error => {
                channelName.textContent = 'Error';
                subscriberCount.textContent = 'Unable to fetch subscriber count';
                console.error(error);
            });
    });
});

function extractChannelID(url) {
    const regex = /channel\/([\w-]+)/;
    const match = url.match(regex);
    return match ? match[1] : url;
}

async function fetchSubscriberCount(apiKey, channelID) {
    try {
        const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelID}&key=${apiKey}`);
        const data = await response.json();
        const channel = data.items[0];

        if (!channel) {
            throw new Error('Channel not found');
        }

        return {
            name: channel.snippet.title,
            subscriberCount: channel.statistics.subscriberCount,
        };
    } catch (error) {
        throw error;
    }
}
