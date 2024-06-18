const previewImg = document.getElementById("previewImg");
const downloadBtn = document.getElementById("downloadBtn")
console.log(previewImg);
const loc = document.location;
const baseUrl = loc.search;
const newUrl = baseUrl.replace("?q=",""); // remove query string
const imageUrl = "https://api-photobooth.xri.com.bd/image/" + newUrl;
console.log(imageUrl);
// const imageUrl = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNMIC0xfyz0ST47qOeD90Qv7FguB4yTCHHF7WihNI&s"
previewImg.src = imageUrl;

fetch(imageUrl)
    .then(response => response.blob())
    .then(blob => {
        // Create a Data URL from the blob
        const reader = new FileReader();
        reader.onloadend = function () {
            const dataURL = reader.result;

            // Create a download link and set its href to the Data URL
            
            downloadBtn.href = dataURL;

            // Make the download link visible and clickable
            downloadBtn.style.display = 'block';
        };
        reader.readAsDataURL(blob);
    })
    .catch(error => {
        console.error('Error fetching the image:', error);
    });