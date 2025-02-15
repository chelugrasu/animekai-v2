<template>
      <div class="BackgroundOverlay">
        <div class="UIBackground"></div>
       </div>
    <div class="ValidateBox">
        <div class="Title">Validează-ți contul</div>
        <div class="Description">Prin apăsarea butonului de mai jos sunteți de acord cu validarea contului dumneavoastră pe pagina naostră.</div>
        <div class="validateButton" @click="checkToken()">
            <div class="validateText">VALIDARE</div>
        </div>
    </div>
  </template>
  
  <script>
import router from '@/router';


  export default {
    methods: {
       async checkToken(){
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if (token) {
          const formData = {
          verifyToken: token
          } 
          const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
          });
          if (response.ok){
            router.push('/home');
          }
        } else {
          router.push('/home');
        }
       }
    },
    mounted(){
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      if(!token){
        router.push('/home');
      }
    }
  }
  </script>
  
  <style scoped>
 .BackgroundOverlay{
position: absolute;
  height: 100.05vh;
  top: -0.05vh;
  left: 0vh;
  width: 142vh;
  background-color: rgba(0,0,0,0.75);
}
.UIBackground{
    position: absolute;
  height: 100.1vh;
  top: -0.05vh;
  left: 0vh;
  width: 142vh;
  z-index: -1;
  background-size: cover;
  background-repeat: no-repeat;
  background-image: url(../assets/JujutsuKaisenBackground.jpg);
  background-color: black;
  filter: blur(1vh);
}
.ValidateBox{
    position: absolute;
    top: 0vh;
    right: 0vh;
    width: 60vh;
    height: 100vh;
    background-color: rgba(29,29,29,1);
    display: flex;
    align-items: center;
    justify-content: center;
}
.Title{
    font-family: 'Roboto', sans-serif;
    font-weight: 500;
    font-size: 3.5vh;
    letter-spacing: 0.25vh;
    color: white;
    position: absolute;
    top: 20vh;
    user-select: none;
}

.Description{
  font-family: 'Roboto', sans-serif;
    font-weight: 200;
    font-size: 1.25vh;
    letter-spacing: 0.15vh;
    max-width: 37.5vh;
    text-align: center;
    color: rgb(180, 180, 180);
    position: absolute;
    top: 30vh;
    user-select: none;
}

.validateButton{
    color: white;
    position: absolute;
    width: 40vh;
    height: 6vh;
    background-color: rgba(29,29,29,0);
    outline: 0.25vh solid white;
    cursor: pointer;
    border-radius: 0.5vh;
    display: flex;
    align-items: center;
    justify-content: center;
    top: 40vh;
    transition: 0.5s;
}
.validateButton:hover{
    color: var(--primary-color);
    outline: 0.25vh solid var(--primary-color);
    filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
    background-color: rgba(29,29,29,0.5);
}
.validateText{
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 600;
    font-size: 1.75vh;
    color: inherit;
    pointer-events: none;
    user-select: none;
}

  </style>
  