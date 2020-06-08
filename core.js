//Option for camer and audio
let constraintObj ={
    audio:false,
    video:{
        facingMode:'user',
        width:{min:640,ideal:1280,max:1920},
        height:{min:480,ideal:720,max:1080}
    }
}

navigator.mediaDevices.getUserMedia(constraintObj)
    //return audio and video information of user
    .then(mediaStreamObj =>{
        let liveCam = document.querySelector('#liveCam');
        if('srcObject' in liveCam){
            //Set video stream source to liveCam Video element
            liveCam.srcObject = mediaStreamObj;
        }else{
            //Set video stream source to liveCam Video element in old browsers
            liveCam.src = window.URL.createObjectURL(mediaStreamObj);
        }

        //Show in liveCam video element what captured from webcam
        liveCam.onloadedmetadata = ev =>{liveCam.play()};

        let StartReacording = document.querySelector('#StrRecordeing');
        let StopReacording = document.querySelector('#StoRecordeing');
        let SavedClipe = document.querySelector('#savedClipe');

        //Add More Events
        let recorderBot = new MediaRecorder(mediaStreamObj);
        let chunks = [];

        //Start Reacordeing
        StartReacording.addEventListener('click',event =>{
            recorderBot.start();
            console.log(recorderBot.state);
            SavedClipe.style.display = 'none';
            liveCam.style.display = 'block';
            let notec = document.createElement('p');
            notec.textContent = "You are recordeing now !";
            notec.id = "note";
            document.querySelector('#options').appendChild(notec);
        });

        //Stop Reacordeing
        StopReacording.addEventListener('click',event =>{
            recorderBot.stop();
            console.log(recorderBot.state);
            SavedClipe.style.display = 'block';
            liveCam.style.display = 'none';
            document.querySelector('#note').remove();
        });

        recorderBot.ondataavailable = event =>{
            chunks.push(event.data);
        };
        recorderBot.onstop = event =>{
            let blob = new Blob(chunks,{'type':'video/mp4;'});
            chunks = [];
            let videoURL = window.URL.createObjectURL(blob);
            SavedClipe.src = videoURL;
        }
    })
    //If there any error show the name of it and message
    .catch(error =>{
        console.log(`${error.name} ${error.message}`);
    })