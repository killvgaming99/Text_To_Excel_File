document.getElementById("refresh-button").addEventListener("click", function() {
    const video = document.getElementById("cloudfront-video");
    video.src = video.src; // Reloads the video by resetting its source
});
