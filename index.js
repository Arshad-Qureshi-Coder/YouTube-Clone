const searchInput =  document.getElementById("search-input");
const container = document.getElementById("container");

const apiKey = "AIzaSyBiWIYv8XMbdgtHTQOUQMWS_aY7FMz2lHI";
// const apiKey2="AIzaSyA5SRKyu5w7Y9q7VXeClI9IxhD9m3nP7ao";
localStorage.setItem("api_key", apiKey);


function searchVideos(){
    let searchValue = searchInput.value;

    // fetch the list of the videos for this searchValue
    fetchValue(searchValue);
}

async function fetchValue(searchValue){
//    make api call

let endpoint = `https://youtube.googleapis.com/youtube/v3/search?part=snippet&maxResults=15&q=${searchValue}&key=${apiKey}`;

try{
    let response = await fetch(endpoint); //responce is instance of responce class
    let result = await response.json();
    for(let i=0; i<result.items.length; i++){
        let video = result.items[i];
        let videoStats = await fetchStats(video.id.videoId);
        if(videoStats.items.length > 0){
            result.items[i].videoStats = videoStats.items[0].statistics;
            result.items[i].duration = videoStats.items[0] && videoStats.items[0].contentDetails.duration;
        }
    }
    console.log(result);
    showThumbnails(result.items);

}
catch(error){
    console.log("Something went wrong", error);
    }
}
function getView(n){
    if(n<1000) return n;
    else if(n >= 1000 && n<= 999999){
        n/=1000;
        n = parseInt(n);
        return n+"K";
    }
    return parseInt(n/1000000) +"M";
}
 function showThumbnails(items){
       for(let i=0;i<items.length;i++){
        let videoItem = items[i];
        let imageUrl = videoItem.snippet.thumbnails.high.url;
        let videoElement = document.createElement("div");
        
        console.log(videoItem);
        videoElement.addEventListener("click", () => {
            navigateToVideo(videoItem.id.videoId);
        })
        const videoChildren = `
        <img src ="${imageUrl}"/>
        <b>${formattedData(videoItem.duration)}</b>
        <p class="title">${videoItem.snippet.title}</p>
        <p class="channel-name">${videoItem.snippet.channelTitle}</p>
        <p class="view-count">${videoItem.videoStats ? getView(videoItem.videoStats.viewCount) +" views" : "NA"}</p>
        `;
        
        videoElement.innerHTML=videoChildren;
        container.appendChild(videoElement);
    }
}
    window.onload = fetchStats;
    // window.onload = function () {

    //     setTimeout(function () {
    //     //   showThumbnails(videoItem);
    //     fetchStats;
    //       console.log("donee") ;// Assuming 'videoData' contains your video items
    //     }, 1000); // 1000 milliseconds (1 second)
    //   };
    //   In this modified code:
      
    //   The window.onload event handler now uses setTimeout to introduce a 1-second (1000 milliseconds) delay before calling the showThumbnails function.
      
    //   The showThumbnails function is then called inside the setTimeout callback after the delay.
      
    //   This will ensure that your showThumbnails function is executed one second after the window has finished loading. You can adjust the delay duration by changing the value passed to setTimeout.
      
    // const endpoint = "https://www.googleapis.com/youtube/v3/videos?";
    // async function fetchStats(videoId) {
    //     try {
    //         // const endpoint = `https://youtube.googleapis.com/youtube/v3/videos?part=statistics&snippet&maxResults=15&contentDetails&id=${videoId}&key=${apiKey}`;
    //         const endpoint = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet,statistics,contentDetails&id=${videoId}&maxResults=15`;
    //         const response = await fetch(endpoint);
    //         if (!response.ok) {
    //             throw new Error(`Failed to fetch data (status ${response.status})`);
    //         }
    
    //         const data = await response.json();
    
    //         // Print the data to the console
    //         console.log('Fetched data:', data);
    
    //         const videoItems = data.items;
    //         showThumbnails(videoItems);
    //     } catch (error) {
    //         console.error('Error fetching video data:', error);
    //     }
    // }

    async  function fetchStats(videoId){
        const endpoint = `https://www.googleapis.com/youtube/v3/videos?key=${apiKey}&part=snippet,statistics,contentDetails&id=${videoId}&maxResults=15`;
    let response = await fetch(endpoint);
    let result = await response.json();
    console.log(result);
    const videoItems = result.items;
    // showThumbnails(videoItems);
    return result;
}
 
// functiom for Time Duration of videos
function formattedData(duration) {
    if (!duration) return "NA";
  
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
    const hours = match[1] ? match[1].replace('H', '') : '0';
    const minutes = match[2] ? match[2].replace('M', '') : '00';
    const seconds = match[3] ? match[3].replace('S', '') : '00';
  
    let str = `${hours}:${minutes}`;
        seconds && (str += `:${seconds}`)
        return str ;
    // return `${hrs}:${mins}:${seconds}`;
  }
  
  // Example usage:
  const duration = "PT2H33M23S";
  const formattedTime = formattedData(duration);
//   console.log(formattedTime); // Outputs: "02:33:23"

// function for when user click any video it will open to new page 
function navigateToVideo(videoId){
    let path = `/newVideo.html`;
    if(videoId){
   // video_id: video_id
      document.cookie = `video_id=${videoId}; path=${path}`
      let linkItem = document.createElement("a");
      linkItem.href = "http://127.0.0.1:5500/newVideo.html"
      linkItem.target = "_blank" ;
      linkItem.click();
    }
    else {
      alert("Go and watch in youtube")
    }
  }

