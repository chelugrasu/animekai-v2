<template>
    <div class="BackgroundOverlay">
      <div class="UIBackground"></div>
     </div>
  <div class="ForgotBox">
      <div class="Title">Recuperare parolă</div>
      <div class="Description">Prin apăsarea butonului de mai sus un e-mail va fi trimis câtre adresa introdusă.</div>
      <div class="email" :class="{'animate-error': animateEmail}">
            <input class="Input" type="email" v-model="formData.emailValue" @blur="checkInput2" />
            <label class="inputText" id="emailInputText" :class="{ 'has-value': hasValue2 }">Email</label>
        </div>
      <div class="forgotButton" @click="sendForgotten()">
          <div class="forgotText">TRIMITE EMAIL</div>
      </div>
  </div>
</template>

<script>
import router from '@/router';


export default {
    data() {
        return {
            formData: {
                emailValue: '',
            },
        hasValue2: false,
        animateEmail: false,
        };
  },
  methods: {
    checkInput2() {
      this.hasValue2 = this.formData.emailValue !== '';
    },
    async sendForgotten(){
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/forgotPassword`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });
        if (response.ok){
          router.push('/');
        }else{
            const data = await response.json();
            if(data.message === "Invalid Credentials"){
                this.animateEmail = true;
                setTimeout(() => {
                this.animateEmail = false;
                }, 500);
            }
        }
    },
    async checkUserToken() {
      const authToken = localStorage.getItem('authToken');
      if (authToken) {
        try {
          const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/isLoggedIn`, {
            headers: { Authorization: `Bearer ${authToken}` }
          });
          const userData = await response.json();
          if(userData){
            router.push('/home');
            console.log(userData.user.userId)
          }else(
            console.log('not logged in')
          )
        } catch (error) {
          console.error('Automatic login failed:', error);
          localStorage.removeItem('authToken');
        }
      }
    },
  },
  mounted(){
    this.checkUserToken()
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
background-image: url(../assets/tokyoGhoulBackground.jpg);
background-color: black;
filter: blur(1vh);
}
.ForgotBox{
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
  top: 50vh;
  user-select: none;
}

.forgotButton{
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
  top: 43vh;
  transition: 0.5s;
}
.forgotButton:hover{
  color: var(--primary-color);
  outline: 0.25vh solid var(--primary-color);
  filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
  background-color: rgba(29,29,29,0.5);
}
.forgotText{
  position: absolute;
  font-family: 'Roboto', sans-serif;
  font-weight: 600;
  font-size: 1.75vh;
  color: inherit;
  pointer-events: none;
  user-select: none;
}

.Input{
    font-family: 'Roboto', sans-serif;
    font-weight: 300;
    position: relative;
    color: white;
    width: 40vh;
    height: 5vh;
    background-color: transparent;
    top: 1vh;
    left: 2vh;
    outline: none;
    border: none;
    font-size: 2.25vh;
}
.inputText{
    font-family: 'Roboto', sans-serif;
    font-weight: 400;
    font-size: 2.25vh;
    color: gray;
    position: relative;
    top: 1vh;
    left: -27.6vh;
    transition: 0.5s;
    pointer-events: none;
    user-select: none;
}

.inputText.has-value{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -31vh;
}
.Input:focus + .inputText{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -31vh;
}

.email{
    position: absolute;
    top: 30vh;
    width: 40vh;
    height: 8vh;
    border: 0.25vh solid transparent;
    border-radius: 1vh;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
}
.email:focus-within{
    border: 0.25vh solid var(--primary-color);
}

#emailInputText{
    left: -32.25vh;
}

#emailInputText.has-value{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -34.15vh;
}
.Input:focus + #emailInputText{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -34.15vh;
}

.animate-error {
    border: 0.25vh solid red;
    animation: moveLeftRight 0.25s ease-in-out;
  }

  @keyframes moveLeftRight {
    0% {
      transform: translateX(0vh);
    }
    25%{
      transform: translateX(2vh);
    }
    75%{
      transform: translateX(-2vh);
    }
    100% {
      transform: translateX(0vh); /* Adjust the distance as desired */
    }
  }

</style>
