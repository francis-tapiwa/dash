const cloudName = 'franzstack';
const unsignedUploadPreset = 'demkkj07';

// Drag and drop 
let dropbox = document.getElementById("drop-area");

// Prevent default drag behaviors
;['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropbox.addEventListener(eventName, preventDefaults, false)   
  document.body.addEventListener(eventName, preventDefaults, false)
})

// Handle dropped files
dropbox.addEventListener('drop', handleDrop, false)

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

function handleDrop(e) {
  var dt = e.dataTransfer
  var files = dt.files

  handleFiles(files)
}

// Highlight drag and drop area
;['dragenter', 'dragover'].forEach(eventName => {
  dropbox.addEventListener(eventName, highlight, false)
})

;['dragleave', 'drop'].forEach(eventName => {
  dropbox.addEventListener(eventName, unhighlight, false)
})

function highlight(e) {
  dropbox.classList.add('highlight')
  document.getElementById("cir-text").innerHTML = "Here"
}

function unhighlight(e) {
  dropbox.classList.remove('highlight')
  document.getElementById("cir-text").innerHTML = "Drag & Drop"
  // successful()
}

var thirdSection = document.getElementById('third')

function successful(e) {
  // dropbox.classList.add('mark')
  document.getElementById("cir-text").innerHTML = "Success!"
  document.getElementById("get-start").innerHTML = "Need More?"
  document.getElementById("details").innerHTML = "Forgot to add an image? That is no problem, keep them coming. Scroll down to view and download your images."
  thirdSection.scrollIntoView()
}

//Handle selected files
var handleFiles = function(files) {
  for (var i = 0; i < files.length; i++) {
    uploadFile(files[i]); 
  }
};

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  var dt = e.dataTransfer;
  var files = dt.files;

  handleFiles(files);
}

// Upload file to Cloudinary
function uploadFile(file) {
  var url = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;
  var xhr = new XMLHttpRequest();
  var fd = new FormData();
  xhr.open('POST', url, true);
  xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
  
  // Update progress (can be used to show progress indicator)
  xhr.upload.addEventListener("progress", function(e) {
    var progress = Math.round((e.loaded * 100.0) / e.total);

    console.log(`fileuploadprogress data.loaded: ${e.loaded},
  data.total: ${e.total}`);
  });

  xhr.onreadystatechange = function(e) {
    if (xhr.readyState == 4 && xhr.status == 200) {
      // File uploaded successfully
      var response = JSON.parse(xhr.responseText);
      var url = response.secure_url;
      var tokens = url.split('/');
      // tokens.splice(-2, 0, 'w_150,c_scale');
      var img = new Image(); // HTML5 Constructor
      img.src = tokens.join('/');
      img.alt = response.public_id;
      document.getElementById('gallery').appendChild(img);
      console.log(url)
      setTimeout(successful(), 10000)
    }
  };

  fd.append('upload_preset', unsignedUploadPreset);
  fd.append('tags', 'browser_upload');
  fd.append('file', file);
  xhr.send(fd);
}

