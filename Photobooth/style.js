// // //get the element 

// const btn = document.getElementById('captureButton');
// // const frontPage = document.getElementById('frontPage');
// const videoSection = document.getElementById('video_section');
// const countdown = document.getElementById("countdown1");





// btn.addEventListener('click',()=>{
//     // frontPage.style.display = 'none';
//     videoSection.classList.remove('hidden');


//     let counter = 10;

//     function updateCounter() {
//       counter -= 1;
//       countdown.style.cssText = `--value: ${counter}`
//     }


//     const intervalId = setInterval(updateCounter, 1000);

    

//     function stopCounter() {
//       clearInterval(intervalId);
//       console.log("Counter stopped.");
//       captureAndDownload()
//     }
//     setTimeout(stopCounter,10000);


// });



// const cursorRounded = document.querySelector('.rounded');
// const cursorPointed = document.querySelector('.pointed');


// const moveCursor = (e)=> {
//   const mouseY = e.clientY-1000;
//   const mouseX = e.clientX;
   
//   cursorRounded.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  
//   cursorPointed.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
 
// }

// window.addEventListener('mousemove', moveCursor)



// =======================================================================================================

// const countdown = document.getElementById("countdown1");
// function captureFunction(){
//     videoSection.classList.remove('hidden');

//     let counter = 5;

//     function updateCounter() {
//       counter -= 1;
//       countdown.style.cssText = `--value: ${counter}`
//     }


//     const intervalId = setInterval(updateCounter, 1000);

    

//     function stopCounter() {
//       clearInterval(intervalId);
//       console.log("Counter stopped.");
//     //   captureAndDownload()
//     }
//     setTimeout(stopCounter,5000);
// }
// // captureButton.addEventListener('click', captureFunction);




// // function for convert dataURL to file 
// function dataURLtoFile(dataurl, filename) {
//     var arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
//     bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
//     while(n--){
//         u8arr[n] = bstr.charCodeAt(n);
//     }
//     return new File([u8arr], filename, {type:mime});
// }


// // const url2 = 'https://xri.com.bd/AR?q=1';
// // const url2 = 'https://arbooth.cyclic.cloud/image/625fea3c-c86b-414d-9bea-a2533c94527d'

// function createQrCode(url){
//     document.getElementById("qr-code").innerHTML = '';
//     const qr = new QRCode(document.getElementById("qr-code"), {
//           text: url,
//           width: 250,
//           height: 250,
//         });

//     // console.log(qr);

// }

// // const videoSection = document.getElementById('video_section');
// const qrcodeSection = document.getElementById('qrcode-section');
// //generat QR code & show it
// function genQR(url){
//     videoSection.classList.add('hidden');
//     qrcodeSection.classList.remove('hidden');
//     const longUrl = "https:xri.com.bd/ARbooth.html?q=" + url;
//     createQrCode(longUrl);
// }
// function uploadImage(file){
//     // Create a FormData object and append the image file to it
//     const formData = new FormData();
//     formData.append('image', file);

//     // Make a POST request to the API
//     fetch('https://dull-erin-caiman-vest.cyclic.cloud/upload', {
//         method: 'POST',
//         body: formData,
//     })
//         .then((response) => {
//         if (response.ok) {
//             return response.json();
//         } else {
//             throw new Error('Failed to upload image');
//         }
//         })
//         .then((data) => {
//         // Handle the API response here
//         genQR(data.id);
//         console.log('Image upload successful:', data);
//         })
//         .catch((error) => {
//         // Handle errors here
//         console.error('Error uploading image:', error);
//         });
// }


// // ============ 
// function captureAndDownload() {
//     // Capture the current content of the canvas
//     const capturedImage = new Image();
    
//     const srcValue = canvas.toDataURL('image/jpeg'); // You can choose the desired image format (e.g., 'image/png', 'image/jpeg')
//     // console.log(srcValue);
//     capturedImage.src = srcValue;
    
//     // Create a download link for the captured image
//     const downloadLink = document.createElement('a');
//     downloadLink.href = capturedImage.src;
//     downloadLink.download = 'captured_image.jpg'; // Set the desired file name and extension

//     // Simulate a click on the download link to trigger the download
//     // downloadLink.click();
//     var file = dataURLtoFile(srcValue, 'filename.jpg');
//     console.log("file details: ",file);
//     uploadImage(file);
    
// }

// //add a function to capture the image when press the space button from the keyboard
// document.addEventListener('keydown', function(event) {
//     if (event.keyCode === 32) { // Check if the key pressed is the space bar
//         captureFunction(); // Call your capture function
//     }
// });

// // add a function to reload the pages when a user press 'x' it will reload the page
// document.addEventListener('keydown', function(event) {
//     if (event.keyCode === 88) { // Check if the key pressed is 'x'
//         reloadPage(); // Call the reloadPage function
//     }
// });

// function reloadPage() {
//     // Reload the page
//     location.reload();
// }









