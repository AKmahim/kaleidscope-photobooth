// =============== 4th try here i add the mirror effect and user can download the picture with a button ==============
const video = document.getElementById("video");
const indexSection = document.getElementById("indexid");
const qrCode = document.querySelector("#qr-code");
// Add an event listener for the capture button
// const captureButton = document.getElementById('captureButton');

// Check if the user's browser supports media devices (like webcam)
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  // Access the user's webcam
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then(function (stream) {
      // console.log(stream)
      video.srcObject = stream;
    })
    .catch(function (error) {
      console.error("Error accessing webcam:", error);
    });

  // Add click event listener to the capture button
  // captureButton.addEventListener('click', CountDownTimer);
} else {
  console.error("getUserMedia not supported in this browser.");
}

// ==================================== countdown timer =====================
const countdown = document.getElementById("captureBG");
const videoSection = document.getElementById("video_section");
function CountDownTimer() {
  let counter = 5;

  function updateCounter() {
    counter -= 1;
    console.log("🚀 ~ updateCounter ~ counter:", counter);
    if (counter === 0) {
      document.getElementById(
        "captureBG"
      ).src = `./assets/1.jpg`;
      countdown.style.display = "none";
    } else {
      if (counter > 0) {
        countdown.src = `./assets/${counter}.jpg`;
      }
    }
    // countdown.style.cssText = `--value: ${counter}`;
  }

  const intervalId = setInterval(updateCounter, 1000);

  function stopCounter() {
    clearInterval(intervalId);
    console.log("Counter stopped.");
    captureImage();

    toggleSpinner(true);
  }
  setTimeout(stopCounter, 5000);
}

/// ===================== capture image ===================
function captureImage() {
  const canvas = document.createElement("canvas");
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  const context = canvas.getContext("2d");
  // Draw the current video frame onto the canvas (mirrored)
  context.translate(canvas.width, 0); // Flip horizontally
  context.scale(-1, 1); // Mirror horizontall
  // Draw the current video frame onto the canvas
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  // Convert the canvas content to a data URL (base64)
  const imgDataUrl = canvas.toDataURL("image/png");

  var file = dataURLtoFile(imgDataUrl, "filename.jpg");
  // console.log("file details: ",file);
  uploadImageToBannerAPI(file);
}

// function for convert dataURL to file
function dataURLtoFile(dataurl, filename) {
  var arr = dataurl.split(","),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]),
    n = bstr.length,
    u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new File([u8arr], filename, { type: mime });
}
// ============================ function for convert file to dataURL =============
function fileToDataURL(file, callback) {
  if (!file) return; // Handle cases where the file is missing

  const reader = new FileReader();

  reader.onload = (event) => {
    if (typeof callback === "function") {
      callback(event.target.result); // Pass the Data URL to the callback function
    }
  };

  reader.readAsDataURL(file);
}

function uploadImageToBannerAPI(file) {
 

  // Create a FormData object and append the image file to it
  const formData = new FormData();
  formData.append("image", file);

  // Make a POST request to the API
  fetch("http://127.0.0.1:5000/process_image", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to upload image");
      }
    })
    .then((data) => {
      // Handle the API response here
      // genQR(data.id);

      let imageDataUrl = "data:image/png;base64," + data.image;
      // console.log('Image processing successful:', imageDataUrl);
      var file = dataURLtoFile(imageDataUrl, "storage.jpg");
      uploadImageToStorageAPI(file);
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error Image processing fail:", error);
    });
}

// ================ qr code section ==================
const qrcodeSection = document.getElementById("qrcode-section");

// ====================== upload image to storage api and get image id =================
function uploadImageToStorageAPI(file) {
  // Create a FormData object and append the image file to it
  const formData = new FormData();
  formData.append("image", file);

  // Make a POST request to the API
  fetch("https://api-photobooth.xri.com.bd/upload", {
    method: "POST",
    body: formData,
  })
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to upload image");
      }
    })
    .then((data) => {
      // Handle the API response here
      toggleSpinner(false);
      // qrcodeSection.classList.remove('hidden');

      document.getElementById("qrcode-section").classList.remove("hidden");
      document.getElementById("qrcode-section").classList.add("flex");
      // convert file to dataURL and set data url in the preview_img
      fileToDataURL(file, (dataURL) => {
        const previewImage = document.getElementById("preview_img");
        previewImage.src = dataURL;
        console.log('Data URL:', dataURL);
      });
      // console.log(data.id);
      // photoListAdd(data.id);
      genQR(data.id);
      console.log("Image upload successful at : ", data);
    })
    .catch((error) => {
      // Handle errors here
      console.error("Error uploading image:", error);
    });
}

function createQrCode(url) {
  document.getElementById("qr-code").innerHTML = "";
  const qr = new QRCode(document.getElementById("qr-code"), {
    text: url,
    width: 250,
    height: 250,
  });

  // console.log(qr);
}

//generat QR code & show it
function genQR(url) {
  videoSection.classList.add("hidden");
  qrcodeSection.classList.remove("hidden");
  const longUrl = "https:xri.com.bd/photobooth.html?q=" + url;
  createQrCode(longUrl);
}



// ====================== spinner =========================
const loaderSection = document.getElementById("loader");
const toggleSpinner = (isLoading) => {
  if (isLoading) {
    loaderSection.classList.remove("hidden");
    loaderSection.classList.remove("flex");
    videoSection.classList.remove("flex");
    videoSection.classList.add("hidden");
  } else {
    loaderSection.classList.add("hidden");
  }
};

// ========================= custom keyboard key for shortcut ====================
// Function to toggle full screen using f key
function toggleFullScreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen().catch((err) => {
      console.error(
        `Error attempting to enable full-screen mode: ${err.message}`
      );
    });
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }
}

// Listen for the "F" key press
document.addEventListener("keydown", (event) => {
  if (event.key === "F" || event.key === "f") {
    toggleFullScreen();
  }
});

var elem = document.documentElement;
function openFullscreen() {
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE11 */
    elem.msRequestFullscreen();
  }
}

// Function to handle key press event
function handleKeyPress(event) {
  // check keyboard ("enter") keyCode = 13 mean enter
  console.log(event.keyCode);
  if (event.keyCode === 13) {
    indexSection.classList.remove("block");
    indexSection.classList.add("hidden");
    videoSection.classList.remove("hidden");
    videoSection.classList.add("flex");
    CountDownTimer();
  }else if (event.keyCode == 120) {
    // check keyboard ("x")
    document.getElementById(
      "captureBG"
    ).src = `./assets/5.jpg`;
     countdown.style.display = "block";
    countdown.src = "./assets/5.jpg";
    indexSection.classList.remove("hidden");
    indexSection.classList.add("block");
    videoSection.classList.remove("flex");
    videoSection.classList.add("hidden");
    qrcodeSection.classList.remove("flex");
    qrcodeSection.classList.add("hidden");
    openFullscreen();
  }
}
// Add event listener for key press event
document.addEventListener("keypress", handleKeyPress);
