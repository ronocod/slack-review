function sendRequest(params, channelName, button) {
  var url = params.url;
  var channel = channelName;

  if (!url || !channel) {
    console.error("Couldn't request review: missing URL or channel");
    button.innerHTML = "Failed to send, check the console";
    return;
  }

  // add hash to channel if it's not there, unless it's being sent to a user like @user
  if (channel.substring(0, 1) !== '#' && channel.substring(0, 1) !== '@') {
    channel = '#' + channel;
  }

  var username = params.username || 'Review Request';
  var icon_emoji = params.emoji || ':slack:';
  var gitHubUrl = window.location.href;
  var repoName = gitHubUrl.split("/")[4];
  var titleElement = document.querySelector('#partial-discussion-header > div.gh-header-show > h1 > span.js-issue-title')
  var title = repoName + " - " + titleElement.innerHTML.trim();
  var greenDiff = document.querySelector('#diffstat > span.text-green').innerHTML.trim();
  var redDiff = document.querySelector('#diffstat > span.text-red').innerHTML.trim();

  // payload for slack API request
  var payload = {
    channel: channel,
    username: username,
    text: "<" + gitHubUrl + "|" + title + "> _" + greenDiff + " " + redDiff + "_",
    icon_emoji: icon_emoji
  };

  // make API request to slack
  $.ajax({
    type: 'POST',
    url: url,
    data: JSON.stringify(payload)
  }).always(function() {
    button.disabled = true;
    button.innerHTML = "Sent";
    hasSentRequest = true;
  }).fail(function() {
    console.error('Uh oh, something\'s wrong. Check your SlackReview options');
    button.innerHTML = "Failed to send, check the console";
  });
}

function addButton(params, channelName) {
  var hasSentRequest = false;
  var button = document.createElement("BUTTON")
  button.innerHTML = 'Send to ' + channelName;
  button.type = "button";
  button.className = "btn btn-sm";
  button.addEventListener("click", function() {
    if (!hasSentRequest) {
      sendRequest(params, channelName, button);
    }
  });

  document.querySelector("#partial-discussion-header > div.gh-header-show > div")
    .appendChild(button);
}

function addButtons(params) {
  var channelNames = params.channel || '#code-reviews';
  channelNames.split(",").map(function(channelName) {
    addButton(params, channelName.trim());
  });
}

chrome.storage.local.get(null, addButtons);
