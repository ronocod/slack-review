function save_options() {
  var url = document.getElementById('url').value;
  var channel = document.getElementById('channel').value;
  var username = document.getElementById('username').value;
  var emoji = document.getElementById('emoji').value;

  chrome.storage.local.set({
    url: url,
    channel: channel,
    username: username || "Review Request",
    emoji: emoji || ":slack:"
  }, function() {
    // Update status to let user know options were saved.
    var status = document.getElementById('status');
    status.textContent = 'Options saved';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

function restore_options() {
  // Declare default values here
  chrome.storage.local.get(null, function(items) {
    console.log(items)
    document.getElementById('url').value = items.url || "";
    document.getElementById('channel').value = items.channel || "";
    document.getElementById('username').value = items.username || "";
    document.getElementById('emoji').value = items.emoji || "";
  });
}
document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
