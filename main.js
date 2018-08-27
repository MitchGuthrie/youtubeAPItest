// Options
const CLIENT_ID = '314803691631-vs7m3i116ipm2emtoiqe88h355v8brr8.apps.googleusercontent.com';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest"];
const SCOPES = 'https://www.googleapis.com/auth/youtube.readonly';

const authorizeButton = document.getElementById('authorize-button');
const signoutButton = document.getElementById('signout-button');
const content = document.getElementById('content');
const channelForm = document.getElementById('channel-form');
const channelInput = document.getElementById('channel-input');
const videoContainer = document.getElementById('video-container');
const defaultChannel = 'videogamedunkey'

// Load auth2 library
function handleClientLoad(){
    gapi.load('client:auth2', initClient);
}


// Init API Client Library and set up silent listeners
function initClient() {
    gapi.client.init({
        discoveryDocs: DISCOVERY_DOCS,
        clientId: CLIENT_ID,
        scope: SCOPES
    }).then(() => {
        //Listen for client state changes
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);
        // Handle initial sign in state
        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        authorizeButton.onclick = handleAuthClick;
        signoutButton.onclick = handleSignoutClick;
    });
}

//update UI sign in state changes
function updateSigninStatus(isSignedIn) {
    if(isSignedIn) {
        authorizeButton.style.display = 'none';
        signoutButton.style.display = 'block';
        content.style.display = 'blcok';
        videoContainer.style.display = 'block';
        getChannel(defaultChannel);
    } else {
        authorizeButton.style.display = 'block';
        signoutButton.style.display = 'none';
        content.style.display = 'none';
        videoContainer.style.display = 'none';
    }
}

//Handle login
function handleAuthClick() {
    gapi.auth2.getAuthInstance().signIn();
}

//Handle logout
function handleSignoutClick() {
    gapi.auth2.getAuthInstance().signOut();
}

//Display Channel Data
function showChannelData(data) {
    const channelData = document.getElementById('channel-data');
    channelData.innerHTML = data;
}

//get channel from api
function getChannel(channel) {
    gapi.client.youtube.channels.list({
        part: 'snippet,contentDetails,statistics',
        forUsername: channel
    })
        .then(Response => {
            console.log(response)
            const channel = response.result.items[0];

            const output = `
                <ul class="collection">
                    <li class="collection-item">Title: ${channel.snippet.title}</li>
                    <li class="collection-item">ID: ${channel.id}</li>
                    <li class="collection-item">Subscribers: ${channel.statistics.subscriberCount}</li>
                    <li class="collection-item">Views: ${channel.statistics.viewCount}</li>
                    <li class="collection-item">Videos: ${channel.statistics.videoCount}</li>
                </ul>
                <p>${channel.snippet.description}</p>
                <hr>
                <a class="btn grey darken-2" targer="_blank" href="https://youtube.com/${channel.snippet.custonUrl}">Visit Channel</a>
            `;
            showChannelData(output);
        })
        .catch(err => alert('No Channel(s) by that name'))
}
