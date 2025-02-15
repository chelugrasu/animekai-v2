<template>
    <div class="BackgroundOverlay">
      <div class="UIBackground"></div>
     </div>
  <div class="ValidateBox">
      <div class="Title">Schimbare adresa email</div>
      <p class="oldEmail" v-text="oldEmail"></p>
      <font-awesome-icon class="arrow-down" :icon="['fas', 'arrow-down']" />
      <p class="newEmail" v-text="newEmail"></p>
      <div class="Description">Prin apăsarea butonului de mai sus sunteți de acord cu validarea adresei de email a dumneavoastră pe pagina noastră.</div>
      <div class="validateButton" @click="changeEmail()">
          <div class="validateText">SCHIMBARE</div>
      </div>
  </div>
  <div v-if="notificationData.showNotification" class="notification">
            <div class="notification-container">
                <p class="notification-title" :style="{ color: notificationData.notificationTitleColor }">{{ notificationData.notificationTitle }}</p>
                <p class="notification-date">{{ notificationData.notificationDate }}</p>
                <p class="notification-content" v-html="notificationData.notificationContent"></p>
                <div class="notification-close-button" @click="notificationData.showNotification = !notificationData.showNotification; redirect('/home')">
                    <p>Am înțeles</p>
                </div>
            </div>
        </div>
</template>

<script>
import router from '@/router';


export default {
    data(){
        return{
            oldEmail: '',
            newEmail: '',
            notificationData: {
                showNotification: false,
                notificationTitle: '',
                notificationTitleColor: '',
                notificationDate: '',
                notificationContent: ``,
            }
        }
    },
    methods: {
        async changeEmail(){
            const urlParams = new URLSearchParams(window.location.search);
            const token = urlParams.get('token');
            if (token) {
                const formData = {
                emailChangeToken: token
                } 
                const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/changeEmail`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
                });
                if (response.ok){
                    const data = await response.json();
                    if((data.type === 'sentSecondEmail')){
                        const email = data.email
                        this.notificationData.showNotification = true
                        this.notificationData.notificationTitle = 'Notificare modificări'
                        this.notificationData.notificationTitleColor = 'rgb(0,200,0)'
                        const currentDate = new Date();
                        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
                        this.notificationData.notificationDate = `${formattedDate}`
                        this.notificationData.notificationContent = 
                        `
                            Un email a fost expediat către adresa de email: 
                            <br>
                            <br>
                            <span style="color: #f6b700; font-size: 18px; font-weight: 700;">${email}</span>
                            <br>
                            <br>
                            Pentru confimarea contului de email , continuați pașii din e-mail-ul expediat.
                            <br>
                            Email-ul poate ajunge în maximum 10 minute, dacă acesta nu a ajuns raportează pe discord sau email-ul nu este valid.
                        `
                    }else if(data.type === 'emailChanged'){
                        const email = data.email
                        this.notificationData.showNotification = true
                        this.notificationData.notificationTitle = 'Notificare modificări'
                        this.notificationData.notificationTitleColor = 'rgb(0,200,0)'
                        const currentDate = new Date();
                        const formattedDate = `${currentDate.getDate()}/${currentDate.getMonth() + 1}/${currentDate.getFullYear()}`;
                        this.notificationData.notificationDate = `${formattedDate}`
                        this.notificationData.notificationContent = 
                        `
                            Adresa de email a dumneavoastră a fost schimbată cu succes în:
                            <br>
                            <br>
                            <span style="color: #f6b700; font-size: 18px; font-weight: 700;">${email}</span>
                            <br>
                            <br>
                            Prin apăsarea butonului de mai jos veți fi redirecționat către pagina de Acasă.
                        `
                    }
                }else{
                    const data = await response.json();
                    if(data.type === 'incorrectToken'){
                        router.push('/home')
                    }
                }
            } else {
                router.push('/home');
            }
        },
        redirect(url){
            router.push(url)
        }

    },
    async mounted(){
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get('token');
        if(!token){
            router.push('/home');
        }else{
            const formData = {
            emailChangeToken: token
            } 
            const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/changeEmail/getDetails`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
            });
            if (response.ok){
                const detailsData = await response.json();
                const details = detailsData.details
                console.log(details)
                this.oldEmail = details.oldEmail
                this.newEmail = details.newEmail

            }else{
                const data = await response.json();
                if(data.type === 'incorrectToken'){
                    router.push('/home')
                }
            }
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
background-image: url(../assets/BleachBackground.jpg);
background-position: center center;
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

.oldEmail{
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    color: white;
    font-size: 2.75vh;
    top: 30vh;
    filter: drop-shadow(0 0 2px white);
}

.arrow-down{
    position: absolute;
    top: 39.5vh;
    width: 45px;
    height: 45px;
    color: white;
}
.newEmail{
    position: absolute;
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    color: var(--primary-color);
    font-size: 2.75vh;
    top: 45vh;
    filter: drop-shadow(0 0 2px var(--primary-color));
}

.Description{
font-family: 'Roboto', sans-serif;
  font-weight: 200;
  font-size: 1.25vh;
  letter-spacing: 0.05vh;
  max-width: 37.5vh;
  text-align: center;
  color: rgb(180, 180, 180);
  position: absolute;
  top: 67.5vh;
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
  top: 60vh;
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

.notification{
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgb(20,20,20, .7);
    display: flex;
    align-items: center;
    justify-content: center;
    
}

.notification-container{
    position: absolute;
    min-height: 100px;
    max-height: 825px;
    min-width: 300px;
    max-width: 600px;
    padding: 10px;
    background-color: rgb(50,50,50);
    border-radius: 10px;
    font-family: 'Roboto', sans-serif;
    color: white;
    font-weight: 300;
    font-size: 17px;
    display: flex;
    justify-content: center;
    clip-path: inset(0 0 0 0);
    animation: reveal-profile-pictures 0.5s forwards ease-in-out;
}

@keyframes reveal-profile-pictures {
  from {
    clip-path: inset(100% 100% 100% 100%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}



.notification-title{
    position: absolute;
    margin-top: 5px;
    font-weight: 500;
}

.notification-date{
    position: absolute;
    margin-top: 30px;
    font-weight: 400;
    color: gray;
}

.notification-content{
    margin-top: 65px;
    text-align: center;
    padding-bottom: 50px
}

.notification-close-button{
    position: absolute;
    bottom: 10px;
    width: 150px;
    height: 35px;
    background-color: rgb(40,40,40, 1);
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 5px;
    transition: 0.3s ease;
    cursor: pointer;
}

.notification-close-button:hover{
    background-color: rgb(40,40,40, .6);
    filter: drop-shadow(0 0 5px rgb(0,150,0));
    transform: scale(1.05)
}

</style>
