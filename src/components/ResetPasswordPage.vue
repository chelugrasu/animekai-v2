<template>
    <div class="BackgroundOverlay">
      <div class="UIBackground"></div>
     </div>
  <div class="resetBox">
      <div class="Title">Resetează-ți parola</div>
      <div class="Description">Parolele introduse mai sus trebuie să coincidă pentru resetarea acestora.</div>
        <div class="passwordOne" :class="{'animate-error': animatePasswordOne}">
            <input class="Input" v-bind:type="passwordOneType" v-model="formData.passwordOne" @blur="checkInput2" />
            <label class="inputText" id="passwordOneInputText" :class="{ 'has-value': hasValue2 }">Password</label>
            <font-awesome-icon class="showPasswordIcon" v-show="showPasswordOne" :icon="['fas', 'eye-slash']" @click="togglePasswordDisplay(true, 1)"/>
            <font-awesome-icon class="showPasswordIcon" v-show="hidePasswordOne" :icon="['fas', 'eye']" @click="togglePasswordDisplay(false, 1)"/>
        </div>
        <div class="errorDetails" style="top: 33vh;" v-show="showPasswordOneErrorDetails">
          <font-awesome-icon class="exclamationMark" :icon="['fas', 'exclamation']" shake />
          <div class="errorDetailsBox" :style="`width: ${passwordOneWidth}vh`">
            <div class="detail" v-text="passwordOneText"></div>
          </div>
        </div>
        <div class="passwordTwo" :class="{'animate-error': animatePasswordTwo}">
            <input class="Input" v-bind:type="passwordTwoType" style="top: 2.2vh;" v-model="formData.passwordTwo" @blur="checkInput3" />
            <label class="inputText" id="passwordTwoInputText" :class="{ 'has-value': hasValue3 }">Confirm Password</label>
            <font-awesome-icon class="showPasswordIcon" v-show="showPasswordTwo" :icon="['fas', 'eye-slash']" @click="togglePasswordDisplay(true, 2)"/>
            <font-awesome-icon class="showPasswordIcon" v-show="hidePasswordTwo" :icon="['fas', 'eye']" @click="togglePasswordDisplay(false, 2)"/>
        </div>
        <div class="errorDetails" style="top: 43vh;" v-show="showPasswordTwoErrorDetails">
          <font-awesome-icon class="exclamationMark" :icon="['fas', 'exclamation']" shake />
          <div class="errorDetailsBox" :style="`width: ${passwordTwoWidth}vh`">
            <div class="detail" v-text="passwordTwoText"></div>
          </div>
        </div>
      <div class="resetButton" @click="checkToken()">
          <div class="resetText">RESETARE</div>
      </div>
  </div>
</template>

<script>
import router from '@/router';


export default {
    data() {
        return {
            formData: {
                passwordOne: '',
                passwordTwo: '',
                resetToken: '',
            },
        hasValue2: false,
        hasValue3: false,
        animatePasswordOne: false,
        animatePasswordTwo: false,
        showPasswordOneErrorDetails: false,
        showPasswordTwoErrorDetails: false,
        passwordOneText: '',
        passwordTwoText: '',
        passwordOneWidth: 0,
        passwordTwoWidth: 0,
        showPasswordOne: true,
        hidePasswordOne: false,
        passwordOneType: "password",
        showPasswordTwo: true,
        hidePasswordTwo: false,
        passwordTwoType: "password"
        };
    },
  methods: {
    checkInput2() {
      this.hasValue2 = this.formData.passwordOne !== '';
    },
    checkInput3() {
      this.hasValue3 = this.formData.passwordTwo !== '';
    },
    togglePasswordDisplay(bool, password){
        if(bool && password === 1){
            this.showPasswordOne = false
            this.hidePasswordOne = true
            this.passwordOneType = "text"
        }else if(!bool && password === 1){
            this.showPasswordOne = true
            this.hidePasswordOne = false
            this.passwordOneType = "password"
        }else if(bool && password === 2){
          this.showPasswordTwo = false
          this.hidePasswordTwo = true
          this.passwordTwoType = "text"
        }else if(!bool && password === 2){
          this.showPasswordTwo = true
          this.hidePasswordTwo = false
          this.passwordTwoType = "password"
        }
    },
     async checkToken(){
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      this.passwordOneText = '';
      this.passwordOneWidth = 0;
      this.showPasswordOneErrorDetails = false
      this.passwordTwoText = '';
      this.passwordTwoWidth = 0;
      this.showPasswordTwoErrorDetails = false
      if (token) {
        
        this.formData.resetToken = token
        console.log(this.resetToken)
        const response = await fetch(`${process.env.VUE_APP_API_BASE_URL}/api/resetPass`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(this.formData)
        });
        if (response.ok){
          router.push('/home');
        }else{
          const data = await response.json();
          if(data.message === "Invalid password one"){
            this.passwordOneText = 'Minim 8 caractere, cu o majusculă și o cifră.';
            this.passwordOneWidth = 26;
            this.showPasswordOneErrorDetails = true
            this.animatePasswordOne = true;
                setTimeout(() => {
                this.animatePasswordOne = false;
            }, 500);
          }else if(data.message === 'Invalid password two'){
            this.passwordTwoText = 'Minim 8 caractere, cu o majusculă și o cifră.';
            this.passwordTwoWidth = 26;
            this.showPasswordTwoErrorDetails = true
            this.animatePasswordTwo = true;
                setTimeout(() => {
                this.animatePasswordTwo = false;
            }, 500);
          }else if(data.message === 'Passwords are different'){
            this.passwordOneText = 'Parolele nu sunt aceleași.';
            this.passwordOneWidth = 16;
            this.showPasswordOneErrorDetails = true
            this.passwordTwoText = 'Parolele nu sunt aceleași.';
            this.passwordTwoWidth = 16;
            this.showPasswordTwoErrorDetails = true
            this.animatePasswordOne = true;
            this.animatePasswordTwo = true;
                setTimeout(() => {
                this.animatePasswordOne = false;
                this.animatePasswordTwo = false;
            }, 500);
          }else if(data.message === 'Token is invalid or expired'){
            router.push('/')
          }
        }
      } else {
        router.push('/');
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
.resetBox{
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
  font-size: 1.45vh;
  letter-spacing: 0.15vh;
  max-width: 37.5vh;
  text-align: center;
  color: rgb(180, 180, 180);
  position: absolute;
  top: 62.5vh;
  user-select: none;
}

.resetButton{
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
  top: 55vh;
  transition: 0.5s;
}
.resetButton:hover{
  color: var(--primary-color);
  outline: 0.25vh solid var(--primary-color);
  filter: drop-shadow(0vh 0vh 0.5vh var(--primary-color));
  background-color: rgba(29,29,29,0.5);
}
.resetText{
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

.passwordOne{
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
.passwordOne:focus-within{
    border: 0.25vh solid var(--primary-color);
}

#passwordOneInputText{
    left: -28vh;
}

#passwordOneInputText.has-value{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -31.5vh;
}
.Input:focus + #passwordOneInputText{
    font-weight: 300;
    font-size: 1.5vh;
    top: -2vh;
    left: -31.5vh;
}

.passwordTwo{
    position: absolute;
    top: 40vh;
    width: 40vh;
    height: 8vh;
    /* display: flex; */
    border: 0.25vh solid transparent;
    border-radius: 1vh;
    align-items: center;
    justify-content: center;
    transition: 0.5s;
}
.passwordTwo:focus-within{
    border: 0.25vh solid var(--primary-color);
}

#passwordTwoInputText{
    width: 50vh;
    display: initial;
    width: 15vh;
    top: -1.5vh;
    left: 2vh;
}

#passwordTwoInputText.has-value{
    width: 15vh;
    font-weight: 300;
    font-size: 1.5vh;
    top: -4.25vh;
    left: 2vh;
}
.Input:focus + #passwordTwoInputText{
    width: 15vh;
    font-weight: 300;
    font-size: 1.5vh;
    top: -4.25vh;
    left: 2vh;
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

  .errorDetails{
  position: absolute;
  z-index: 1;
  right: 15vh;
}

.exclamationMark{
  position: absolute;
  top: 0.9vh;
  right: -3.5vh;
  color: rgb(146, 60, 60);
  width: 2.5vh;
  height: 2.5vh;
  z-index: 100;
}

.errorDetailsBox{
  position: absolute;
  height: 3vh;
  clip-path: inset(0 0 0 100%);
  top: 0.5vh;
  right: -4vh;
  z-index: 2;
  background-color: rgb(29,29,29);
  border-radius: 0.5vh;
  border: 0.25vh solid red;
  display: flex;
  align-items: center;
  justify-content: center;
}
.errorDetails:hover .errorDetailsBox{
  animation: reveal 0.5s forwards ease-in-out;
}

@keyframes reveal {
  from {
    clip-path: inset(0 0 0 100%);
  }
  to {
    clip-path: inset(0 0 0 0);
  }
}

.detail{
  user-select: none;
  pointer-events: none;
  position: relative;
  position: absolute;
  font-family: 'Roboto', sans-serif;
  font-weight: 300;
  font-size: 1.15vh;
  color: gray;
  left: 0.5vh;
}

.showPasswordIcon{
    position: absolute;
    color: white;
    left: 33vh;
    top: 4vh;
    width: 2vh;
    height: 2vh;
    cursor: pointer;
}

</style>
